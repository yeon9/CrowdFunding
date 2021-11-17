const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const router = express.Router();

const myHash = function myHash(key)                               //비밀번호를 암호화하는 해시함수 
{
	var hash = crypto.createHash('sha1');
	hash.update(key);
	return hash.digest('hex');
}
router.use(bodyParser.urlencoded({extended:false}));
router.get('/',(request,response)=>                             //로그인 페이지
{
	
	response.render('login');                              
	sess = request.session;              //세션 정보를 저장 
	
	
});
router.post('/',(request,response)=>
{
	var body = request.body;           // 로그인 정보 저장 
	var check = false;
        
        global.connection.query('SELECT * FROM member where userid =? and password = ?',[body.uid, myHash(body.pass)],(error,results)=>   //일치하는 회원 정보 검색 
	{
		if(results.length)    //일치하는 회원 정보가 있으면 
		{
			request.session.userId = results[0].userid;        //세션에 아이디 정보 입력
			request.session.type = results[0].type;               //세션에 사용자 종류 입력 
			if(request.session.type =='admin'){                     //만약 사용자 종류가 관리자라면 
				response.redirect('/admin');                   //관리자 페이지로 이동 
			}
			else
			   response.status(302).redirect('/');                  //메인 화면으로 이동 
			
		}
		else response.render('loginfail');  //일치하는 회원 정보가 없으면 로그인 실패 화면으로 이동 
			

		
	}); 
	

});

module.exports = router			
