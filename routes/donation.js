var express = require('express');
var router = express.Router();

var price=0;

router.get('/:project_id', function(req, res) {
// 후원정보 입력 페이지
    var userid = '';
    userid  = req.session.userId;
    price = req.query.price;    
    var id = req.params.project_id;
    
    if(!userid){
        res.redirect('/login');
    }
    res.render('donation', {login:userid, id:id});
});

router.post('/:project_id', function(req, res) {
// project_id가 project_id인 프로젝트 에 대한 후원 정보 
    var userid = '';
    userid  = req.session.userId;
    var name=req.body.name;
    var bank = req.body.bank;
    var account = req.body.account;
    var id = req.params.project_id;

// 펀딩 정보 데이터베이스에 삽입
    global.connection.query('INSERT INTO donation (project_id, userid, name, money, bank, account, status) VALUES(' + id + ', "' + userid + '", "' + name + '", ' + price + ', "' + bank + '", "' + account + '", "미입금")', function(error){
		if(error) console.log(error);
		res.send('<script>alert("펀딩을 완료하였습니다."); location.href="/project/detail/'+id+'"; </script>');
    });  

});
module.exports = router;


