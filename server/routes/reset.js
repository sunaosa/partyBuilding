const { render } = require("ejs");
var express = require("express");
var router = express.Router();
var models = require("../models");
var Sequelize = require('sequelize');
const { text } = require("express");

router.post('/valicateIdentity', async function(req, res, next) {
    let id = await models.users.findAll({
        attributes: ['id'],
        where: {
            username: req.body.valicateForm.studentNumber
        }
    })
    if (id.length === 0) {
        res.send("信息验证失败")
        return
    }
    let information = await models.usersInformation.findAll({
        attributes: ['name', 'phoneNumber', 'class'],
        where: {
            id: id[0].dataValues.id
        }
    })
    if (information[0].dataValues.name === req.body.valicateForm.name && information[0].dataValues.phoneNumber === req.body.valicateForm.phoneNumber && information[0].dataValues.class === req.body.valicateForm.class) {
        res.send("success")
    } else {
        res.send("信息验证失败")
    }
})

router.post('/valicatePassword', async function(req, res, next) {
    let id = await models.users.findAll({
        attributes: ['passward'],
        where: {
            username: req.body.valicateForm.studentNumber
        }
    })
    if (id.length === 0) {
        res.send("信息验证失败")
        return
    }
    if (id[0].dataValues.passward === req.body.valicateForm.password) {
        res.send("success")
    } else {
        res.send("信息验证失败")
    }
})

router.post('/resetPassword', async function(req, res, next) {
    try {
        let result = await models.users.update({
            passward: req.body.newPassword
        }, {
            where: {
                username: req.body.username
            }
        })
        res.send("修改成功")
    } catch (err) {
        res.send(err)
    }
})
module.exports = router;