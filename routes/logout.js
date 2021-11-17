const express = require('express');
const router = express.Router();

router.get('/',(request,response)=>
{
	sess = request.session;   //세션의 정보 저장 
	if(sess.userId)  //세션에 아이디가 존재하면 
	{
		request.session.destroy(function(error)  //세션의 정보를 파기 
		{
			if(error) console.log(error);
			else response.status(302).redirect('/');   //메인으로 이동한다 
		});
	}
	else response.status(302).redirect('/'); //존재 하지 않으면 메인으로 이동한다. 
	
});

module.exports=router
