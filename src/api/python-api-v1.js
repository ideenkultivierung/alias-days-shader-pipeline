export async function sendScript(script, ip, port) {
  const encodedScript = encodeURIComponent(script);
  return fetch(`http://${ip}:${port}/pythonapi?value=${encodedScript}`)
    .then(function (response) {
      if (response.status !== 200) {
        Promise.reject("sendScript error");
      }
      return response.text();
    })
    .then(function (data) {
      Promise.resolve(data);
    })
    .catch((error) => {
      Promise.reject(error);
    });
}
