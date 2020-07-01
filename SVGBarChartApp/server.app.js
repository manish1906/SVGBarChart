var express = require("express"),
  app = express(),
  root = "" + __dirname;

console.log(root);
app.use(express.static(root));

app.use(function (req, res, next) {
  console.log(
    "Could not find file at " + req.url + ". Sending index.html instead."
  );
  res.contentType("text/html; charset=UTF-8");
  res.sendFile(root + "/app/index.html");
  req.header["Access-Control-Allow-Origin"] = "*";
});
module.exports = app;