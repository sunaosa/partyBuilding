const { render } = require("ejs");
var express = require("express");
var router = express.Router();
var models = require("../models");
var Sequelize = require('sequelize');
const { text } = require("express");
var jwt = require("../jwt/jwt");

router.post('/anounce', async function(req, res, next) {
    let results = jwt.verifyToken(req.headers.auhorization)
    let name = await models.usersInformation.findAll({
        attributes: ['name'],
        where: {
            id: results.id
        }
    })
    if (name[0].dataValues.name === null) {
        res.json({ text: '用户未实名' })
        return
    } else {
        let announceResult = await models.announcement.create({
            announcement: req.body.announceValue,
            issuer: name[0].dataValues.name
        })
        res.json({ text: '发布成功' })
    }
})
router.post('/isAdmin', async function(req, res, next) {
    try {
        let YorN = await models.users.findAll({
            attributes: ['YorN'],
            where: {
                id: req.body.id
            }
        })
        res.send({ isAdmin: YorN[0].dataValues.YorN })
    } catch (err) {
        console.log(err)
        res.send(err)
    }
})
router.post('/isAdmin', async function(req, res, next) {})

router.get('/selected', async function(req, res, next) {
    let date = new Date()
    let m = date.getMonth() > 10 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))
    let d = date.getDate() > 10 ? date.getDate() : '0' + date.getDate()
    let today = date.getFullYear() + '-' + m + '-' + d
    let announcement = await models.announcement.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4,
        attributes: ['announcement', 'issuer']
    })
    let list = {
        announcement: [],
        issuer: []
    }
    announcement.forEach((val, l) => {
        list.announcement[list.announcement.length] = val.dataValues.announcement
        list.issuer[list.issuer.length] = val.dataValues.issuer
    });
    res.json(list)
})
router.post('/select-all', async function(req, res, next) {
    let finalData = []
    if (req.body.page === 1) {
        let searchData = await models.announcement.findAll({
            order: [
                ['id', 'DESC']
            ],
            attributes: ['id', 'announcement', 'issuer', 'createdAt'],
            limit: 10,

        })
        searchData.forEach(el => {
            let date = el.dataValues['createdAt']
            let m = date.getMonth() > 10 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))
            let d = date.getDate() > 10 ? date.getDate() : '0' + date.getDate()
            let h = date.getHours() > 10 ? date.getHours() : '0' + date.getHours()
            let minutes = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()
            let createDate = date.getFullYear() + '-' + m + '-' + d + ' ' + h + ':' + minutes
            el.dataValues['createdAt'] = createDate
            let dateStamp = new Date(el.dataValues['createdAt']).getTime();
            el.dataValues['dateStamp'] = dateStamp
            finalData[finalData.length] = el.dataValues
        })
    } else {
        let searchData = await models.announcement.findAll({
            order: [
                ['id', 'DESC']
            ],
            attributes: ['id', 'announcement', 'issuer', 'createdAt'],
            limit: 30
        })
        searchData.forEach(el => {
            let date = el.dataValues['createdAt']
            let m = date.getMonth() > 10 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))
            let d = date.getDate() > 10 ? date.getDate() : '0' + date.getDate()
            let h = date.getHours() > 10 ? date.getHours() : '0' + date.getHours()
            let minutes = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes()
            let createDate = date.getFullYear() + '-' + m + '-' + d + ' ' + h + ':' + minutes
            el.dataValues['createdAt'] = createDate
            let dateStamp = new Date(el.dataValues['createdAt']).getTime();
            el.dataValues['dateStamp'] = dateStamp
            finalData[finalData.length] = el.dataValues
        })
    }
    res.json(finalData)
})
router.post('/delete', async function(req, res, next) {
    try {
        let result = await models.announcement.destroy({
            where: {
                id: req.body.id
            }
        })
        if (result === 1) {
            res.send('删除成功')
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;