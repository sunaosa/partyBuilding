const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
let jwtOprate = {
    generateToken(data) {
        let created = Math.floor(Date.now() / 1000); //获取现在时间戳
        let cert = fs.readFileSync(path.join(__dirname, './config/pri.pem')); //私钥
        let token = jwt.sign({
            data,
            exp: created + 3600 * 24 * 30 //设置到期时间  本次设置一个月
        }, cert, { algorithm: 'RS256' });
        return token;
    },
    verifyToken(token) {
        try {
            let cert = fs.readFileSync(path.join(__dirname, './config/pub.pem')); //获取公钥
            let result = jwt.verify(token, cert, { algorithms: ['RS256'] }) || {}; // 通过公钥以及加密算法来解密token
            let { exp = 0 } = result, current = Math.floor(Date.now() / 1000); // 获取现在时间戳
            if (current <= exp) { // 计算是否过期
                res = result.data || {}; // 没过期获取数据
                return res; // 没过期返回数据
            } else {
                return "已过期" // 过期返回过期说明
            }
        } catch (e) {
            return "不存在" // 为传入token 返回不存在token
        }
    }
}
module.exports = jwtOprate