var express = require('express');
var article = require('../model/article');
var eventProxy = require('eventproxy');
var router = express.Router();

router.get('/', function(req, res, next) {
    var proxy = new eventProxy();
    proxy.all('articles',function(articles){
        res.json({status:true,docs:articles,message:'fetch ok'});
    });

  article.queryAll(null,function(err,docs){
        if(err){
            res.json({status:true,message:err});
        }else{
            proxy.emit('articles',docs);
        }
  });

});

module.exports = router;