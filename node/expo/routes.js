/**
 * Created by sunmy on 16/4/28.
 */

var express = require('express');
var find = require('./modules/find');
var log = require('./modules/log');
var user = require('./modules/user');
var diary = require('./modules/diary');
var router = express.Router();

// 主页
router.get('/', function (req, res) {
    find.do('user');
    find.all(res, function (users) {
        res.render('index', {
            log_user: log.user,
            users: users
        });
    });
});
// 个人页
router.get('/profile/:id', function (req, res) {
    var id = req.params.id;

    find.do('user', id);
    find.info(res, function (info) {
        if (info) {
            res.render('profile', {
                log_user: log.user,
                cur_user: id,
                is_author: (id == log.user),
                userinfo: info
            });
        } else {
            res.render('../message', {
                log_user: log.user,
                code: 404,
                message: '这枚用户还未注册本站'
            });
        }
    });
});
// 注册页
router.get('/register', function (req, res) {
    res.render('register', {log_user: log.user});
});
// 发布页
router.get('/diary/publish', function (req, res) {
    if (log.user) {
        res.render('publish', {log_user: log.user});
    } else {
        res.redirect('/');
    }
});


router.post('/diaries', function (req, res) {
    var num = 5; // 分页单位
    var user = req.query.user;
    var page = req.query.page;
    var data = {
        status: 0,
        diaries: []
    };
    var getDiaryInfo = function (id, count) {
        find.do('diary', id);
        find.info(res, function (info) {
            info.is_faved = 0;
            info.voter_num = info.voters.length;
            if (log.user) {
                var voters = info.voters;
                for (var j = 0;j < voters.length;j++) {
                    if (log.user == voters[j]) {
                        info.is_faved = 1;
                        break;
                    }
                }
            }
            data.diaries.push(info);
            !count && res.end(JSON.stringify(data));
        });
    };

    find.do('user', user);
    find.info(res, function (info) {
        var diaries = info.diaries;
        var start = page * num;
        var end = (page + 1) * num;

        // 最末分页
        if (diaries.length - start <= num) {
            data.status = 1;
            end = diaries.length;
        }

        var count = end - start; // 计数器

        if (diaries.length) {
            for (var i = start;i < end;i++) {
                count--;
                getDiaryInfo(diaries[i], count);
            }
        } else {
            res.end(JSON.stringify(data));
        }
    });
});


router.post('/login', function (req, res) {
    log.login(req, res);
});
router.post('/logout', function (req, res) {
    log.logout(req, res);
});
router.post('/register', function (req, res) {
    log.register(req, res);
});
router.post('/exit', function (req, res) {
    log.exit(req, res);
});

// user
router.post('/user/edit/info', function (req, res) {
    user.edit.info(req, res, log.user);
});
router.post('/user/edit/portrait', function (req, res) {
    user.edit.portrait(req, res, log.user);
});

// diary
router.post('/diary/publish', function (req, res) {
    diary.publish(req, res, log.user);
});
router.post('/diary/favour/verify/:id', function (req, res) {
    diary.favour.verify(req, res, log.user, req.params.id);
});
router.post('/diary/favour/cancel/:id', function (req, res) {
    diary.favour.cancel(req, res, log.user, req.params.id);
});


module.exports = router;