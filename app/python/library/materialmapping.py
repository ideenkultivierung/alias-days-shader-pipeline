"""
Copyright 2023 Ideenkultivierung GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
"""

"""
Author: Christopher Gebhardt
Email: cg@ideenkultivierung.de
Website: www.ideenkultivierung.de
"""

"""
Material Mapper Library that is used to match material in imported VRED files to material in the material library. This 
is either done by comparing material names or material RGB values. Each function has an optional parameter threshold
which defines a fuzzyness for comparison.

There are different ways to use this script:
    1. Either import this whole script in the ScriptEditor of VRED. The functions will then be available in the global VRED namespace
    2. Add this file to the python libraries in the python installation e.g. "C:\Program Files\Autodesk\VREDPro-15.0\lib\python\Lib\site-packages"
       When doing this the material mapper must first be imported by adding "from materialmapping import MaterialMapper" to the startup script
       in the Preferences > Script
       It's also possible to import "from materialmapping import MaterialMapper" manually or from the streaming app.
  
"""

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