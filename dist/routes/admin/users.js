"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { Request: Req, Response: Res } = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    return res.send("Users");
});
router.get("/:id", (req, res) => {
    return res.send("User no. " + req.params.id);
});
module.exports = router;
