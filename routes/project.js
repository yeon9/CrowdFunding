var express = require('express');
var router = express.Router();

// uri 의 이름과 데이터베이스의 카테고리를 매칭하기 위한 배열
var caten = new Array('game', 'show', 'design', 'comics', 'art','publishing', 'photo','movie-video','tech','music','cook','fashion');
var catko = new Array('게임', '공연', '디자인','만화', '미술','출판', '사진', '영화비디오', '테크놀로지','음악','요리','패션');

/* GET home page. */
router.get('/', function(req, res, next) {

  var userid = '';
  userid = req.session.userId;
  userType = req.session.type;

    var now='';

// 카테고리 페이지에 접속하면 게임 카테고리를 보여줌
// 투자자의 경우 카테고리가 게임이고 후원금액이 목표금액의 300% 이상 달성한 프로젝트만 쿼리
    if(userType == 'investor'){
        global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and category="게임" and gather >= goal*3 and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,9', (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and category="게임" and gather >= goal*3 and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,3', (error, pop) => {
            		res.render('category', { data: result, page:1, login:userid, now:now, type:userType, popular:pop});
       	}); 
	});
    }

// 투자자가 아닌 경우 카테고리가 게임 프로젝트만 쿼리
    else{
        global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and category="게임" and DATEDIFF(enddate, NOW())>=0 order by project_id limit 0,9', (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and category="게임" and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,3', (error, pop) => {
            		res.render('category', { data: result, page:1, login:userid, now:now, type:userType, popular:pop});
        	});
        });
    }
});


// 종료 임박 페이지에 접속하면 보여지는 부분

router.get('/ending-soon', function(req, res, next) {

    var userid = '';
    userid = req.session.userId;
    var userType = req.session.type;

    var category = req.params.category;
    var index =0;
    for(var i=0; i<12; i++){
        if(caten[i] == category){
             index = i;
	}
    }

// 투자자의 경우 프로젝트 종료일이 7일 이하면서 후원금액이 목표금액의 300% 이상 달성한 프로젝트만 조회
    if(userType == 'investor'){
    	global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and  DATEDIFF(enddate, NOW())<=7 and DATEDIFF(enddate, NOW())>=0 and gather >= goal*3 order by project_id limit 0,9', (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and  DATEDIFF(enddate, NOW())<=7 and DATEDIFF(enddate, NOW())>=0 and gather >= goal*3 order by gather limit 0,3', (error, pop) => {
     			 res.render('ending-soon', { data: result, page:1, login:userid, type:userType, popular:pop});
	 	});
    	});
    }

// 투자자가 아닌 경우 프로젝트 종료일이 7일 이하인 프로젝트만 조회
    else{
    	global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and  DATEDIFF(enddate, NOW())<=7 and DATEDIFF(enddate, NOW())>=0 order by project_id limit 0,9', (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and  DATEDIFF(enddate, NOW())<=7 and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,3', (error, pop) => {
     			 res.render('ending-soon', { data: result, page:1, login:userid, type:userType, popular:pop});
	 	});
    	});
    }

});

// 종료 임박 프로젝트의 페이징 기능 구현
router.get('/ending-soon/:page', function(req,res,next){

    var userid = '';
    userid = req.session.userId;

    var category = req.params.category;
    var page = req.params.page;
    var end = page*10-1;
    var start = end-9;

    userType = req.session.type;

// 투자자의 경우 프로젝트 종료일이 7일 이하면서 후원금액이 목표금액의 300% 이상 달성한 프로젝트만 조회
    if(userType == 'investor'){
    	global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and  DATEDIFF(enddate, NOW())<=7 and gather >= goal*3 order by project_id limit '+start+','+end , (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and  DATEDIFF(enddate, NOW())<=7 and gather >= goal*3 order by gather limit 0,3', (error, pop) => {
      			res.render('ending-soon', { data: result , page:parseInt(page), login:userid, type:userType, popular:pop});
		});
    	});
    }

// 투자자가 아닌 경우 프로젝트 종료일이 7일 이하인 프로젝트만 조회
    else{
    	global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and DATEDIFF(enddate, NOW())<=7 and DATEDIFF(enddate, NOW())>=0 order by project_id limit '+start+','+end , (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and  DATEDIFF(enddate, NOW())<=7 and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,3', (error, pop) => {
      			res.render('ending-soon', { data: result , page:parseInt(page), login:userid, type:userType, popular:pop});
		});
    	});
    }

});


router.get('/popular', function(req, res, next) {

  var userid = '';
  userid = req.session.userId;

    var category = req.params.category;
    var index =0;
    for(var i=0; i<12; i++){
        if(caten[i] == category){
             index = i;
	}
    }
    userType = req.session.type;
// 투자자인 경우 후원금액이 목표금액의 500% 이상 달성한 프로젝트만 쿼리
    if(userType == 'investor'){
        global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and gather >= goal*5 and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,9', (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and gather >= goal*5  and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,3', (error, pop) => {
            		res.render('popular', { data: result, page:1, now:"popular", login:userid, type:userType, popular:pop});
		});
        });
    }

// 후원금액이 목표금액의 300% 이상 달성한 프로젝트만 쿼리
    else{
        global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and gather >= goal*3 and DATEDIFF(enddate, NOW())>=0 order by project_id limit 0,9', (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and gather >= goal*3  and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,3', (error, pop) => {
            		res.render('popular', { data: result, page:1,now:"popular", login:userid, type:userType, popular:pop});
       	}); 
	});
    }
});


// 인기프로젝트의 페이징 기능 구현
router.get('/popular/:page', function(req,res,next){

    var userid = '';
    userid = req.session.userId;

    var category = req.params.category;
    var page = req.params.page;
    var end = page*10-1;
    var start = end-9;

    userType = req.session.type;

// 투자자인 경우 후원금액이 목표금액의 500% 이상 달성한 프로젝트만 쿼리
    if(userType == 'investor'){
        global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and gather >= goal*5 order by gather limit '+start+','+end, (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and gather >= goal*5 order by gather limit 0,3',  (error, pop) => {
            		res.render('popular', { data: result, page:parseInt(page), login:userid, type:userType, popular:pop});
		});
        });
    }
// 후원금액이 목표금액의 300% 이상 달성한 프로젝트만 쿼리
    else{
        global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and gather >= goal*3 and DATEDIFF(enddate, NOW())>=0 order by project_id limit '+start+','+end, (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and gather >= goal*3 and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,3', (error, pop) => {
           		 res.render('popular', { data: result, page:parseInt(page), login:userid, type:userType, popular:pop});
		});
        });
    }
});


// 카테고리별로 프로젝트를 보여주는 페이지
router.get('/:category', function(req, res, next) {

      var userid = '';
      userid = req.session.userId;
      var userType = req.session.type;

    var category = req.params.category;
    var index =0;
// url과 데이터베이스의 카테고리가 일치하는 경우 찾기
    for(var i=0; i<12; i++){
        if(caten[i] == category){
             index = i;
	}
    }

// 투자자의 경우 해당 카테고리의 후원금액이 목표금액의 300% 이상 달성한 프로젝트만 쿼리
    if(userType == 'investor'){
	global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and category="'+catko[index]+'" and gather >= goal*3 order by gather limit 0,9', (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and category="'+catko[index]+'" order by gather limit 0,3', (error, pop) => {
      			res.render('category', { data: result, page:1, now:req.url, login:userid, type:userType, popular:pop});
	 	});
   	 });
   }
// 투자자가 아닌 경우 해당 카테고리의 프로젝트 쿼리	
  else{
    global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and category="'+catko[index]+'" and DATEDIFF(enddate, NOW())>=0 order by project_id limit 0,9', (error, result) => {
	global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and category="'+catko[index]+'" and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,3', (error, pop) => {
      		res.render('category', { data: result, page:1, now:req.url, login:userid, type:userType, popular:pop});
	 });
    });
  }
});

// 카테고리의 페이징 기능 구현
router.get('/:category/:page', function(req,res,next){

      var userid = '';
      userid = req.session.userId;
      var userType = req.session.type;

     var category = req.params.category;
     var index =0;

// url과 데이터베이스의 카테고리가 일치하는 경우 찾기
    for(var i=0; i<12; i++){
        if(caten[i] == category){
             index = i;
	}
    }

    var page = req.params.page;
    var end = page*10-1;
    var start = end-9;

// 투자자의 경우 해당 카테고리의 후원금액이 목표금액의 300% 이상 달성한 프로젝트만 쿼리
    if(userType == 'investor'){
	global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and category="'+catko[index]+'" and gather >= goal*3 order by gather  limit '+start+','+end,  (error, result) => {
		global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and category="'+catko[index]+'" order by gather limit 0,3', (error, pop) => {
      			res.render('category', { data: result, page:1, now:'/'+category, login:userid, type:userType, popular:pop});
	 	});
   	 });
  }
// 투자자가 아닌 경우 해당 카테고리의 프로젝트 쿼리	
  else{
    global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and category="'+catko[index]+'" and DATEDIFF(enddate, NOW())>=0 order by project_id limit '+start+','+end , (error, result) => {
	global.connection.query('SELECT * , DATEDIFF(enddate, NOW()) as date from project where status="승인" and category="'+catko[index]+'" and DATEDIFF(enddate, NOW())>=0 order by gather limit 0,3', (error, pop) => {
     	 	res.render('category', { data: result , page:parseInt(page), now:"/"+category, login:userid, type:userType, popular:pop});
	});
    });
  }

});


module.exports = router;

