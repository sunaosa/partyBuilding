const { render } = require("ejs");
var express = require("express");
var router = express.Router();
var models = require("../models");
var Sequelize = require('sequelize');

var Op = Sequelize.Op;
// 获取总数

// 获取党员信息
router.post('/selected', async function(req, res, next) {
    let members = []
    console.log(req.body.name + '111' + req.body.identify)
    if (req.body.name === '' && req.body.identify !== '') {
        members = await models.partyMembers.findAll({
            attributes: ['id', 'name', 'studentNumber', 'identify', 'count'],
            limit: 10 * req.body.page,
            where: {
                identify: req.body.identify
            }
        })
    } else if (req.body.name !== '' && req.body.identify === '') {
        members = await models.partyMembers.findAll({
            attributes: ['id', 'name', 'studentNumber', 'identify', 'count'],
            limit: 10 * req.body.page,
            where: {
                name: {
                    [Op.like]: '%' + req.body.name + '%'
                }
            }
        })
    } else if (req.body.name !== '' && req.body.identify !== '') {
        members = await models.partyMembers.findAll({
            attributes: ['id', 'name', 'studentNumber', 'identify', 'count'],
            limit: 10 * req.body.page,
            where: {
                name: {
                    [Op.like]: '%' + req.body.name + '%'
                },
                identify: req.body.identify
            }
        })
    } else {
        members = await models.partyMembers.findAll({
            attributes: ['id', 'name', 'studentNumber', 'identify', 'count'],
            limit: 10 * req.body.page,
        })
    }
    let totalMembers = await models.partyMembers.findAll()
    let total = totalMembers.length
    let memberValues = []
    members.forEach((item, list) => {
        item.dataValues['show'] = false
        memberValues.push(item.dataValues)
    });
    res.json({ memberValues, total })
});
router.post('/deleted', async function(req, res, next) {
    let count = await models.partyMembers.destroy({
        where: {
            id: req.body.id
        }
    })
    res.json(count)
})
router.post('/update', async function(req, res, next) {
    console.log(req.body)
    req.body.id = parseInt(req.body.id)
    let updateResult = await models.partyMembers.update({
        name: req.body.name,
        identify: req.body.identify,
        studentNumber: req.body.studentNumber,
        count: req.body.count
    }, {
        where: {
            id: req.body.id
        }
    })
    console.log(updateResult)
    res.json({ code: updateResult[0] })
})
router.post('/insert', async function(req, res, next) {
    let insertResult = await models.partyMembers.create({
        name: req.body.name,
        identify: req.body.identify,
        studentNumber: req.body.studentNumber,
        count: 0
    })
    if (insertResult.dataValues.name === req.body.name) {
        res.json({ result: 1 })
    } else
        res.json({ result: 0 })
    console.log(insertResult.dataValues.name)
})
router.post('/otherInfor', async function(req, res, next) {
    let studentNumber = await models.partyMembers.findAll({
        attributes: ['studentNumber'],
        where: {
            id: req.body.id
        }
    })
    let id = await models.users.findAll({
        attributes: ['id'],
        where: {
            username: studentNumber[0].dataValues.studentNumber
        }
    })
    if (id.length === 0) {
        res.json({ r: 0 })
    } else {
        let otherInfor = await models.usersInformation.findAll({
            attributes: ['phoneNumber', 'class'],
            where: {
                id: id[0].dataValues.id
            }
        })
        if (otherInfor[0].dataValues.class === null) {
            res.json({ r: 1 })
        } else {
            res.json(otherInfor[0].dataValues)
        }
        console.log(otherInfor[0].dataValues)
    }

    console.log(studentNumber[0].dataValues.studentNumber)
})
module.exports = router;