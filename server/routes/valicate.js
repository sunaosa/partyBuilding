const { render } = require("ejs");
var express = require("express");
var router = express.Router();
var models = require("../models");

router.post('/valicate-member', async function(req, res, next) {
    console.log(req.body)
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
                id: req.body.id
            }
        })
        console.log(updateInfor)
        res.json(updateInfor[0])
    } else {
        res.send('验证失败')
        return
    }
})
router.post('/initialize', async function(req, res, next) {
    let result = await models.usersInformation.findAll({
        attributes: ['sex', 'phoneNumber', 'name', 'class'],
        where: {
            id: req.body.id
        }
    })
    let studentNumber = await models.users.findAll({
        attributes: ['username'],
        where: {
            id: req.body.id
        }
    })
    let basicInformation = result[0].dataValues
    basicInformation['studentNumber'] = studentNumber[0].dataValues.username
    console.log(basicInformation)
    res.json(basicInformation)
})

module.exports = router;