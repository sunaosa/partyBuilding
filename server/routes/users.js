const { render } = require("ejs");
var express = require("express");
var router = express.Router();
var models = require("../models");

router.post("/login", async function(req, res, next) {
    try {
        var user = await models.users.findAll({
            where: {
                username: req.body.username
            }
        })
        console.log(user)
        if (user[0].dataValues.passward === req.body.password) {
            res.json(user[0].dataValues.id);
        } else {
            res.send("密码错误");
        }
    } catch (error) {
        console.log(error)
        res.send("账号不存在")
    }
});

router.post("/register", async function(req, res, next) {
    try {
        var newUser = await models.users.findAll({
            attributes: ['passward'],
            where: {
                username: req.body.username
            }
        })
        if (newUser[0].dataValues !== "") {
            res.send("账号存在")
        }
    } catch (error) {
        var result = await models.users.create({
            username: req.body.username,
            passward: req.body.password,
            YorN: 'n'
        })
        var result1 = await models.usersInformation.create({
            id: result.dataValues.id,
            identity: "游客"
        })
        var result2 = await models.usersProfile.create({
            id: result.dataValues.id,
            profilePhotos: "../../static/default.png"
        })
        if (result1.dataValues !== "" && result2.dataValues !== "") {
            res.send("注册成功")
        }
    }
})

router.post("/autoLogin", async function(req, res, next) {
    var autoUser = await models.users.findAll({
        where: {
            id: req.body.autoLoginId
        }
    })
    console.log(autoUser)
    if (autoUser.length !== 0) {
        console.log("ok")
        res.send("ok")
    } else {
        res.send("no")
    }
})
router.post("/myInformation", async function(req, res, next) {
    var profile = await models.usersProfile.findAll({
        where: {
            id: req.body.autoLoginId
        }
    })
    console.log(profile[0].dataValues)
    var name = await models.users.findAll({
        attributes: ["YorN"],
        where: {
            id: req.body.autoLoginId
        }
    })
    console.log(name[0].dataValues)
    var information = await models.usersInformation.findAll({
        attributes: ["identity", "name"],
        where: {
            id: req.body.autoLoginId
        }
    })
    console.log(information[0].dataValues)
    res.json({
        profilePhotos: profile[0].dataValues.profilePhotos,
        YorN: name[0].dataValues.YorN,
        identity: information[0].dataValues.identity,
        name: information[0].dataValues.name
    })
})
module.exports = router;