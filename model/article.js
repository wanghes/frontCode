var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var articleSchema = new Schema({
    title: String,
    cateid: Number,
    des:String,
    comments:[{body:String,date:{ type: Date, default: Date.now }}],
    path:String,
    imgpath:String,
    content:{
        type:String
    },
    author:{
        type:String,
        default:'wang_hes'
    },
    date:{ type: Date, default: Date.now }
});
var articleModel = mongoose.model('article', articleSchema);

var article = function(){};


article.prototype.queryAll = function (body,callback){
    var query;
    if(body){
        if(body.page){
            var offset = (body.page-1)*body.limit;
            query = articleModel.find({},null,{limit:body.limit,skip:offset});
        }else{
            query = articleModel.find({},null,{limit:body.limit});
        }
    }else{
        query = articleModel.find({});
    }
    query.select('author title date des cateid').sort({date:-1});
    query.exec(function(err,docs){
        console.log(docs)
        callback(err,docs);
    })
};

article.prototype.queryCounts = function(callback){
    var count = articleModel.find({}).count();
    count.exec(function(err,count){
      callback(err,count);
    });
};

article.prototype.queryCateCounts = function(cateId,callback){
    var count = articleModel.find({cateid:cateId}).count();
    count.exec(function(err,count){
        callback(err,count);
    });
};

article.prototype.getById = function(id,callback){
    if(id){
        var conditions = {
            _id:id
        };
        var query = articleModel.findOne(conditions);
        query.exec(function(err,doc){
            callback(err,doc);
        });
    }
};

article.prototype.getByCateId = function(cateId,body,callback){
    var conditions = {cateid:cateId},query;
    if(body){
        if(body.page){
            var offset = (body.page-1)*body.limit;
            query = articleModel.find(conditions,null,{limit:body.limit,skip:offset});
        }else{
            query = articleModel.find(conditions,null,{limit:body.limit});
        }
    }else{
        query = articleModel.find(conditions,null,{});
    }

    query.select('author title date cateid imgpath').sort({date:-1});
    query.exec(function(err,doc){
        callback(err,doc);
    });
};

article.prototype.getNextIdByDate = function(date,callback){
    articleModel.find({ date: { $gt: date }}).limit(1).select('_id cateid').sort({date:1}).exec(function(err,next){
        if(err){
            callback(err,next);
        }else{
            if(next){
                callback(err,next[0]);
            }else{
                callback(err,null);
            }
        }

    });
};

article.prototype.getPrevIdByDate = function(date,callback){
    articleModel.find({ date: { $lt: date }}).limit(1).select('_id cateid').sort({date:-1}).exec(function(err,prev){
        if(err){
            callback(err,prev);
        }else{
            if(prev){
                callback(err,prev[0]);
            }else{
                callback(err,null);
            }
        }

    });
};


module.exports = new article();
