/**
 * Created by Coffee on 15/7/4.
 */

var express    = require('express'),
    path       = require('path'),
    browser    = require('child_process'),
    bodyParser = require('body-parser');

var rand     = require('./views/modules/random.js'),
    random   = rand.random,
    urlCore  = require('./views/modules/core.js');



var port = 8888;
var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, './views/static')));
app.set('views', './views');
app.set('view engine', 'ejs');

app.listen(port);

var cmd = ''; //不同系统打开浏览器的方法
//操作系统判断
switch (process.platform){
    case 'wind32':
        cmd  = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"';
        break;
    case 'linux':
        cmd = 'xdg-open';
        break;
    case 'darwin':
        cmd = 'open';
}

console.log('server is start on port: ' + port);
//browser.exec(cmd + ' http://127.0.0.1:8888/');



app.get('/', function(req, res){
    res.render('index.ejs', {
        title: '欢迎使用短网址生成器'
    });
});

//添加网址
app.post('/addUrl', function(req, res){
    urlCore.addByUrl({
        url: req.body.url,
        customUrl: req.body.customUrl
    }, function(data){
        res.send(data);
    });
});

//网址解析
app.get('/:customUrl', function(req, res){
    var customUrl = req.params.customUrl;
    urlCore.findByUrl({customUrl: customUrl}, function(data){
        if(data.status==200){
            res.redirect(data.url);
        }else if(data.status==404){
            res.send('网址不存在');
        }
    })
});
