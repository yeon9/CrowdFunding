var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    var userid = '';
    userid  = req.session.userId;

    if(!userid){
        res.redirect('/login');
    }
    if(req.session.type != 'admin'){
        res.redirect('/');
    }


 // res.render('admin_main', {login:userid});
    res.redirect('/admin/project');

});

router.get('/project', function(req, res) {
    var userid = '';
    userid  = req.session.userId;

    if(!userid){
	res.redirect('/login');
    }
    if(req.session.type != 'admin'){
	res.redirect('/');
    }

    search = req.query.search;
    var uri = 'all';

    if(!search){
	global.connection.query('SELECT * , DATE_FORMAT(enddate, "%Y-%m-%d") as date from project where status="승인"', (error, result) => {
      	    res.render('admin_project', {data:result,login:userid, uri:uri });
        });
    }
    else{
	global.connection.query('SELECT * , DATE_FORMAT(enddate, "%Y-%m-%d") as date from project where userid LIKE "%' + search + '%" or title LIKE "%' +search+'%" and status="승인"', (error, result) => {
      	    res.render('admin_project', {data:result,login:userid, uri:uri});
        });
    }

});

router.get('/project/ing', function(req, res) {
    var userid = '';
    userid  = req.session.userId;

    if(!userid){
        res.redirect('/login');
    }
    if(req.session.type != 'admin'){
        res.redirect('/');
    }

    search = req.query.search;
    var uri = 'ing';

    if(!search){
        global.connection.query('SELECT * , DATE_FORMAT(enddate, "%Y-%m-%d") as date from project where DATE_FORMAT(enddate, "%Y-%m-%d")>=0 and status="승인"', (error, result) => {
            res.render('admin_project', {data:result,login:userid, uri:uri });
        });
    }
    else{
        global.connection.query('SELECT * , DATE_FORMAT(enddate, "%Y-%m-%d") as date from project where userid LIKE "%' + search + '%" or title LIKE "%' +search+'%" and DATE_FORMAT(enddate, "%Y-%m-%d")>=0  and status="승인"', (error, result) => {
            res.render('admin_project', {data:result,login:userid, uri:uri});
        });
    }

});


router.get('/project/end', function(req, res) {
    var userid = '';
    userid  = req.session.userId;

    if(!userid){
        res.redirect('/login');
    }
    if(req.session.type != 'admin'){
        res.redirect('/');
    }

    search = req.query.search;
    var uri = 'end';

    if(!search){
        global.connection.query('SELECT * , DATE_FORMAT(enddate, "%Y-%m-%d") as date from project where DATEDIFF(enddate, NOW())<0 and status="승인"', (error, result) => {
            res.render('admin_project', {data:result,login:userid, uri:uri });
        });
    }
    else{
        global.connection.query('SELECT * , DATE_FORMAT(enddate, "%Y-%m-%d") as date from project where userid LIKE "%' + search + '%" or title LIKE "%' +search+'%" and DATEDIFF(enddate, NOW())<0 and status="승인"', (error, result) => {
            res.render('admin_project', {data:result,login:userid, uri:uri});
        });
    }

});


router.get('/apply', function(req, res) {
    var userid = '';
    userid  = req.session.userId;
    search = req.query.search;
    var uri = 'apply';

    if(!userid){
        res.redirect('/login');
    }
    if(req.session.type != 'admin'){
        res.redirect('/');
    }



    if(!search){
	global.connection.query('SELECT * , DATE_FORMAT(enddate, "%Y-%m-%d") as date from project order by project_id', (error, result) => {
      	    res.render('admin_apply', {data:result,login:userid, uri:uri   });
        });
    }
    else{
	global.connection.query('SELECT * , DATE_FORMAT(enddate, "%Y-%m-%d") as date from project where userid LIKE "%' + search + '%" or title LIKE "%' +search+'%" order by project_id', (error, result) => {
      	    res.render('admin_apply', {data:result,login:userid, uri:uri  });
        });
    }

});

router.put('/apply/yet', function(req, res){
    var what = req.query.what;
    global.connection.query('UPDATE project SET status="승인" where project_id='+what, (error, result) => {
            res.redirect('/admin/apply/yet');
        });
});
router.get('/apply/yet', function(req, res) {
    var userid = '';
    userid  = req.session.userId;
    var update = req.query.update;
    var what = req.query.what;
    var uri = 'yet';

    if(!userid){
        res.redirect('/login');
    }
    if(req.session.type != 'admin'){
        res.redirect('/');
    }

console.log('update : '+ update + 'what : '+what);

    if(!update){
        global.connection.query('SELECT * , DATE_FORMAT(enddate, "%Y-%m-%d") as date from project where status="미승인" order by project_id', (error, result) => {
          res.render('admin_apply_yet', {data:result,login:userid, uri:uri });
        });
    }
    else if(update == 'admit'){
        global.connection.query('UPDATE project SET status="승인" where project_id='+what, (error, result) => {
	    res.redirect('/admin/apply/yet');
        });
    }

    else if(update == 'deny'){
        global.connection.query('UPDATE project SET status="거부" where project_id='+what, (error, result) => {
	    res.redirect('/admin/apply/yet');
        });
    }
});


router.get('/apply/admit', function(req, res) {
    var userid = '';
    userid  = req.session.userId;
    var uri = 'admit';

    if(!userid){
        res.redirect('/login');
    }
    if(req.session.type != 'admin'){
        res.redirect('/');
    }


    global.connection.query('SELECT * , DATE_FORMAT(enddate, "%Y-%m-%d") as date from project where status="승인" order by project_id', (error, result) => {
      res.render('admin_apply', {data:result,login:userid, uri:uri });
    });

});

router.get('/apply/deny', function(req, res) {
    var userid = '';
    userid  = req.session.userId;
    var uri = 'deny';

    if(!userid){
        res.redirect('/login');
    }
    if(req.session.type != 'admin'){
        res.redirect('/');
    }

    global.connection.query('SELECT * , DATE_FORMAT(enddate, "%Y-%m-%d") as date from project where status="거부" order by project_id', (error, result) => {
      res.render('admin_apply', {data:result,login:userid, uri:uri  });
    });

});


var year='-----------', month='---';


router.get('/fee', function(req, res){
    var userid = req.session.userId;


if(year=='-----------'){
	if(month=='---'){
       global.connection.query('select m.*, p.userid as creator, DATE_FORMAT(m.date_fee, "%Y-%m-%d") as date_fee, p.title as project_title  from mediation m, project p where p.project_id = m.project_id and m.status="입금" ', (error, result)=>{
	       if(error) console.log(error);
           res.render('admin_fee', {data:result, login:userid, total:0, year:0, month:0}); 
                });
	}
	else{
		month = parseInt(month);
		global.connection.query('select m.*, p.userid as creator, DATE_FORMAT(m.date_fee, "%Y-%m-%d") as date_fee, p.title as project_title from mediation m, project p where p.project_id = m.project_id and m.status="입금" and MONTH(m.date_fee)="' + month + '"', (error, result)=>{
	       if(error) console.log(error);
           res.render('admin_fee', {data:result, login:userid, total:0, year:0, month:month}); 
                });
	}

}

else{
	year = parseInt(year);
	if(month=='---'){
       global.connection.query('select m.*, p.userid as creator, DATE_FORMAT(m.date_fee, "%Y-%m-%d") as date_fee, p.title as project_title from mediation m, project p where p.project_id = m.project_id and m.status="입금" and YEAR(m.date_fee)="' + year + '"', (error, result)=>{
	       if(error) console.log(error);
           res.render('admin_fee', {data:result, login:userid, total:0, year:year, month:0}); 
                });
	}
	else{
		month = parseInt(month);
		global.connection.query('select m.*, p.userid as creator, DATE_FORMAT(m.date_fee, "%Y-%m-%d") as date_fee, p.title as project_title from mediation m, project p where p.project_id = m.project_id and m.status="입금" and YEAR(m.date_fee)="' + year +'" and MONTH(m.date_fee)="' + month + '"', (error, result)=>{
	       if(error) console.log(error);
           res.render('admin_fee', {data:result, login:userid, total:0, year:year, month:month}); 
                });
	}

}

});

router.post('/fee', function(req, res) {
	year = req.body.year;
	month = req.body.month;
	console.log(year);
	console.log(month);
	res.redirect('/admin/fee');
});

/*----------------------------------------사용자 관리 --------------------------------------------*/


router.get('/member', function(request, response) {  //사용자 관리

  var userid = '';
    userid  = request.session.userId;                       //세션의 아이디 정보
    var update = request.query.update;                   //url 쿼리의 update 정보
    var what = request.query.what;                        //url 쿼리의 what 정보


    if(!userid){                                            // 세션에 사용자 아이디가 없으면 
	response.redirect('/login');             // 로그인 페이지로 이동
    }
    if(request.session.type != 'admin'){          //세션의 종류가 관리자가 아니면
	response.redirect('/');                  //사용자 메인 페이지로 이동
    }

    search = request.query.search;              //url 쿼리의 search 저장 

    if(!search&&!update){		       //검색 내용도 없고, 정렬도 없다면 
	global.connection.query('SELECT *, DATE_FORMAT(birth, "%Y-%m-%d") as date from member ', (error, result) => {  //전체 사용자 정보 출력
      	    response.render('admin_member', {data:result,login:userid });
        });
    }
       else if(!search&&update=='donator'){   //검색 내용이 없고, 정렬이 후원자라면 
	global.connection.query('SELECT *, DATE_FORMAT(birth, "%Y-%m-%d") as date from member where type="donator"', (error, result) => {   //후원자 사용자 정보 출력
      	    response.render('admin_member', {data:result,login:userid });

	        });
    }
    else if(!search&&update=='creator'){       //검색 내용이 없고, 정렬이 창작자라면 
	global.connection.query('SELECT *, DATE_FORMAT(birth, "%Y-%m-%d") as date from member where type="creator"', (error, result) => {     //창작자 사용자 정보 출력
      	    response.render('admin_member', {data:result,login:userid });


	        });
    }
else if(!search&&update=='investor'){         //검색 내용이 없고, 정렬이 투자자라면
	global.connection.query('SELECT *, DATE_FORMAT(birth, "%Y-%m-%d") as date from member where type="investor"', (error, result) => {      //투자자 사용자 정보 출력
      	    response.render('admin_member', {data:result,login:userid });


	        });
    } 
     else{                                                //검색 내용이 있다면
	global.connection.query('SELECT *, DATE_FORMAT(birth, "%Y-%m-%d") as date from member where userid LIKE "%' + search+'%" ', (error, result) => {  //검색 내용의 아이디를 가진 사용자 정보 출력 
      	    response.render('admin_member', {data:result,login:userid});
        });
    }

  
});

router.get('/member/black', function(request, response) {        //블랙리스트
    var userid = '';
    userid  = request.session.userId;                    //세션의 사용자 아이디
    var update = request.query.update;                 //url 쿼리의 update 정보
    var what = request.query.what;                      //url 쿼리의 what 정보


    if(!userid){                                                   //세션에 사용자 아이디가 없으면                                                                                                                                                                                         
	response.redirect('/login');                   // 로그인 페이지로 이동
    }
    if(request.session.type != 'admin'){                 //세션의 종류가 관리자가 아니면
	response.redirect('/');                         //사용자 메인 페이지로 이동
    }

    search = request.query.search;                      //search 쿼리 정보 저장

    if(!search&&!update){                                   //검색 내용도 없고, 사용자 삭제 요청도 아니라면 
	global.connection.query('SELECT * from member  where black>=1 order by black desc', (error, result) => {       //경고가 있는 사용자들 목록 출력
      	    response.render('admin_member_black', {data:result,login:userid });   
        });
    }
       else if(!search&&update=='delete'){             //검색 내용이 없고, 사용자 삭제 요청이라면 
	global.connection.query('delete from member where userid=?',[what], (error, result) => {                               //what 에 있는 사용자 아이디의 계정을 삭제 
      	    response.status(304).redirect('/admin/member/black');
        });
    }
   
     else{                                                        //경고 추가를 위해서 검색 내용이 있으면 
	global.connection.query('SELECT * from member where userid LIKE "%' + search+'%"  order by black desc', (error, result) => {       //검색 내용의 아이디를 가진 사용자 출력 
      	    response.render('admin_member_black', {data:result,login:userid});
        });
    }



});

router.post('/member/black',(request,response)=>                // 경고 추가를 위한 post 요청 
{
	var note_new = request.body.note;                       //새로운 경고 내용
	var userid= request.query.userid;                          //세션의 아이디
	var black_new = request.query.black;                    //추가된 경고 횟수
	global.connection.query('UPDATE member SET note=?,black=? where userid=?',[note_new,black_new,userid],(error,result)=>     //사용자 테이블에 수정 
	{
		if(error)
			console.log(error);
		else
			response.status(302).redirect('/admin/member/black');    
	}); 	
});

router.get('/member/qna', function(request, response) {            //QnA 
    var userid = '';
    userid  = request.session.userId;                                      //세션의 사용자 아이디 

    if(!userid){			                                 //세션의 사용자 아이디가 없으면 
	response.redirect('/login');                                     //로그인 페이지로 이동 
    }
    if(request.session.type != 'admin'){                                   //세션의 사용자 종류가 관리자가 아니면
	response.redirect('/');                                            //사용자 메인으로 이동
    }

    search = request.query.search;                                        //url 의 search 쿼리 정보 저장 

    if(!search){                                            //검색 내용이 없다면 
	global.connection.query('SELECT * from project p, QnA q where p.project_id = q.project_id', (error, result) => {    //전체 QnA 테이블 내용 출력 
      	    response.render('admin_member_qna', {data:result,login:userid });
        });
    }
    else{                                                   //검색 내용이 있다면 
	global.connection.query('SELECT * from project p, QnA q where(p.project_id = q.project_id) and (q.userid LIKE "%' + search + '%" or p.title LIKE "%' +search+'%")', (error, result) => {    //검색 된 사용자 아이디의 QnA 내용 또는 검색된 프로젝트의 QnA 내용  출력
	
		response.render('admin_member_qna', {data:result,login:userid });				
        });
    }

});


router.get('/member/review', function(request, response) {            //후기
    var userid = '';
    userid  = request.session.userId;                                             //세션의 사용자 아이디

    if(!userid){                                                                            //사용자 아이디가 없다면 
	response.redirect('/login');                                            //로그인 페이지로 이동
    }
    if(request.session.type != 'admin'){                                        //세션의 사용자 종류가 관리자가 아니라면
	response.redirect('/');                                                 //사용자 메인으로 이동
    }

    search = request.query.search;                                              //url 의 search 쿼리 정보 저장

    if(!search){                                                                          //검색 내용이 없다면 
	global.connection.query('SELECT *, p.title as project_title from project p, review r where p.project_id = r.project_id', (error, result) => {      //전체 후기 테이블 내용 출력
      	    response.render('admin_member_review', {data:result,login:userid });
        });
    }
    else{                                                                                 //검색 내용이 있다면 
	global.connection.query('SELECT *, p.title as project_title from project p, review r where(p.project_id = r.project_id) and (r.userid LIKE "%' + search + '%" or p.title LIKE "%' +search+'%")', (error, result) => {   //검색 된 사용자 아이디의 후기 내용  또는 검색된 프로젝트의 후기 내용 출력  
	
		if(error)
			console.log(error);
		else
			response.render('admin_member_review', {data:result,login:userid });				
        });
    }

});

/*---------------------------------------펀딩----------------------------------------*/

router.get('/donation', function(request, response) {                      //펀딩 목록 
    var userid = '';
    userid  = request.session.userId;                                              //세션의 아이디 저장 
    search = request.query.search;                                                //url 의 search 쿼리 내용 저장
    var uri = 'donation';                                                                //어떤 페이지 인지 저장하는 변수 

    if(!userid){                                           // 세션에 아이디 정보가 없으면
        response.redirect('/login');                 //로그인 페이지로 이동
    }
    if(request.session.type != 'admin'){        //세션의 사용자 종류가 관리자가 아니면 
        response.redirect('/');                      //사용자 메인으로 이동
    }


    if(!search){                                         //검색 내용이 없다면 
	global.connection.query('SELECT *, d.userid as userid_donation,d.status as status_donation from project p, donation d where p.project_id = d.project_id', (error, result) => {    //전체 후원(펀딩) 테이블의 내용 출력
      	    response.render('admin_donation', {data:result,login:userid, uri:uri});
        });
    }
    else{                                               //검색 내용이 있다면 검색 된 내용의 아이디의 펀딩 내역이나 검색된 프로젝트의 펀딩 내역을 출력
	global.connection.query('SELECT *, d.userid as userid_donation ,d.status as status_donation from project p, donation d where(p.project_id = d.project_id) and (d.userid LIKE "%' + search + '%" or p.title LIKE "%' +search+'%")', (error, result) => {
      	    response.render('admin_donation', {data:result,login:userid,uri:uri });
        });
    }

});

router.get('/donation/none', function(request, response) { //펀딩 내역(미입금)
    var userid = '';   
    userid  = request.session.userId;                                                    //세션의 아이디 저장
    var update = request.query.update;                                                 //url  쿼리의 update 정보 저장
    var what = request.query.what;                                                      //url  쿼리의 what 정보 저장
    var gather_new = request.query.money;                                          //url 쿼리의 입금된 정보 저장 
    var projectid = request.query.project;                                             //url 쿼리의 프로젝트 아이디 정보 저장 
    var uri = 'none';                                                                         //어떤 페이지인지 저장하는 변수 

    if(!userid){                                              //세션에 아이디 정보가 없으면
        response.redirect('/login');                     //로그인 화면으로 이동
    } 
    if(request.session.type != 'admin'){             //세션의 사용자 종류가 관리자가 아니면
        response.redirect('/');                            //사용자 메인 화면으로 이동
    }

console.log('update : '+ update + 'what : '+what);

    if(!update){                                              //입금 전환 요청이 아니라면 미입금인 펀딩 내역 출력
        global.connection.query('SELECT *, d.userid as userid_donation,d.status as status_donation from project p, donation d where p.project_id = d.project_id and (d.status="미입금")', (error, result) => {
          response.render('admin_donation_none', {data:result,login:userid, uri:uri });
        });
    }
    else if(update == 'done'){                         //입금 전환 요청이면 
        global.connection.query('UPDATE donation SET status="입금" where donation_id='+what, (error, result) => {           //쿼리의 사용자 아이디의 입금 상태를 입금으로 수정
	 global.connection.query('UPDATE project SET gather=? where project_id=?',[gather_new,projectid],(error,result)=>{
		response.redirect('/admin/donation/none');
	});   
        });
    }

});


router.get('/donation/done', function(request, response) {  //펀딩 내역(입금)
    var userid = '';
    userid  = request.session.userId;            //세션에 사용자 아이디 저장 
    var uri = 'done';                                   //어떤 페이지 인지 알려주는 변수 

    if(!userid){                                          //세션에 사용자 아이디가 없으면
        response.redirect('/login');                //로그인 페이지로 이동
    }
    if(request.session.type != 'admin'){        //세션의 사용자 종류가 관리자가 아니면
        response.redirect('/');                      //사용자 메인으로 이동
    }

    global.connection.query('SELECT *, d.userid as userid_donation ,d.status as status_donation from project p, donation d where p.project_id = d.project_id and (d.status="입금")', (error, result) => { //입금 상태가 입금인 펀딩 내역 출력
      response.render('admin_donation', {data:result,login:userid, uri:uri });
    });

});

/*---------------------------------투자 의향 요청 -----------------------------------------------*/


router.get('/mediation', function(request, response) {  //투자 의향 요청 내역
    var userid = '';
    var update = request.query.update;                       //url 쿼리 update 정보 저장
    userid  = request.session.userId;                          //세션의 아이디 정보 저장
    search = request.query.search;                            //url 쿼리의 search 정보 저장
    var uri = 'mediation';                                           //어떤 페이지 인지 알려주는 변수

    if(!userid){                                                        //세션에 사용자 아이디가 없으면
        response.redirect('/login');                             //로그인 페이지로 이동
    }
    if(request.session.type != 'admin'){                      //세션의 사용자 종류가 관리자가 아니라면
        response.redirect('/');                                    //사용자 메인으로 이동
    }


    if(!search&&!update){                     //검색 내용도 없고 , 정렬 내용도 없다면 전체 투자 의향 요청 내역 출력
	global.connection.query('SELECT *,p.title as title_project, m.title as title_mediation, m.status as status_mediation, DATE_FORMAT(m.date_ask, "%Y-%m-%d") as date from project p, mediation m where p.project_id = m.project_id', (error, result) => {
      	    response.render('admin_mediation', {data:result,login:userid, uri:uri});
        });
    }
     else if(!search&&update=='new'){                 //검색 내용이 없고, 정렬 내용이 최신순이라면 최신순으로 전체 투자 의향 요청 내역 출력
	global.connection.query('SELECT *,p.title as title_project, m.title as title_mediation, m.status as status_mediation, DATE_FORMAT(m.date_ask, "%Y-%m-%d") as date from project p, mediation m where p.project_id = m.project_id order by m.date_ask desc', (error, result) => {
      	    response.render('admin_mediation', {data:result,login:userid, uri:uri});
        });

    }
else if(!search&&update=='old'){                     //검색 내용이 없고, 정렬 내용이 오래된 순이라면 오래된 순으로 전체 투자 의향 요청 내역 출력
	global.connection.query('SELECT *,p.title as title_project, m.title as title_mediation, m.status as status_mediation, DATE_FORMAT(m.date_ask, "%Y-%m-%d") as date from project p, mediation m where p.project_id = m.project_id order by m.date_ask', (error, result) => {
      	    response.render('admin_mediation', {data:result,login:userid, uri:uri});
        });
    }

    else{                                                     //검색 내용이 있다면 검색 내용의 투자자 아이디의 투자 의향 요청 내역이나, 검색 내용의 프로젝트의 투자 의향 요청 내역을 출력
	global.connection.query('SELECT *,p.title as title_project , m.title as title_mediation, m.status as status_mediation, DATE_FORMAT(m.date_ask, "%Y-%m-%d") as date from project p, mediation m where(p.project_id = m.project_id) and (m.investor LIKE "%' + search + '%" or p.title LIKE "%' +search+'%")', (error, result) => {
      	    response.render('admin_mediation', {data:result,login:userid,uri:uri });
        });
    }

});

router.get('/mediation/none', function(request, response) {    //투자 의향 요청 내역(미입금)
    var userid = '';
    userid  = request.session.userId;                          //세션의 아이디 정보
    var update = request.query.update;                       //url 쿼리의 update 정보
    var what = request.query.what;                            //url 쿼리의 what 정보
    var uri = 'none';                                                 //어떤 페이지 인지 알려주는 변수

    if(!userid){                                                        //세션에 아이디 정보가 없으면
        response.redirect('/login');                              //로그인 페이지로 이동
    }
    if(request.session.type != 'admin'){                     //세션의 사용자 종류가 관리자가 아니라면 
        response.redirect('/');                                   //사용자 메인 페이지로 이동
    }


    if(!update){                                              //입금 상태 전환 요청이 아닌 경우 미입금인 투자 의향 요청 내역을 출력 
        global.connection.query('SELECT *,p.title as title_project, m.title as title_mediation, m.status as status_mediation , DATE_FORMAT(m.date_ask, "%Y-%m-%d") as date  from project p, mediation m where p.project_id = m.project_id and (m.status="미입금")', (error, result) => {
          response.render('admin_mediation_none', {data:result,login:userid, uri:uri });
        });
    }
    else if(update=='new'){                              // 정렬 내용이 최신순이라면  최신순으로 미입금인 전체 투자 의향 요청 내역 출력
        global.connection.query('SELECT *,p.title as title_project, m.title as title_mediation, m.status as status_mediation , DATE_FORMAT(m.date_ask, "%Y-%m-%d") as date  from project p, mediation m where p.project_id = m.project_id and (m.status="미입금") order by m.date_ask desc', (error, result) => {
          response.render('admin_mediation_none', {data:result,login:userid, uri:uri });
        });
    }
    else if(update=='old'){                                  // 정렬 내용이 오래된 순이라면 오래된 순으로 미입금인 전체 투자 의향 요청 내역 출력
        global.connection.query('SELECT *,p.title as title_project, m.title as title_mediation, m.status as status_mediation , DATE_FORMAT(m.date_ask, "%Y-%m-%d") as date  from project p, mediation m where p.project_id = m.project_id and (m.status="미입금") order by m.date_ask', (error, result) => {
          response.render('admin_mediation_none', {data:result,login:userid, uri:uri });
        });
    }
    else if(update == 'done'){                            //입금 상태 전환 요청인 경우 투자 의향 요청 내역의 입금 상태를 입금으로 수정
        global.connection.query('UPDATE mediation SET status="입금" , date_fee=NOW() where mediation_id='+what, (error, result) => {
	    response.redirect('/admin/mediation/none');
        });
    }

});


router.get('/mediation/done', function(request, response) {      //투자 의향 요청 내역( 입금)
    var userid = '';
    var update = request.query.update;      //url 쿼리의 update 정보 저장
    userid  = request.session.userId;        //세션의 아이디 정보 저장 
    var uri = 'done';                               //어떤 페이지 인지 알려주는 변수 

    if(!userid){                                      //세션의 아이디 정보가 없으면 
        response.redirect('/login');            //로그인 페이지로 이동
    }
    if(request.session.type != 'admin'){   //세션의 사용자 종류가 관리자가 아니라면
        response.redirect('/');                 //사용자 메인 페이지로 이동
    }

 if(!update){                                       //정렬 내용이 없다면 입금 상태인 투자 의향 요청 내역 출력 
	global.connection.query('SELECT *,p.title as title_project, m.title as title_mediation, m.status as status_mediation , DATE_FORMAT(m.date_fee, "%Y-%m-%d") as date from project p, mediation m where p.project_id = m.project_id and (m.status="입금")', (error, result) => {
      response.render('admin_mediation', {data:result,login:userid, uri:uri });
    });


    }

else if(update=='new'){                      //정렬 내용이 최신순이라면 입금 상태인 투자 의향 요청 내역을 최신순으로 출력
	global.connection.query('SELECT *,p.title as title_project, m.title as title_mediation, m.status as status_mediation , DATE_FORMAT(m.date_fee, "%Y-%m-%d") as date from project p, mediation m where p.project_id = m.project_id and (m.status="입금") order by m.date_fee desc', (error, result) => {
      response.render('admin_mediation', {data:result,login:userid, uri:uri });
    });

    }
else if(update=='old'){                         //정렬 내용이 최신순이 아니라면 입금 상태인 투자 의향 요청 내역을 오래된 순으로 출력 
	global.connection.query('SELECT *,p.title as title_project, m.title as title_mediation, m.status as status_mediation , DATE_FORMAT(m.date_fee, "%Y-%m-%d") as date from project p, mediation m where p.project_id = m.project_id and (m.status="입금") order by m.date_fee', (error, result) => {
      response.render('admin_mediation', {data:result,login:userid, uri:uri });
	
    });
}
});

module.exports = router;

