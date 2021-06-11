var express = require("express");
var router = express.Router();
var models = require("../models");
var Sequelize = require('sequelize');
const { where } = require("sequelize");
var jwt = require("../jwt/jwt");

router.post('/submitError', async function(req, res, next) {
    let result = await models.problems.create({
        problemTitle: req.body.requestInfor.problems,
        problemDetails: req.body.requestInfor.requestDetails,
        requestor: req.body.requestInfor.requestName,
        requestNumber: req.body.requestInfor.requestNumber,
        state: '未解决'
    })
    res.send('发送成功，随时等待处理结果')
})
router.post('/getError', async function(req, res, next) {
    let results = jwt.verifyToken(req.headers.auhorization)
    let result = []
    if (results.isAdmin === "y") {
        if (req.body.choice === '') {
            result = await models.problems.findAll({
                attributes: ['id', 'problemTitle', 'problemDetails', 'requestNumber', 'requestor', 'state', 'responseMsg', 'updatedAt'],
                order: [
                    ['id', 'DESC']
                ]
            })
        } else {
            result = await models.problems.findAll({
                attributes: ['id', 'problemTitle', 'problemDetails', 'requestNumber', 'requestor', 'state', 'responseMsg', 'updatedAt'],
                where: {
                    state: req.body.choice
                },
                order: [
                    ['id', 'DESC']
                ]
            })
        }
    } else {
        // let studentNumber = await models.users.findAll({
        //     attributes: ['username'],
        //     where: {
        //         id: req.body.id
        //     }
        // })
        if (req.body.choice === '') {
            result = await models.problems.findAll({
                attributes: ['id', 'problemTitle', 'problemDetails', 'state', 'responseMsg', 'updatedAt'],
                where: {
                    requestNumber: results.username
                },
                order: [
                    ['id', 'DESC']
                ]
            })
        } else {
            result = await models.problems.findAll({
                attributes: ['id', 'problemTitle', 'problemDetails', 'state', 'responseMsg', 'updatedAt'],
                where: {
                    requestNumber: results.username,
                    state: req.body.choice
                },
                order: [
                    ['id', 'DESC']
                ]
            })
        }
    }
    let errorList = []

    result.forEach((el, i) => {
        let date = el.dataValues['updatedAt']
        let m = date.getMonth() > 10 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))
        let d = date.getDate() > 10 ? date.getDate() : '0' + date.getDate()
        let h = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()
        let minutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()
        let createDate = date.getFullYear() + '-' + m + '-' + d + ' ' + h + ':' + minutes
        el.dataValues['updatedAt'] = createDate
        errorList[errorList.length] = el.dataValues
    })
    res.send({ errorList: errorList })
})
router.post('/resolveProblem', async function(req, res, next) {
    try {
        let num = await models.problems.update({
            state: "已解决",
            responseMsg: req.body.responseMsg
        }, {
            where: {
                id: req.body.id
            }
        })
        res.send("已解决")
    } catch (err) {
        console.log(err)
    }
})
router.get('/getCount', async function(req, res, next) {
    try {
        let problemCount = await models.problems.findAndCountAll({
            where: {
                state: "未解决"
            }
        })
        res.send({ count: problemCount.count })
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;