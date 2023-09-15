const express = require("express");
const { Request: Req, Response: Res } = require("express");

const router = express.Router();

router.get("/", (req: typeof Req, res: typeof Res) => {
  return res.send("Users");
});

router.get("/:id", (req: typeof Req, res: typeof Res) => {
  return res.send("User no. " + req.params.id);
});

module.exports = router;
