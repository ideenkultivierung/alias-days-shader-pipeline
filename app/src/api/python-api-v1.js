import axios from "axios";

export async function sendScript(script, ip, port, errorCallback) {
  console.log(`Send to ${ip}:${port}: ${script}`);

  const encodedScript = encodeURIComponent(script);
  return new Promise(async (resolve, reject) => {
    let response;
    try {
      response = await axios.get(`http://${ip}:${port}/pythoneval2?value=${encodedScript}`);
    } catch (error) {
      if (errorCallback) {
        errorCallback();
      }
      reject(error);
    }
    if (response?.status !== 200) {
      reject("Failed to resceive response: " + response);
    }
    resolve(response?.data);
  });
}

export async function sendScriptLazy(script, ip, port, errorCallback) {
  console.log(`Send lazy to ${ip}:${port}: ${script}`);

  const encodedScript = encodeURIComponent(script);
  return new Promise(async (resolve, reject) => {
    try {
      await axios.get(`http://${ip}:${port}/pythoneval2?value=${encodedScript}`);
    } catch (error) {
      if (errorCallback) {
        errorCallback();
      }
    }
    resolve();
  });
}

/**
 * In order to inject the python script in VRED in runtime, we have to split it up in managble junks.
 * Otherwise the file size cannot be transmitted via the http request.
 *
 * This function splits the whole script in junks that are in itself valid python code:
 * - split very function on first level into one seperate junk
 * - take all other first-level statements in between an threat them as one junk
 *
 * This way we can incrementally inject the script into VRED without file size limits (as long as the script
 * can be split into small enough junks)
 *
 * When VRED Webinterface the "Secure Python" option is enabled, we also have to remove all commentary from our code.
 * This script will also do this.
 *
 * @param {*} script
 * @returns
 */
function splitScript(script) {
  const splittedParts = [];

  const lines = script.split("\n");
  const addLineToSegment = function (segment, line) {
    if (segment.length > 0) {
      segment = segment + "\n";
    }
    segment = segment + line;
    return segment;
  };

  const linesWithoutComments = [];

  // First remove all comments from the code, then split the script in usable junks
  // This could be done in one loop, but would become an unreadable mess

  // Remove comments
  let currentLine = 0;
  let currentLineIsComment = false;
  while (currentLine < lines.length) {
    const line = lines[currentLine];

    if (/^\s*'''.*'''/i.test(line)) {
      // console.log("SINGLE LINE COMMENT", line);
      // skip line
    } else if (/^\s*""".*"""/i.test(line)) {
      // console.log("SINGLE LINE COMMENT", line);
      // skip line
    } else if (!currentLineIsComment && (/^\s*'''/i.test(line) || /^\s*"""/i.test(line))) {
      // console.log("COMMENT START", line);
      // skip line
      currentLineIsComment = true;
    } else if (currentLineIsComment && (/^\s*'''/i.test(line) || /^\s*"""/i.test(line))) {
      // console.log("COMMENT END", line);
      // skip line
      currentLineIsComment = false;
    } else if (currentLineIsComment) {
      // console.log("COMMENT LINE", line);
      // skip line
    } else if (/^\s*#/i.test(line)) {
      // console.log("SINGLE LINE COMMENT", line);
      // skip line
    } else {
      linesWithoutComments.push(line);
    }
    currentLine++;
  }

  // Split into junks
  let currentSegment = "";
  currentLine = 0;
  let currentLineIsDef = false;
  let currentLineIsClass = false;
  while (currentLine < lines.length) {
    const line = linesWithoutComments[currentLine];

    if (line === undefined) {
      currentLine++;
      continue;
    }

    if (line.startsWith("@")) {
      // Start of function
      // console.log("FNC START", line);

      if (currentSegment.length > 0) {
        splittedParts.push(currentSegment);
      }
      currentSegment = line;
      currentLineIsDef = true;
    } else if (line.startsWith("def") && !currentLineIsDef) {
      // Start of function
      // console.log("FNC START", line);

      if (currentSegment.length > 0) {
        splittedParts.push(currentSegment);
      }
      currentSegment = line;
      currentLineIsDef = true;
    } else if (currentLineIsDef && /^[a-z0-9]/i.test(line) && !line.startsWith("def")) {
      // When a function was found, then we need to find the end of the function.
      // This should be the first line that starts again at the first column of the file
      // console.log("FNC END", line);
      currentLineIsDef = false;
      continue;
    } else if (line.startsWith("class") && !currentLineIsClass) {
      // Start of class
      // console.log("FNC START", line);

      if (currentSegment.length > 0) {
        splittedParts.push(currentSegment);
      }
      currentSegment = line;
      currentLineIsClass = true;
    } else if (currentLineIsClass && /^[a-z0-9]/i.test(line) && !line.startsWith("class")) {
      // When a class was found, then we need to find the end of the function.
      // This should be the first line that starts again at the first column of the file
      // console.log("FNC END", line);
      currentLineIsClass = false;
      continue;
    } else if (currentLineIsDef || currentLineIsClass) {
      // Function line -> write code to current segment
      // console.log("FNC LINE", line);
      currentSegment = addLineToSegment(currentSegment, line);
    } else {
      // Regular line -> write to current segment
      // console.log("REGULAR", line);
      currentSegment = addLineToSegment(currentSegment, line);
    }
    currentLine++;
  }

  splittedParts.push(currentSegment);
  return splittedParts;
}

export async function injectScript(script, ip, port) {
  const scriptParts = splitScript(script);
  return Promise.all(
    scriptParts.map((script) => {
      const encodedScript = encodeURIComponent(script);
      return new Promise(async (resolve, reject) => {
        let response;
        try {
          response = await axios.get(`http://${ip}:${port}/pythonapi?value=${encodedScript}`);
        } catch (error) {
          reject(error);
        }
        if (response?.status !== 200) {
          reject("Failed to resceive response: " + response);
        }
        resolve(response?.data);
      });
    })
  );
}
