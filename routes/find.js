const express=require('express');
const router=express.Router();
const fs=require('fs');
const email=require('emailjs');
const crypto=require('crypto');
const ejs=require('ejs');
var code;
var body1;
var emailServer=email.server.connect({
     user: "kscvv232@naver.com",
     password: "valuable1004",
     host: "smtp.naver.com",
     port: "465",
     ssl: true
});
const myHash=function myHash(key){
    var hash=crypto.createHash('sha1');
    hash.update(key);
    return hash.digest('hex');
};
router.get('/', function(req, res){
       res.render('find');
  });
router.get('/id', function(req, res){
       res.render('findid');
  });
router.get('/password', function(req, res){
       res.render('findpw');
});
router.get('/password/code', function(req, res){
       res.render('pwcode');
});
router.get('/password/reset', function(req, res){
       res.render('pwedit');
});
router.post('/id', function(req, res){
       var body=req.body;
       fs.readFile('./views/idresult.ejs', 'utf8', (error, data)=>{
       global.connection.query('select * from member where name=? and email=?',[body.name, body.email], function(error, results){
       if(results.length){
          res.send(ejs.render(data, {
               userid: results[0].userid
            }));
       }else{
                 res.send('<script>alert("등록되어 있지 않은 계정입니다!"); location.href="/find/id"; </script>');
       }
      });
    });
});
router.post('/password', function(req, res){
       body1=req.body;
  global.connection.query('select * from member where userid=? and email=?',[body1.userid, body1.email], function(error, results){
       if(results.length){
      code=Math.floor((Math.random()*9000)+1000);
      var message={
         text: code,
         from: "크라우드펀딩<kscvv232@naver.com>",
         to: body1.email,
         subject: "비밀번호 찾기 인증번호입니다."
      };
      emailServer.send(message, function(err, message){
         console.log(err || message);
         res.redirect('/find/password/code');
      });
        }else{
           res.send('<script>alert("등록되어 있지 않은 계정입니다!"); location.href="/find/password"; </script>');
        }
    });
});
router.post('/password/code', function(req, res){
        var body=req.body;
        if(body.code==code){
        res.redirect('/find/password/reset');
         }
        else if(body.code!=code){
       res.send('<script>alert("인증번호가 일치하지 않습니다!"); location.href="/find/password/code"; </script>');
      
        }
});
router.post('/password/reset', function(req, res){
        var body=req.body;
        if(body.password==body.password2){
        newpass=myHash(body.password);
        global.connection.query('UPDATE member SET password=? where userid=?', [newpass, body1.userid], function(){
        res.render('pweditsuccess');
     });
  }else if(body.password!=body.password2){
     res.send('<script>alert("비밀번호가 일치하지 않습니다!"); location.href="/find/password/reset"; </script>');
     }
});
module.exports=router

