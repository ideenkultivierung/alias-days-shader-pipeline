
class Lightmapper():

    def bakeLightmaps_LowQuality(self):
        nodes = self.__findGeometryNodes()

        # All settings available at https://help.autodesk.com/view/VREDPRODUCTS/2022/ENU/?guid=VRED_Python_Documentation_Python_API_V2_class_vrdIlluminationBakeSettings_html
        illumniationSettings = vrdIlluminationBakeSettings()

        # Set direct illumination mode
        illumniationSettings.setDirectIlluminationMode(
            vrBakeTypes.DirectIlluminationMode.AmbientOcclusion)

        # Enable indirect illumination
        illumniationSettings.setIndirectIllumination(False)

        # All settings available at https://help.autodesk.com/view/VREDPRODUCTS/2022/ENU/?guid=VRED_Python_Documentation_Python_API_V2_class_vrdTextureBakeSettings_html
        textureBakeSettings = vrdTextureBakeSettings()
        textureBakeSettings.setRenderer(vrBakeTypes.Renderer.CPURaytracing)
        textureBakeSettings.setSamples(16)

        vrBakeService.bakeToTexture(
            nodes, illumniationSettings, textureBakeSettings)

    def bakeLightmaps_HighQuality(self):
        nodes = self.__findGeometryNodes()

        # All settings available at https://help.autodesk.com/view/VREDPRODUCTS/2022/ENU/?guid=VRED_Python_Documentation_Python_API_V2_class_vrdIlluminationBakeSettings_html
        illumniationSettings = vrdIlluminationBakeSettings()

        # Set direct illumination mode
        illumniationSettings.setDirectIlluminationMode(
            vrBakeTypes.DirectIlluminationMode.AmbientOcclusion)

        # Enable indirect illumination
        illumniationSettings.setIndirectIllumination(True)

        # Set indirect illumination reflections
        illumniationSettings.setIndirections(2)

        # All settings available at https://help.autodesk.com/view/VREDPRODUCTS/2022/ENU/?guid=VRED_Python_Documentation_Python_API_V2_class_vrdTextureBakeSettings_html
        textureBakeSettings = vrdTextureBakeSettings()
        textureBakeSettings.setRenderer(vrBakeTypes.Renderer.CPURaytracing)
        textureBakeSettings.setSamples(64)

        vrBakeService.bakeToTexture(
            nodes, illumniationSettings, textureBakeSettings)

    def __findGeometryNodes(self):
        return [node for node in vrNodeService.findNodes("*", True, False) if self.__isGeometryNode(node)]

    def __isGeometryNode(self, node):
        return toNode(node.getObjectId()).getType() == "Geometry"
