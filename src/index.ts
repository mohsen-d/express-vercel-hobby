const app = require("express")();
const path = require("path");

const vercelit = require("./vercelit");

vercelit(app, path.join(__dirname, "routes"));

app.listen(4000, () => console.log("server listening to port 4000..."));
