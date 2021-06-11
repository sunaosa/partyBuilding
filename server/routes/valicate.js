const { render } = require("ejs");
var express = require("express");
var router = express.Router();
var models = require("../models");
var jwt = require("../jwt/jwt");
router.post('/valicate-member', async function(req, res, next) {
    console.log(req.body)
    let results = jwt.verifyToken(req.headers.auhorization)
    var result = await models.partyMembers.findAll({
        attributes: ['identify'],
        where: {
            name: req.body.valicateForm.name,
            studentNumber: req.body.valicateForm.studentNumber
        }
    })
    if (result.length !== 0) {
        let identify = result[0].dataValues.identify
        let updateInfor = await models.usersInformation.update({
            identity: identify,
            sex: req.body.valicateForm.sex,
            phoneNumber: req.body.valicateForm.phoneNumber,
            name: req.body.valicateForm.name,
            class: req.body.valicateForm.class
        }, {
            where: {
                id: results.id
            }
        })
        let data = { isAdmin: results.isAdmin, identity: identify, id: results.id, username: results.username }
        let token = jwt.generateToken(data)
        res.send({ updateInfor: updateInfor[0], token: token })
    } else {
        res.send('验证失败')
        return
    }
})
router.post('/initialize', async function(req, res, next) {
    let results = jwt.verifyToken(req.headers.auhorization)
    let result = await models.usersInformation.findAll({
        attributes: ['sex', 'phoneNumber', 'name', 'class'],
        where: {
            id: results.id
        }
    })
    let basicInformation = result[0].dataValues
    basicInformation['studentNumber'] = results.username
    console.log(basicInformation)
    res.json(basicInformation)
})
router.post('/identity', async function(req, res, next) {
    let results = jwt.verifyToken(req.headers.auhorization)
    console.log(results)
    if (results === "不存在" || results === "已过期") {
        res.status(401).send({ status: 401, responseMsg: "error" })
    } else {
        res.status(200).send({
            status: 200,
            response: { identity: results.identity, isAdmin: results.isAdmin }
        })
    }
})

module.exports = router;