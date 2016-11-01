var express = require('express'),
    cors = require('cors');


// CORS 白名单
var whitelist = [
    'http://localhost:8000',    // SDK 的 DEMO
    'http://localhost:9000',    // 环信 IM DEMO
    'http://10.10.1.10:3004',   // 环信 IM DEMO
    'https://kefu.easemob.com', // 环信客服
];

var corsOptions = {
  /*
  // 由于环信开发时有开发、测试环境，而且访客端更无法枚举，所以暂不用白名单了
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  }
  */
  origin: '*'
};

// 普通 cors 检查
export default function() {
    return cors(corsOptions);
}

// @todo 可能需 export preflight

export function setPreflight(app) {
  app.options('*', cors());
}
