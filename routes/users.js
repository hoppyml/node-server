const express = require('express');
const { jwt, mysql, resp } = require('../public/js/common');

const router = express.Router();

// 获取当前绑定手机
router.get('/getBindMobile', function(req, res, next) {
  // 解析token
  jwt.verify(req).then(openid => {
    // 查询当前openid下绑定的所有手机号码
    mysql().then(sql => {
      sql.queryx(`SELECT mobile FROM mobile_bind WHERE openid = '${openid}'`).then(req => {
        sql.destroy();
        res.json({ status: 0, data: req });
      });
    });
  }).catch(err => {
    res.json({ status: 1, msg: err });
  });
});

module.exports = router;
