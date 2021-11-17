var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const mysql=require('mysql');
const fs=require('fs');
const ejs=require('ejs');
const url = require('url');
const bodyParser = require('body-parser');
var cartItem=[];
var project_id_list=[];

router.use(bodyParser.urlencoded({extended:false}));


router.get('/cart',(request,response)=>
{
	var send =false;
	var userId = request.session.userId;
	global.connection.query('SELECT *,DATE_FORMAT(p.enddate, "%Y-%m-%d") as date FROM project p, cart c WHERE (p.project_id = c.project_id) and (c.userid=?)',[userId],(error,projectlist)=>
        {
                if(error)
			console.log(error);
		else 		
			response.render('cart',{cartItem:projectlist,
						 login:request.session.userId});
        });  
                    
});

router.get('/cart/delete',(request,response)=>
{
	var uri = url.parse(request.url,true);
	console.log(uri.query.projectid);
	console.log(request.session.userId);
	global.connection.query('DELETE FROM cart WHERE userid =? and project_id=?',[request.session.userId,uri.query.projectid],(error,results)=>
	{
		console.log('delete from cart table was compeleted!');
		response.status(304).redirect('/mypage/cart');
	});
});
	
router.get('/', function(req, res) {

    var userid = '';
    userid  = req.session.userId;
    var type = req.session.type;

    if(!userid){
	res.redirect('/login');
    }
    if(type == 'creator'){
	res.redirect('/mypage/myproject');
    }
	else if(type == 'investor'){
		res.redirect('/mypage/mediation');
	}
	else if(type == 'donator'){
		res.redirect('/mypage/donationlist');
	}

});

//창작자 마이페이지의 마이프로젝트(프로젝트 목록)를 불러오는 코드. 
router.get('/myproject', function(req, res){
                   var id=req.session.userId;
              if(!id){
        res.redirect('/login');
            }
global.connection.query('SELECT *, DATEDIFF(enddate,NOW()) as date FROM project WHERE userid=?', [id], function(error, results){
               console.log(error);
         res.render('myproject', {data:results});
      });
});


//창작자 마이페이지에서 마이프로젝트 별 후원자 리스트를 불러오는 코드. 배송정보를 입력했으면 버튼옆에 '입력완료'표시를 하기 위해 delivery테이블도 쿼리함.
router.get('/myproject/donator/:project_id', function(req, res){
      var id=req.session.userId;
      var projectid = req.params.project_id;
              if(!id){
        res.redirect('/login');
            }
global.connection.query('select title from project where project_id=?', [projectid], function(error, result){
global.connection.query('select * from donation d, member m where d.userid=m.userid and d.project_id=?',[projectid], function(error, results){
global.connection.query('select * from donation d, delivery de where d.donation_id=de.donation_id and d.project_id=?',[projectid], function(error, resu){
                         res.render('donatorlist', {project:result[0], data:results, delivery:resu  });
              });
          });
    });
});


//창작자 마이페이지-마이프로젝트-후원자 리스트에서 배송정보를 입력해서 디비에 저장하는 코드
router.post('/myproject/donator/:project_id', function(req, res){
     var projectid=req.params.project_id;
     donation_id=req.query.donation_id;
     var body=req.body;
     global.connection.query('insert into delivery (donation_id, company, transport_num) VALUES(?,?,?)', [donation_id, body.company, body.transport_num], ()=>{
    res.redirect('/mypage/myproject/donator/'+projectid);
  });
});

//후원자 마이페이지에서 펀딩내역 목록을 불러오는 코드
router.get('/donationlist', function(req, res){
	var id=req.session.userId;
	if(!id){
		res.redirect('/login');
	}
	
	global.connection.query('select * from donation d, project p where p.project_id=d.project_id and d.userid="' + id + ' "' , function(error, result){
		if(error) 
			console.log(error+'\n'+result);
		global.connection.query('select *, d.project_id from delivery de, donation d where d.donation_id=de.donation_id and d.userid="' + id + '"' , function(err, resu){
			if(err)
				console.log(err);
			console.log(resu);
			res.render('myfunding', {data:result, delivery:resu});
		});
    }); 
});

//후원자 마이페이지에서 QnA목록을 불러오는 코드
router.get('/QnA', function(req, res){
       var id=req.session.userId;
              if(!id){
        res.redirect('/login');
            }

    fs.readFile('./views/myQnA.ejs', 'utf8', (error, data)=>{
       global.connection.query('select * from (select * from QnA where userid="' + id + '") q, project p where p.project_id=q.project_id',(error, results)=>{
    	    if(error) console.log(error);
	    res.send(ejs.render(data, {
            data: results
     	    }));
       });
  });
 });

//후원자 마이페이지-펀딩내역에서 후기를 작성하는 페이지를 불러오는 코드
router.get('/donationlist/review/:project_id', function(req, res){
var id=req.session.userId;
var projectid=req.params.project_id;
global.connection.query('select * from review where userid=? and project_id=?', [id, projectid], function(error, results){
       if(results.length){
          res.send('<script>alert("이미 후기를 작성한 프로젝트입니다."); location.href="/mypage/donationlist";</script>');
     }else{
    res.render('reviewwrite');
     }
   });
});

//후원자 마이페이지-펀딩내역에서 후기를 작성하고 디비에 저장하는 코드
router.post('/donationlist/review/:project_id', function(req, res){
  var id=req.session.userId;
  if(!id){res.redirect('/login');}
  var projectid = req.params.project_id;
  var body=req.body;
global.connection.query('INSERT INTO review (project_id, userid, title, content) VALUES (?,?,?,?)', [projectid, id, body.title, body.content], ()=>{
     res.redirect('/mypage/donationlist');
       });
});

//후원자 마이페이지에서 후기 내역 목록을 불러오는 코드
router.get('/review', function(req, res){
            var id=req.session.userId;
              if(!id){
        res.redirect('/login');
            }
          global.connection.query('select *, p.title as project_title from project p, (select * from review where userid="' + id + '") r where p.project_id=r.project_id', function(error, result){
                   if(error)
                          console.log(error);
                   else           
                     res.render('myreview', {data:result});
        });
});

// 개인정보 변경 페이지 요청을 처리하는 부분
router.get('/edit', function(req, res) {
    var userid = '';
    userid  = req.session.userId;
    var type = req.session.type;
    
    if(!userid){
        res.redirect('/login');
    }
// 현재 사용자의 정보 불러옴
    global.connection.query("SELECT * from member where userid='" + userid + "'", function(error, result){
        console.log(error+'\n'+result);
        res.render('edit', {data:result, login:userid, type:type});
    }); 
});


router.post('/edit', function(req, res) {
    var email = req.body.email;
    var phone = req.body.phone;
    var address = req.body.address;
    var userid = req.session.userId;

// 사용자가 입력한 내용 디비에 업데이트
    global.connection.query("UPDATE member SET email='"+email+"', phone='"+phone+"', address='"+address+ "' where userid='" + userid + "'", function(error, result){
        console.log(error);
        res.redirect('/mypage/edit');
    });
});

// 비밀번호 수정 페이지 요청을 처리하는 부분
router.get('/edit/password', function(req, res) {
    var userid = req.session.userId;
    var type = req.session.type;
    if(!userid){
        res.redirect('/login');
    }
    res.render('edit_password', {type:type});
});

const myHash = function myHash(key){
        var hash = crypto.createHash('sha1');
        hash.update(key);
        return hash.digest('hex');
}

// 비밀번호 변경 처리하는 부분
router.post('/edit/password', function(req, res) {
    var userid = req.session.userId;
    var now = req.body.now;
    now = myHash(now);
    var newp = req.body.newp;
    newp = myHash(newp);
    var result=true;    

    const change = function change(){
	// 새로 입력한 비밀번호 두개가 일치하면
	if(req.body.newcheck == req.body.newp){
		// 새로운 비밀번호 디비에 업데이트
            global.connection.query("UPDATE member SET password ='"+ newp + "' where userid='"+userid+"'", function(error){
	        res.send('<script>alert("비밀번호를 변경하였습니다."); location.href="/mypage/edit/password";</script>');
	        console.log(error);	
            });
	}
	// 새로 입력한 비밀번호 두개가 일치하면
	else{
	  res.send('<script>alert("비밀번호가 서로 일치하지 않습니다."); location.href="/mypage/edit/password";</script>');
	  result=false;
	}
    }

// 현재 비밀번호 조회
    global.connection.query("SELECT password from member where userid='"+userid+"'", function(error, result){
	// 현재 비밀번호 조회해서 입력한 비밀번호화 일치하다면 새로운 비밀번호로 변경
	if(now == result[0].password){
	    change();
	}
        else{
	  res.send('<script>alert("현재 비밀번호가 일치하지 않습니다."); location.href="/mypage/edit/password";</script>');
	}
    });
});

// 프로젝트 페이지 개설 신청 목록 조회 처리
router.get('/apply', function(req, res) {
	var userid = req.session.userId;
	var type = req.session.type;

    if(!userid){
        res.redirect('/login');
    }

    global.connection.query("SELECT *, DATE_FORMAT(enddate, '%Y-%m-%d') as date from project where userid='" + userid + "'", function(error, result){
        res.render('mypage_apply', {data:result, type:type});
    });

});

// 미승인된 프로젝트를 취소하는 경우 처리
router.get('/apply/cancel', function(req, res) {
	var userid = req.session.userId;
	var type = req.session.type;
    // 테이블에서 삭제
    global.connection.query("DELETE from project where project_id=" + id, function(error, result){
        res.redirect('/mypage/apply');
    });
});

// 중개 요청 내역 조회
router.get('/mediation', function(req, res) {
    var userid = req.session.userId;
	var type = req.session.type;

    var update = req.query.update;
    var what = req.query.what;

    if(!userid){
		res.redirect('/login');
	}

	// 창작자인 회원인 경우
	if(type == 'creator'){
		if(!update){
		// 투자 의향 요청 내역 조회
	       global.connection.query("SELECT m.*, DATE_FORMAT(m.date_ask, '%Y-%m-%d') as date, p.title as project_title from mediation m, project p where m.creator='" + userid +"' and p.project_id=m.project_id and m.status!='미입금' ", function(error, result){
	       		if(error) console.log(error);
						res.render('mypage_mediation_cre', {data:result, type:type});
			});
		}
		// 창작자가 승인한 경우
		else if(update == 'admit'){
		global.connection.query('UPDATE mediation SET status="수락" where mediation_id='+what, (error, result) => {
				if(error) console.log(error);
	    		res.send('<script>alert("투자 의향 요청을 수락하였습니다."); location.href="/mypage/mediation";</script>');
			});
	    	}
		// 창작자가 거부한 경우
		else if(update == 'deny'){
			global.connection.query('UPDATE mediation SET status="거절" where mediation_id='+what, (error, result) => {
				if(error) console.log(error);
	    				res.send('<script>alert("투자 의향 요청을 거절하였습니다."); location.href="/mypage/mediation";</script>');
			});
	    	}
	}

	// 투자자 회원인 경우
	else if(type == 'investor'){
       	global.connection.query("SELECT m.*, DATE_FORMAT(m.date_ask, '%Y-%m-%d') as date_ask, DATE_FORMAT(m.date_fee, '%Y-%m-%d') as date_fee, p.title as project_title from mediation m, project p where m.investor='" + userid +" ' and m.project_id=p.project_id ", function(error, result){
			res.render('mypage_mediation_inv', {data:result, type:type});
		});
	}
	else{
		res.redirect('/mypage');
	}
});


module.exports = router;

