const { SECRET, DB_HOST, DB_USER, DB_PASSWORD, DB_DEFAULT_TB } = require('../../config.js');
// jwt
const jwt = require('jsonwebtoken');
// mysql
const mysql = require('mysql');
// redis
// const Redis = require('ioredis');

module.exports = {
  // jwt
  jwt: {
    // 生成签名
    sign(data = {}, expiresIn = '1days') {
      return new Promise(resolve => {
        jwt.sign(data, SECRET, (err, token) => {
          if (!err) {
            resolve(token);
          } else {
            console.log('jwt生成失败', data, expiresIn);
          };
        });
      });
    },
    // 验证有效性、解析
    verify(req) {
      const { headers } = req;
      return new Promise((resolve, reject) => {
        try {
          const decoded = jwt.verify(headers.authorization, SECRET);
          resolve(decoded);
        } catch(err) {
          reject(`jwt验证异常：${err}`);
        };
      });
    }
  },
  // mysql实例
  mysql(db_tb) {
    return new Promise((resolve, reject) => {
      const sql = mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: db_tb || DB_DEFAULT_TB
      });
      sql.connect(err => {
        if (err) {
          console.log(err, 'mysql实例创建失败');
        } else {
          // 查询方法
          sql.queryx = sentence => new Promise((resolve, reject) => {
            sql.query(sentence, (err, req) => {
              if (!err) {
                resolve(req);
              } else {
                sql.release();
                console.log(`mysql语句执行失败：${sentence}`, err);
                reject(err);
              };
            });
          });
          resolve(sql);
        };
      });
    });
  },
  // redis
  // redis: new Redis()
};

// 日期格式化
Date.prototype.format = function(fmt = 'yyyy-MM-dd hh:mm:ss') { 
  const o = {
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)); 
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00'+ o[k]).substr(('' + o[k]).length)));
    };
  };
  return fmt; 
};