export const importLibrariesScript = `
root = findNode("Root")
vrFileIOService.importFiles(
    [
        r"D:/Development/autodesk-vred-developer-day/library/materialmapping.py",
        r"D:/Development/autodesk-vred-developer-day/library/optimize.py",
        r"D:/Development/autodesk-vred-developer-day/library/lightmapping.py",
    ], root)
`;
