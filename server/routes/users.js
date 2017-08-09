const express = require('express');
const router = express.Router();
const User = require('./../models/user');

router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/login', (req, res, next) => {
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie('userId', doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie('userName', doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });

        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      }
    }
  }) 
});

router.post('/logout', (req, res, next) => {
  res.cookie('userId', '', {
    path: '/',
    maxAge: -1
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
});

router.get('/checkLogin', (req, res, next) => {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName || ''
    })
  } else {
    res.json({
      status: '1',
      msg: 'not logged in',
      result: ''
    })
  }
})

router.get('/cartList', (req, res, next) => {
  const userId = req.cookies.userId;
  User.findOne({userId}, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: doc.cartList
        })
      }
    }
  });
})

router.post('/cartDel', (req, res, next) => {
  const userId = req.cookies.userId;
  const productId = req.body.productId;
  User.update({userId}, {
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
      status: '1',
      msg: err.message,
      result: ''
    })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: 'suc'
        })
      }
    }
  })
})

router.post('/cartEdit', (req, res, next) => {
  const userId = req.cookies.userId;
  const productId = req.body.productId;
  const productNum = req.body.productNum;
  const checked = req.body.checked;
  User.update({userId, "cartList.productId": productId}, {
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked,
  }, (err, doc) => {
    if (err) {
      res.json({
      status: '1',
      msg: err.message,
      result: ''
    })
    } else {
      if (doc) {
        res.json({
          status: '0',
          msg: '',
          result: 'suc'
        })
      }
    }
  })
})


router.post('/editCheckAll', (req, res, next) => {
  const userId = req.cookies.userId;
  const checkAll = req.body.checkAll;
 
  User.findOne({userId}, (err, user) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      if (user) {
        user.cartList.forEach(item => {
          item.checked = checkAll;
        });
        user.save((err1, doc) => {
          if (err1) {
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            }) 
          } else {
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            })
          }
        })
      }
    }
  })
})


module.exports = router;
