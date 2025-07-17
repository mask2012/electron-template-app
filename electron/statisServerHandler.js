const express = require("express");
const path = require("path");

const server = express();
server.use(express.static(path.join(__dirname, "../dist")));

function startStaticServer() {
  server.listen(5536, () => {
    console.log("Express server is running on port 5536");
  });
}

module.exports = {
  startStaticServer,
};
