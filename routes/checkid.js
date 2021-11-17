const url = require('url');
exports.checkid = (request,response)=>
{
	var uri = url.parse(request.url,true);            //url 정보를 저장 
	global.connection.query('SELECT * FROM member WHERE userid =?',[uri.query.id],(error,results) =>            //사용자 테이블에 아이디가 존재하는지 검색
	{
		if(results.length)    //존재하면 
		{
			
			console.log('중복');
			
			response.send('true');   //true를 전송 
		}
		else      //존재하지 않으면 
		{

			console.log('중복 아님');
			response.send('false');    //false를 전송 
		}
	});
}
