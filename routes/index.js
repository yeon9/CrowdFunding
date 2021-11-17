var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res) {
    var userid = ' ';
    userid  = req.session.userId;
    userType = req.session.type;

// 투자자 회원인 경우 후원금액이 목표금액의 300% 이상 달성한 프로젝트만 쿼리
    if(userType == 'investor'){
        global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and gather >= goal*3 and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,9', (error, result) => {
			global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,3', (error, pop) => {
      	    			res.render('index', { data: result, page:1, login:userid, type:userType, popular:pop});
			});
    		});
    }

// 투자자 회원이 아닌 경우 전체 프로젝트 쿼리
    else{
        global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and DATEDIFF(enddate, NOW())>=0 order by project_id limit 0,9', (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,3', (error, pop) => {
      	    		res.render('index', { data: result, page:1, login:userid, type:userType, popular:pop});
		});
    	});
    }

});

// 페이징 기능 구현
router.get('/:page', function(req,res){

    var page = req.params.page;
    var start = 9*(page-1);

    var userid = '';
    userid = req.session.userId;
    userType = req.session.type;

// 투자자 회원인 경우 후원금액이 목표금액의 300% 이상 달성한 프로젝트 중에 9개씩 SELECT 하는데 다음페이지로 넘어가면 그 다음 프로젝트부터 SELECT
    if(userType == 'investor'){
           global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and gather >= goal*3 and DATEDIFF(enddate, NOW())>=0 order by gather limit ' + start + ',9' , (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,3', (error, pop) => {
      	  	  res.render('index', { data: result, page:page, login:userid, type:userType, popular:pop});
		});
      	    });
    }
// 9개씩 SELECT 하는데 다음페이지로 넘어가면 그 다음 프로젝트부터 SELECT
    else{
        global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and DATEDIFF(enddate, NOW())>=0 order by project_id limit '+start+',9' , (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인"  and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,3', (error, pop) => {
           		res.render('index', { data: result , page:page, login:userid, type:userType, popular:pop});
		});
        });
    }

});



module.exports = router;

