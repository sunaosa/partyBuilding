const { render } = require("ejs");
var express = require("express");
var router = express.Router();
var models = require("../models");
const path = require('path')
const fs = require('fs')
const multer = require('multer');
const { count } = require("console");
const { sequelize } = require("../models");
const upload = multer({ dest: "temp/" })
var jwt = require("../jwt/jwt");

router.post('/upload', async function(req, res, next) {
    try {
        let insertVideo = await models.videoInfor.create({
            videoPath: req.body.videoPath,
            theme: req.body.theme,
            title: req.body.title
        })
        res.send("上传成功")
    } catch (err) {
        res.send(err)
    }
})

router.post('/selected', async function(req, res, next) {
    try {
        let results = jwt.verifyToken(req.headers.auhorization)
        console.log(req.body)
        let selectVideo = await models.videoInfor.findAll({
                attributes: ['id', 'videoPath', 'title', 'theme'],
                order: [
                    ['id', 'DESC']
                ]
            })
            // let number = await models.users.findAll({
            //     attributes: ['username'],
            //     where: {
            //         id: req.body.id
            //     }
            // })
            // let studentNumber = number[0].dataValues.username
        let clock = await models.clockVideo.findAll({
            attributes: ['videoPath'],
            where: {
                studentNumber: results.username
            }
        })
        let clockInfo = []
        clock.forEach(element => {
            clockInfo[clockInfo.length] = element.dataValues.videoPath
        })
        let videoInfor = []
        selectVideo.forEach(element => {
            if (clockInfo.includes(element.dataValues.videoPath)) {
                element.dataValues['clock'] = true
            } else {
                element.dataValues['clock'] = false
            }
            videoInfor[videoInfor.length] = element.dataValues
        });
        let educateList = []
        let knowledgeList = []
        let activityList = []
        let othersList = []
        videoInfor.forEach((el, i) => {
            el['isShowVideo'] = false
            if (el.id === req.body.videoId) {
                el.isShowVideo = true
            }
            if (el.theme === '思想教育') {
                educateList.push(el)
            } else if (el.theme === '党务知识') {
                knowledgeList.push(el)
            } else if (el.theme === '党建活动') {
                activityList.push(el)
            } else {
                othersList.push(el)
            }
        })
        res.send({ educateList, knowledgeList, activityList, othersList })
    } catch (err) {
        res.send(err)
    }
})
router.post('/clock', async function(req, res, next) {
    try {
        let results = jwt.verifyToken(req.headers.auhorization)
            // let number = await models.users.findAll({
            //     attributes: ['username'],
            //     where: {
            //         id: req.body.id
            //     }
            // })
            // let studentNumber = number[0].dataValues.username
            // let identify = await models.usersInformation.findAll({
            //     attributes: ['identity'],
            //     where: {
            //         id: req.body.id
            //     }
            // })
        if (results.identity === '游客') {
            res.send('请实名')
        } else {
            let r = await models.clockVideo.findAll({
                attributes: ['id'],
                where: {
                    videoPath: req.body.videoPath,
                    studentNumber: results.username,
                }
            })
            if (r.length !== 0) {
                res.send('您之前打过卡')
            } else {
                let result = await models.clockVideo.create({
                    videoPath: req.body.videoPath,
                    studentNumber: results.username,
                    clock: 'y'
                })
                let updateCount = await models.partyMembers.increment(
                    'count', {
                        by: 1,
                        where: { studentNumber: results.username }
                    }
                );
                res.send('该视频打卡成功')
            }
        }
    } catch (err) {
        res.send(err)
    }
})
router.post('/clockCondition', async function(req, res, next) {
    try {
        let results = jwt.verifyToken(req.headers.auhorization)
        let clockCount = await models.partyMembers.findAll({
            attributes: ['count'],
            where: {
                studentNumber: results.username
            }
        })
        let totalCount = await models.videoInfor.findAndCountAll()
        if (clockCount.length === 0) {
            res.send([{ name: "已打卡", value: 0 }, { name: '未打卡', value: totalCount.count }])
        } else {
            res.send([{ name: "已打卡", value: clockCount[0].dataValues.count }, { name: '未打卡', value: totalCount.count - clockCount[0].dataValues.count }])
        }
        console.log(clockCount[0].dataValues.count)
    } catch (err) {
        res.send(err)
    }
})

router.post('/uploadFile', async function(req, res, next) {
    try {
        let count = await models.questionLib.update({
            filePath: req.body.filePath
        }, {
            where: {
                id: 1
            }
        })
        res.send('success')
    } catch (err) {
        console.log(err)
    }
})
router.get('/getFilePath', async function(req, res, next) {
    try {
        let file = await models.questionLib.findAll({
            attributes: ['filePath'],
            where: {
                id: 1
            }
        })
        res.send({ filePath: file[0].dataValues.filePath })
    } catch (err) {
        console.log(err)
    }
})
module.exports = router;