const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const url = require('url');

router.use(bodyParser.urlencoded({extended:false}));

router.get('/',(request,response)=> //찜하기 기능
{
	
	var uri = url.parse(request.url,true); //url주소를 담는 변수
	var userid = request.session.userId; // 세션의 아이디가 저장된다.
	global.connection.query('SELECT * FROM cart WHERE userid =? and project_id=?',[userid,uri.query.projectid],(error,results)=> //찜(cart) 테이블에 이미 있는지 검색
	{
		if(results.length) //디비 쿼리의 결과가 있으면 
		{
			console.log('이미 찜목록에 있음');
			console.log(results);
			
			response.send('true'); // true를 전송 (이미 찜목록에 있음)
		}
		else // 없으면
		{
			global.connection.query('INSERT INTO cart(userid, project_id) VALUES(?,?)',[userid,uri.query.projectid],()=>  // 찜(cart) 테이블에 프로젝트, 사용자 아이디 저장
			{
				console.log('찜목록에 추가');
			
				response.send('false'); //false를 전송 (찜목록에 추가 완료)
		
			});
		}
	});	
	
});
module.exports = router

