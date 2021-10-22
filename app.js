const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const { name, version, author } = require("./package.json");
const appinfo = `${name} version ${version} by ${author}`

const app = new express();

app.use(express.static(path.join(__dirname, "/public")));

app.listen(PORT, () => { console.log(appinfo); });