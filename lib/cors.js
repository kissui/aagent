var express = require('express'),
    cors = require('cors');


// CORS 白名单


var corsOptions = {
  /*
  //
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
