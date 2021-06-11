const { render } = require("ejs");
var express = require("express");
var router = express.Router();
var models = require("../models");
var captcha = require('svg-captcha');
var jwt = require("../jwt/jwt");
// const { token } = require("morgan");
// var codeConfig = {

// }
// var captcha = svgCaptcha.create(codeConfig);
// fs.writeFileSync('./public/images/test.png', captcha.data);
// let valicateNumber = captcha.text.toLowerCase()
let valicateNumber = ''

router.get('/images', (req, res, next) => {
    const cap = captcha.create({
        size: 5, // 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        height: 44,
        background: '#fff',
        color: true
    });
    // req.session.cap = cap.text; // session 存储
    valicateNumber = cap.text
    res.type('svg'); // 响应的类型
    res.send(cap.data);
});


router.post("/login", async function(req, res, next) {
    console.log(valicateNumber)
    try {

        var user = await models.users.findAll({
            where: {
                username: req.body.username
            }
        })
        console.log(user)
        if (user[0].dataValues.passward === req.body.password) {
            if (req.body.valicateCode !== valicateNumber) {
                res.json('验证码错误')
            } else {
                let identify = await models.usersInformation.findAll({
                    attributes: ["identity"],
                    where: {
                        id: user[0].dataValues.id
                    }
                })
                let data = { isAdmin: user[0].dataValues.YorN, identity: identify[0].dataValues.identity, id: user[0].dataValues.id, username: req.body.username }
                let token = jwt.generateToken(data)
                res.json({ id: user[0].dataValues.id, token: token });
            }
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
        if (result1.dataValues !== "") {
            res.send("注册成功")
        }
    }
})

router.post("/autoLogin", async function(req, res, next) {
    let results = jwt.verifyToken(req.headers.auhorization)
    console.log(results)
    if (results === "已过期" || results === "不存在") {
        res.status(401).send({ status: 401, responseMsg: "error" })
    } else {
        res.status(200).send({ status: 401, responseMsg: "success" })
    }
})
router.post("/myInformation", async function(req, res, next) {
    let results = jwt.verifyToken(req.headers.auhorization)
        // var name = await models.users.findAll({
        //     attributes: ["YorN"],
        //     where: {
        //         id: req.body.autoLoginId
        //     }
        // })
    var information = await models.usersInformation.findAll({
        attributes: ["name"],
        where: {
            id: results.id
        }
    })
    console.log(information[0].dataValues)
    res.json({
        YorN: results.isAdmin,
        identity: results.identity,
        name: information[0].dataValues.name
    })
})
module.exports = router;