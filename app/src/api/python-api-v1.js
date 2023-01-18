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
