const { render } = require("ejs");
var express = require("express");
var router = express.Router();
var models = require("../models");
var Sequelize = require('sequelize');
var jwt = require("../jwt/jwt");
var Op = Sequelize.Op;
// 获取总数

// 获取党员信息

router.post('/identity', async function(req, res, next) {
    let results = jwt.verifyToken(req.headers.auhorization)
    let identity = await models.usersInformation.findAll({
        attributes: ['name'],
        where: {
            id: results.id
        }
    })
    res.send({ identity: results.identity, name: identity[0].dataValues.name, isAdmin: results.isAdmin })
})

router.get('/selected', async function(req, res, next) {
    let list = await models.moments.findAll({
        attributes: ['id', 'issuername', 'identity', 'content', 'imagePaths', 'createdAt'],
        order: [
            ['id', 'DESC']
        ]
    })
    let momentList = []
    list.forEach(el => {
        let date = el.dataValues['createdAt']
        let m = date.getMonth() > 10 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))
        let d = date.getDate() > 10 ? date.getDate() : '0' + date.getDate()
        let h = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()
        let minutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()
        let createDate = date.getFullYear() + '-' + m + '-' + d + ' ' + h + ':' + minutes
        el.dataValues['createdAt'] = createDate
        el.dataValues['imagePaths'] = el.dataValues['imagePaths'].split(',')
        el.dataValues['isShowLike'] = false
        momentList[momentList.length] = el.dataValues
    })
    res.send(momentList)
})
router.post('/insert', async function(req, res, next) {
    console.log(req.body.imagePath);
    console.log(111)
    let results = jwt.verifyToken(req.headers.auhorization)
    var name = await models.usersInformation.findAll({
        attributes: ['name'],
        where: {
            id: results.id
        }
    })
    var result = await models.moments.create({
        issuername: name[0].dataValues.name,
        identity: results.identity,
        content: req.body.content,
        imagePaths: req.body.imagePath
    })
    res.sendStatus(200)
})
router.post('/delete', async function(req, res, next) {
    try {
        var name = await models.moments.destroy({
            where: {
                id: req.body.id
            }
        })
        var deleteLike = await models.likeRecords.destroy({
            where: {
                issurId: req.body.id
            }
        })
        if (name === 1) {
            res.send('success')
        } else {
            res.send('error')
        }
    } catch (err) {
        res.send(err)
    }
})
router.post('/insertLike', async function(req, res, next) {
    try {
        let results = jwt.verifyToken(req.headers.auhorization)
        var name = await models.usersInformation.findAll({
            attributes: ['name'],
            where: {
                id: results.id
            }
        })
        var isLike = await models.likeRecords.findAll({
            attributes: ['id'],
            where: {
                issurId: req.body.issuerId,
                likePerson: name[0].dataValues.name
            }
        })
        if (isLike.length !== 0) {
            var name = await models.likeRecords.destroy({
                where: {
                    issurId: req.body.issuerId,
                    likePerson: name[0].dataValues.name
                }
            })
            res.send('取消成功')
        } else {
            var insertLike = await models.likeRecords.create({
                issurId: req.body.issuerId,
                likePerson: name[0].dataValues.name
            })
            res.send('点赞成功')
        }
    } catch (err) {
        res.send(err)
    }
})
router.get('/selectedLike', async function(req, res, next) {
    try {
        var result = await models.likeRecords.findAll({
            attributes: ['issurId', 'likePerson']
        })
        let likeRecords = []
        result.forEach((el, index) => {
            likeRecords.push(el.dataValues)
        })
        res.send(likeRecords)
    } catch (err) {
        res.send(err)
    }
})
module.exports = router;