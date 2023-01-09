var fs = require("fs");

console.log(__dirname);

// Rename index.html to app.html
fs.rename(__dirname + "/build/index.html", __dirname + "/build/app.html", function (err) {
  if (err) console.log("ERROR: " + err);
});
