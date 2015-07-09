/**
 * Created by Coffee on 15/7/5.
 */

var mongoose = require('mongoose');
var rand     = require('./random.js'),
    random   = rand.random;

var dataBase = {
    init: function(){
        return mongoose.createConnection('localhost', 'dwz');
    },
    shema: function(){
        return new mongoose.Schema({
            url: String,
            customUrl: {
                type: String,
                default: random.randomStr()
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        });
    }

};

var model = dataBase.init().model('urlList', dataBase.shema());

var findByUrl = function(dwz, callback){
    console.log(dwz);
    model.find(dwz, function(err, data){
        if(err){
            console.log(err);
        }
        if(data.length!=0){
            callback({
                status: 200,
                url: data[0].url,
                customUrl: data[0].customUrl
            });
        }else{
            callback({
                status: 404,
                msg: '数据没找到',
                data: dwz
            })
        }
    });
};

var addByUrl = function(dwz, callback){

    var dw = new model;

    if(dwz.customUrl !== undefined){
        dw.customUrl = dwz.customUrl;
    }
    dw.url = dwz.url;

    if(dwz.customUrl){
        //如果有自定义网址，判断是否存在
        findByUrl({customUrl: dw.customUrl}, function(data){
            //找到结果， 冲突
            if(data.status==200){
                callback({
                    status: 500,
                    msg: '错误，名称已经被占用'
                })
            }else if(data.status == 404){
                dw.save();
                callback({
                    status: 200,
                    url: dw.url,
                    customUrl: dw.customUrl
                });
            }
        });
    }else{
        //如果没有自定义网址，判断网址是否存在，存在就取出
        findByUrl({url: dw.url}, function(data){
            //找到结果， 冲突
            if(data.status==200){
                callback({
                    status: 200,
                    msg: '已经存在',
                    url: data.url,
                    customUrl: data.customUrl
                })
            }else if(data.status == 404){
                dw.save();
                callback({
                    status: 200,
                    url: dw.url,
                    customUrl: dw.customUrl
                });
            }
        });
    }
};


exports.addByUrl  = addByUrl;
exports.findByUrl = findByUrl;