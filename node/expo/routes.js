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
    find.all(function (users) {
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
    find.info(function (info) {
        if (info) {
            res.render('profile', {
                is_author: (id == log.user),
                userinfo: info
            });
        } else {
            res.render('../message', {
                code: 404,
                message: '这枚用户还未注册本站'
            });
        }
    });
});
// 注册页
router.get('/register', function (req, res) {
    res.render('register');
});
// 发布页
router.get('/diary/publish', function (req, res) {
    if (log.user) {
        res.render('publish');
    } else {
        res.redirect('/');
    }
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

router.post('/user/edit/info', function (req, res) {
    user.edit.info(req, res, log.user);
});
router.post('/user/edit/portrait', function (req, res) {
    user.edit.portrait(req, res, log.user);
});

router.post('/diary/publish', function (req, res) {
    diary.publish(req, res, log.user);
});

module.exports = router;