from enum import Enum
import csv
from fuzzywuzzy import fuzz
import vrAssetsModule
import vrMaterialPtr

class MaterialMapper():

    def applyMaterialMappingByExactName(self):
        """
        Call vrAssetModules function to apply material from the asset manager based on the exact matching material name
        """
        vrMaterialPtr.applyMaterialAssetsByName()

    def applyMaterialMappingByNames(self, material_mapping_path: str, threshold: float=0.0):
        """
        Apply a material mapping by providing a path to a material library that is added in the asset manager, and
        a mapping table that maps a material name in the scene to a material in the library
        """
        mapping = self.__readNameToNameCsv(material_mapping_path)
        self.__applyMaterialByName(mapping, threshold)

    def applyMaterialMappingByRgb(self, material_mapping_path: str, threshold: float=0.0):
        """
        Apply a material mapping by providing a path to a material library that is added in the asset manager, and
        a mapping table that maps a material an RGB value of a material to a material in the library.
        When a material in the scene has an equal RGB value (with tolerance), the mapping is applied.
        """
        mapping = self.__readRgbToNameCsv(material_mapping_path)
        self.__applyMaterialByRgb(mapping, threshold)

    def __readNameToNameCsv(self, file_path: str):
        """
        Read a name to name mapping from a csv file and return it as a dictionary
        """
        with open(file_path, 'r') as mappingFile:
            reader = csv.reader(mappingFile, delimiter=';', quotechar='"')

            mapping = dict()
            for row in reader:
                fromName = row[0]
                toName = row[1]

                # check if both values are somewhat valid
                if bool(fromName) and bool(toName):
                    mapping[fromName] = toName

            return mapping

    def __readRgbToNameCsv(self, file_path: str):
        """
        Read an rgb to name mapping from a csv file and return it as a dictionary
        """
        with open(file_path, 'r') as mappingFile:
            reader = csv.reader(mappingFile, delimiter=';', quotechar='"')

            mapping = dict()
            for row in reader:
                rgbs = row[0]
                material = row[1]

                # check if both values are somewhat valid
                if bool(rgbs) and bool(material):
                    try:
                        # rgbs are seperated by space -> convert them to a tuple of string values (python magic!)
                        rgb = tuple([round(float(channel),2) for channel in rgbs.split(' ')])

                        if len(rgb) != 3:
                            raise

                        mapping[rgb] = material
                    except:
                        print(
                            "> [error] Could not parse rgb mapping {} -> {}".format(rgbs, material))
                        continue

            return mapping

    def __applyMaterialByName(self, mapping: dict, threshold: float=0.0):
        """
        Apply a material mapping by name. Search all materials for matches in the
        mapping dictionary. If a match is found, it will try to load the according
        material from the material library in the asset manager
        """
        materials = vrMaterialPtr.getAllMaterials()

        for material in materials:
            materialName = material.getName()

            mappedMaterialName = None
            if threshold == 0.0:
                if materialName in mapping:
                    mappedMaterialName = mapping[materialName]
                else:
                    mappedMaterialName = None
            else:
                mappedMaterialName = self.__matchMaterialNameFuzzy(materialName, mapping, threshold)
                
            if mappedMaterialName != None:    
                print("> Found mapping for {} -> {}".format(materialName, mappedMaterialName))

                # Load material asset and apply the material from the asset library
                replacementMaterial = vrAssetsModule.loadMaterialAssetByName(mappedMaterialName)

                # Get all nodes that use the original material
                nodes = material.getNodes()
                for node in nodes:
                    print("> Replace material '{}' on node '{}' with '{}'".format(materialName, node.getName(), mappedMaterialName))
                    node.setMaterial(replacementMaterial)

            else:
                print("> [warning] Found no mapping for {}".format(materialName))

    def __applyMaterialByRgb(self, mapping: dict, threshold: float=0.0):
        """
        Apply a material mapping by its RGB value. Search all materials for matches in the
        mapping dictionary. If a material with matching RGB values is found, it will try to load the according
        material from the material library in the asset manager
        """
        materials = vrMaterialPtr.getAllMaterials()

        for material in materials:
            materialName = material.getName()
            mappedMaterialName = None

            # Read diffuse color values from the material fields
            diffuseColor = material.fields().getVec("diffuseColor", 3)
            # Convert rgb values in a tuple of strings to compare it to our mapping
            materialRgb = tuple([round(float(value),2) for value in diffuseColor])

            if threshold == 0.0:
                # Match exact material color
                if materialRgb in mapping:
                    mappedMaterialName = mapping[materialRgb]
                else:
                    mappedMaterialName = None
            else:
                # Try matching color with threshold
                mappedMaterialName = self.__matchColorWithThreshold(materialRgb, mapping, threshold)

            if mappedMaterialName != None:
                print("> Found mapping for {} -> {}".format(materialRgb, mappedMaterialName))

                # Load material asset and apply the material from the asset library
                replacementMaterial = vrAssetsModule.loadMaterialAssetByName(mappedMaterialName)

                # Get all nodes that use the original material
                nodes = material.getNodes()
                for node in nodes:
                    print("> Replace material '{}' on node '{}' with '{}'".format(materialName, node.getName(), mappedMaterialName))
                    node.setMaterial(replacementMaterial)
            
            else:
                print("> [warning] Found no mapping for {} with rgb {}".format(materialName, materialRgb))

    def __matchColorWithThreshold(self, materialRgb: tuple, mapping: dict, threshold: float=0.0):
        """
        Find a rgb value in a dictionary but allow it to deviate by a specified threshold
        """
        for item in mapping.items():
            mappingColor, materialNameCandidate = item

            # Split up mapping color and material color
            mapping_color_r = mappingColor[0]
            mapping_color_g = mappingColor[1]
            mapping_color_b = mappingColor[2]

            material_color_r = materialRgb[0]
            material_color_g = materialRgb[1]
            material_color_b = materialRgb[2]

            # Just compare each color channel if it is inside the threshold.
            isInThreshold = True
            isInThreshold = isInThreshold and (abs(mapping_color_r - material_color_r) / 1.0) < threshold
            isInThreshold = isInThreshold and (abs(mapping_color_g - material_color_g) / 1.0) < threshold
            isInThreshold = isInThreshold and (abs(mapping_color_b - material_color_b) / 1.0) < threshold

            # Just return the first material that matches the criteria
            if isInThreshold:
                return materialNameCandidate
        
        return None

    
    def __matchMaterialNameFuzzy(self, materialName: str, mapping: dict, threshold: float=0.0):
        for item in mapping.items():
            mappingName, materialNameCandiate = item

            ratio = fuzz.ratio(materialName, mappingName)

            if ((100 - ratio) / 100) <= threshold:
                return materialNameCandiate

        return None