var express = require('express');
var router = express.Router();

var fee;
var id;
var creator, name, bank, account;


router.get('/writing', function(req, res) {
	var userid = req.session.userId;

    if(!userid){
        res.redirect('/login');
    	}
	res.render('mediation_writing', {login:userid});
});


router.post('/writing', function(req, res) {
    var userid = req.session.userId;

    var title=req.body.title;
    var content = req.body.content;

// 투자 의향 요청 메세지까지 작성한 경우에만 데이터베이스에 삽입
    global.connection.query('INSERT INTO mediation (project_id, creator, investor, fee, name, bank, account, date_ask, status, title, content) VALUES(' + id + ', "' + creator + '", "' + userid + '", ' + fee + ', "' + name + '", "' + bank + '", "' + account + '", NOW(), "미입금",  " ' + title + '", "' + content + '")', function(error){
		if(error) console.log(error);
		res.send('<script>alert("투자 의향 요청을 완료하였습니다."); location.href="/project/detail/'+id+'"; </script>');
    });  

});


router.get('/:project_id', function(req, res) {
    var userid = req.session.userId;
    id = req.params.project_id;
    
    if(!userid){
        res.redirect('/login');
    	}

	global.connection.query('SELECT * FROM project where project_id='+id, function(error, result){
		if(error) console.log(error);

// project_id가 id인 프로젝트 정보 SELECT 하여 후원금액과 창작자 아이디 정보 저장
		fee = result[0].gather*0.01;
		creator = result[0].userid;		
	});

    res.render('mediation', {login:userid, id:id});
});


router.post('/:project_id', function(req, res) {
// 투자자의 투자정보(입금자명, 은행, 계좌번호) 저장
    name=req.body.name;
    bank = req.body.bank;
    account = req.body.account;

    res.redirect('/mediation/writing');
});


module.exports = router;
