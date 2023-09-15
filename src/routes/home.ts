const express = require("express");
const { Request: Req, Response: Res } = require("express");

const router = express.Router();

router.get("/", (req: typeof Req, res: typeof Res) => {
  return res.send("Home");
});

module.exports = router;
