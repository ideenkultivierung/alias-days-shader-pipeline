import vrOptimize
from vrNodeUtils import calcVertexNormals


def optimizeScene():
    root = vrNodeService.findNode('Root')
    vrOptimize.cleanupGroupNodes(root)
    vrOptimize.mergeGeometry(root)
    vrOptimize.unifyVertices(root)
    vrOptimize.optimizeIndices(root)
    vrOptimize.sortIndices(root)
    calcVertexNormals()
