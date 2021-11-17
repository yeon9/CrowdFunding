const express = require('express');
const checkId = require('./checkid.js');    //아이디 중복 메소드를 포함한 js 파일 
const crypto = require('crypto');
const bodyParser = require('body-parser');
const router = express.Router();
const myHash = function myHash(key)    // 비밀번호를 암호화 하는 해시함수 
{
	var hash = crypto.createHash('sha1');
	hash.update(key);
	return hash.digest('hex');
}

router.use(bodyParser.urlencoded({extended:false}));

router.get('/',(request,response)=>        //회원가입 페이지 
{
	response.render('register');

});

router.get('/checkuserid',(request,response)=>    // 아이디 중복 확인 
{
checkId.checkid(request,response);
});

router.post('/',(request,response)=>
{
	var body = request.body;  // 회원가입 내용 저장 
	
	global.connection.query('SELECT * FROM member WHERE userid =?',[body.uid],(error,results)=>
	{
		if(!results.length)//아이디 중복이 없고   
		{
					
			if(body.pass1 == body.pass2&& body.uid.length)//패스워드 1,2 끼리 같고 아이디 값이 null이 아닐 때 
			{
				global.connection.query('INSERT INTO member(userid,type,name,password,birth,email,phone,address,black,note) VALUES(?,?,?,?,?,?,?,?,?,?)',[body.uid,body.type,body.name,myHash(body.pass1),body.dob,body.email,body.phone,body.add,0,''],()=>
				{
					console.log('Insertion into database was compeleted!');
					response.status(302).redirect('/login');
				});
			}
			else response.render('regfail'); // 회원가입 실패 페이지로 이동 
		}
		else response.status(302).redirect('/reg');  //아이디 중복이 있다면 다시 회원 가입 페이지로 이동 
	
	});
});
module.exports = router			
