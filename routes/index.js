const express = require('express');
const https = require('https');
const { APP_ID, APP_SECRET } = require('../config.js');
const { jwt, mysql } = require('../public/js/common');

const router = express.Router();

// mysql().then(sql => {
//   // 查询数据库是否存在记录
//   sql.queryx(`SELECT * FROM user WHERE openid = '${openid}'`).then(req => {
//     const loginTime = new Date().format();
//     if (req.length > 0) {
//       // 更新状态
//       sql.queryx(`UPDATE user SET login_time = '${loginTime}', session_key = '${session_key}'`);
//     } else {
//       // 插入记录
//       sql.queryx(`INSERT INTO user VALUES (0, '${openid}', '${session_key}', '${loginTime}', '')`);
//     };
//     sql.destroy();
//     // 生成token
//     jwt.sign({ openid }).then(token => {
//       res.json({ status: 0, data: { token } });
//     });
//   }).catch(err => {
//     res.json({ status: 1, msg: '登录异常：数据库异常' });
//   });
// });

// 登录
router.post('/login', (req, res, next) => {
  const { type, code } = req.body;
  // 判断登录方式
  switch (type) {
    // 微信小程序
    case 'wechat':
      // 获取session_key、openid
      const options = {
        host: 'api.weixin.qq.com',
        path: `/sns/jscode2session?appid=${APP_ID}&secret=${APP_SECRET}&js_code=${code}&grant_type=authorization_code`,
        method: 'GET'
      };
      const httpReq = https.request(options, httpRes => {
        httpRes.setEncoding('utf8');
        httpRes.on('data', chunk => {
          const { openid, session_key } = JSON.parse(chunk);
          // 查询当前openid是否已绑定手机号
          mysql().then(sql => {
            sql.queryx(`SELECT moblie FROM user WHERE openid = '${openid}'`).then(req => {

            });
          });
        });
      });
      httpReq.on('error', function(e) {
        res.json({ status: 1, msg: '登录异常：获取openid失败' });
      });
      httpReq.end();
      break;
  };
});

module.exports = router;
