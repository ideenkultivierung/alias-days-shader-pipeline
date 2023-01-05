from fuzzywuzzy import fuzz

def test_fuzzy_wuzzy(materialName: str, mapping: dict, threshold:float=0.0):
    for item in mapping.items():
        mappingName, materialNameCandiate = item

        ratio = fuzz.ratio(materialName, mappingName)

        if ((100 - ratio) / 100) <= threshold:
            return materialNameCandiate

    return None


mapping = {
    "carpaint": "Carpaint",
    "chrome_brushed_something": "Something",
    "rims": "Rims",
}

matchedMaterial = test_fuzzy_wuzzy("carpaint", mapping, 0.0)
print(f"Match successfull: {str(matchedMaterial == 'Carpaint')}")

matchedMaterial = test_fuzzy_wuzzy("carpaint1", mapping, 0.0)
print(f"Match successfull: {str(matchedMaterial == 'Carpaint')}")

matchedMaterial = test_fuzzy_wuzzy("carpaint1", mapping, 0.1)
print(f"Match successfull: {str(matchedMaterial == 'Carpaint')}")

matchedMaterial = test_fuzzy_wuzzy("carpaint_1", mapping, 0.1)
print(f"Match successfull: {str(matchedMaterial == 'Carpaint')}")

matchedMaterial = test_fuzzy_wuzzy("carpaint_1", mapping, 0.2)
print(f"Match successfull: {str(matchedMaterial == 'Carpaint')}")

matchedMaterial = test_fuzzy_wuzzy("Carpaint_1", mapping, 0.25)
print(f"Match successfull: {str(matchedMaterial == 'Carpaint')}")

matchedMaterial = test_fuzzy_wuzzy("ChromeBrushed_Something", mapping, 0.25)
print(f"Match successfull: {str(matchedMaterial == 'Something')}")
