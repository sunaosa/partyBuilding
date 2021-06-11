const { render } = require("ejs");
var express = require("express");
var router = express.Router();
var models = require("../models");
var Sequelize = require('sequelize');
const { text } = require("express");
const { sequelize } = require("../models");
var jwt = require("../jwt/jwt");

const Op = Sequelize.Op;

let getTimestamp = function(date) {
    date = date.replace(/-/g, '/');
    var timestamp = new Date(date).getTime();
    return timestamp
}
let getState = function(start, over) {
    let startTimestamp = getTimestamp(start)
    let overTimestamp = getTimestamp(over)
    let nowTimeStamp = new Date().getTime()
    if (nowTimeStamp >= startTimestamp && nowTimeStamp <= overTimestamp) {
        return "正在进行"
    } else if (nowTimeStamp <= startTimestamp) {
        return "未开始"
    } else {
        return "已结束"
    }
}

router.post('/release', async function(req, res, next) {
    console.log(req.body.activity)
    let result = models.activity.create({
        startTime: req.body.activity.activeTime.startTime,
        overTime: req.body.activity.activeTime.overTime,
        name: req.body.activity.name,
        oop: req.body.activity.oop,
        content: req.body.activity.content,
        addressName: req.body.activity.addressName,
        latitude: req.body.activity.latitude,
        longitude: req.body.activity.longitude,
        admitDistance: req.body.activity.admitDiatance
    })
    res.send("success")
})
router.post('/getActivity', async function(req, res, next) {
    let list = []
    let activityList = []
    if (req.body.identify === "" && req.body.state === "") {
        list = await models.activity.findAll({
            attributes: ["id", "name", "startTime", "overTime", "oop"],
            order: [
                ['id', 'DESC']
            ]
        })
        list.forEach(el => {
            el.dataValues['state'] = getState(el.dataValues.startTime, el.dataValues.overTime)
            el.dataValues["image"] = '/static/party.png'
            activityList[activityList.length] = el.dataValues
        })
    } else if (req.body.identify !== "" && req.body.state === "") {
        list = await models.activity.findAll({
            attributes: ["id", "name", "startTime", "overTime", "oop"],
            order: [
                ['id', 'DESC']
            ],
            where: {
                [Op.or]: [
                    { oop: req.body.identify },
                    { oop: "全部" }
                ]
            }
        })
        list.forEach(el => {
            el.dataValues['state'] = getState(el.dataValues.startTime, el.dataValues.overTime)
            el.dataValues["image"] = '/static/party.png'
            activityList[activityList.length] = el.dataValues
        })
    } else if (req.body.identify !== "" && req.body.state !== "") {
        list = await models.activity.findAll({
                attributes: ["id", "name", "startTime", "overTime", "oop"],
                order: [
                    ['id', 'DESC']
                ],
                where: {
                    [Op.or]: [
                        { oop: req.body.identify },
                        { oop: "全部" }
                    ]
                }
            }),
            list.forEach(el => {
                el.dataValues['state'] = getState(el.dataValues.startTime, el.dataValues.overTime)
                el.dataValues["image"] = '/static/party.png'
                if (el.dataValues.state === req.body.state) {
                    activityList[activityList.length] = el.dataValues
                }
            })
    } else {
        list = await models.activity.findAll({
            attributes: ["id", "name", "startTime", "overTime", "oop"],
            order: [
                ['id', 'DESC']
            ]
        })
        list.forEach(el => {
            el.dataValues['state'] = getState(el.dataValues.startTime, el.dataValues.overTime)
            el.dataValues["image"] = '/static/party.png'
            if (el.dataValues.state === req.body.state) {
                activityList[activityList.length] = el.dataValues
            }
        })
    }
    res.send(activityList)
})
router.post('/getDetailById', async function(req, res, next) {
    // let studentNumber = await models.users.findAll({
    //     attributes: ["username"],
    //     where: {
    //         id: req.body.userId
    //     }
    // })
    let results = jwt.verifyToken(req.headers.auhorization)
    let state = await models.activityClock.findAll({
        where: {
            activityId: req.body.activityId,
            studentNumber: results.username
        }
    })
    let result = await models.activity.findAll({
        where: {
            id: req.body.activityId
        }
    })
    if (state.length !== 0) {
        result[0].dataValues['clock'] = true
    }
    result[0].dataValues['state'] = getState(result[0].dataValues.startTime, result[0].dataValues.overTime)
    res.send({ activityList: result[0].dataValues })
})
router.post('/clock', async function(req, res, next) {
    let time = await models.activity.findAll({
        attributes: ["startTime", "overTime"],
        where: {
            id: req.body.activityId
        }
    })
    if (getState(time[0].startTime, time[0].overTime) === "已结束") {
        res.send("活动已结束")
        return
    }
    let results = jwt.verifyToken(req.headers.auhorization)
    let name = await models.usersInformation.findAll({
        attributes: ["name"],
        where: {
            id: results.id
        }
    })
    let result = await models.activityClock.create({
        activityId: req.body.activityId,
        name: name[0].dataValues.name,
        studentNumber: results.username
    })
    res.send("success")
})
router.post('/getClock', async function(req, res, next) {
    let result = []
    let clockList = []
    if (req.body.status === false) {
        result = await models.activityClock.findAll({
            attributes: ["studentNumber", "name"],
            where: {
                activityId: req.body.activityId
            }
        })
        result.forEach((el, index) => {
            el.dataValues["ifClock"] = "是"
            clockList.push(el)
        })
        res.send(clockList)
    } else {
        if (req.body.oop === "全部") {
            result = await sequelize.query("select studentNumber, name from partymembers where studentNumber not in(select studentNumber from activityclocks where activityId=" + req.body.activityId + ")");
        } else if (req.body.oop === "党员") {
            result = await sequelize.query("select studentNumber, name from partymembers where studentNumber not in(select studentNumber from activityclocks where activityId=" + req.body.activityId + ") and identify='党员'");
        } else {
            result = await sequelize.query("select studentNumber, name from partymembers where studentNumber not in(select studentNumber from activityclocks where activityId=" + req.body.activityId + ") and identify='入党申请人'");
        }
        console.log(result[0][0])
        result[0].forEach((el, index) => {
            el["ifClock"] = "否"
            clockList.push(el)
        })
        res.send(clockList)
    }
})
router.post('/output', async function(req, res, next) {
    let clockList = []
    let result2 = []
    let result0 = await models.activityClock.findAll({
        attributes: ["studentNumber", "name"],
        where: {
            activityId: req.body.activityId
        }
    })
    result0.forEach((el, index) => {
        el.dataValues["ifClock"] = "是"
        clockList.push(el)
    })
    if (req.body.oop === "全部") {
        result2 = await sequelize.query("select studentNumber, name from partymembers where studentNumber not in(select studentNumber from activityclocks where activityId=" + req.body.activityId + ")");
    } else if (req.body.oop === "党员") {
        result2 = await sequelize.query("select studentNumber, name from partymembers where studentNumber not in(select studentNumber from activityclocks where activityId=" + req.body.activityId + ") and identify='党员'");
    } else {
        result2 = await sequelize.query("select studentNumber, name from partymembers where studentNumber not in(select studentNumber from activityclocks where activityId=" + req.body.activityId + ") and identify='入党申请人'");
    }
    result2[0].forEach((el, index) => {
        el["ifClock"] = "否"
        clockList.push(el)
    })
    res.send(clockList)
})

module.exports = router;