const express = require("express");
const { Request: Req, Response: Res } = require("express");

const router = express.Router();

router.get("/", (req: typeof Req, res: typeof Res) => {
  return res.send("Admin Home");
});

router.get("/settings", (req: typeof Req, res: typeof Res) => {
  return res.send("Admin Settings");
});

module.exports = router;
