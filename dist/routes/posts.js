"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { Request: Req, Response: Res } = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    return res.send("Posts");
});
router.get("/:id", (req, res) => {
    return res.send("Post no. " + req.params.id);
});
module.exports = router;
