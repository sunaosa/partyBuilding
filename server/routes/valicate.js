const { render } = require("ejs");
var express = require("express");
var router = express.Router();
var models = require("../models");

router.post('/valicate-member', async function(req, res, next) {
    console.log(req.body)
})

module.exports = router;