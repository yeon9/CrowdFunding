const url = require('url');
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const fs=require('fs');
const ejs=require('ejs');

router.use(bodyParser.urlencoded({extended:false}));

router.get('/:project_id',(request,response)=>
{
        var projectid = request.params.project_id;  //프로젝트 아이디 저장 
	global.connection.query('SELECT COUNT(*) as count FROM donation WHERE project_id=?',[projectid],(error,results1)=> //프로젝트 후원 정보 출력  
	{
		
        	global.connection.query('SELECT *,DATEDIFF(enddate,NOW()) as date FROM project WHERE project_id =?',[projectid],(error,results)=> //프로젝트 정보 출력
        	{
                	if(results.length)
                	{        
				if(request.session.type=='creator') //만약 사용자가 창작자라면 
                        	{
					response.render('projectdetail_cre',{project:results[0],
									count:results1[0],
									login:request.session.userId});
                        	}
                        	else if(request.session.type =='donator') // 만약 사용자가 후원자라면 
                        	{
					response.render('projectdetail',{project:results[0],
									count:results1[0],
									login:request.session.userId});
                        	}
                        	else if(request.session.type=='investor') //만약 사용자가 투자자라면 
                        	{
					response.render('projectdetail_inv',{project:results[0],
									count:results1[0],
									login:request.session.userId});
                        	}
                        	else if(request.session.type=='admin') // 만약 사용자가 관리자라면 
                        	{
					response.render('projectdetail_admin',{project:results[0],
									count:results1[0],
									login:request.session.userId});
				}
                        	else //로그인 되어 있지 않은 상태라면 
                        	{
					response.render('projectdetail',{project:results[0],
									count:results1[0],
									login:request.session.userId});
                        	}
                	}
                	else // 프로젝트 아이디에 관한 프로젝트 정보가 없다면 
                	{
                        	response.status(404).send('not found');
                	}
        	});
	});
});


//해당 project_id를 가진 프로젝트의 상세페이지의 QnA페이지를 보여주는 코드
router.get('/:project_id/QnA',(request,response)=>{
              var projectid = request.params.project_id;
                      
	global.connection.query('SELECT COUNT(*) as count FROM donation WHERE project_id=?',[projectid],(error,results1)=>
	{
        	global.connection.query('SELECT *,DATEDIFF(enddate,NOW()) as date FROM project WHERE project_id =?',[projectid],(error,results)=>
        	{
                            
                	if(results.length)
                	{                        
		 global.connection.query('select * from (select * from QnA where project_id="' + projectid + '") q, member m where q.userid=m.userid', (error,results2)=>{

                        	if(request.session.type=='creator')
                        	{
					response.render('projectQnA_cre',{project:results[0],
									count:results1[0],
                                                                        QnA:results2,
									login:request.session.userId});
                        	}
                        	else if(request.session.type =='donator')
                        	{
                                        response.render('projectQnA',{project:results[0],
									count:results1[0],
                                                                        QnA:results2,
									login:request.session.userId});
                        	}
                        	
                        	else if(request.session.type=='admin')
                        	{
					response.render('projectQnA_adm',{project:results[0],
                                                                        QnA:results2,
									count:results1[0],
									login:request.session.userId});
				}
                        	else
                        	{
					response.render('projectQnA',{project:results[0],
									count:results1[0],
                                                                        QnA:results2,
									login:request.session.userId});
                        	}
                                              });
                	}
                	else
                	{
                        	response.status(404).send('not found');
                	}
                                
        	});
	});
});


//해당 project_id를 가진 프로젝트의 상세페이지의 review페이지를 보여주는 코드
router.get('/:project_id/review',(request,response)=>{
               var projectid = request.params.project_id;
	global.connection.query('SELECT COUNT(*) as count FROM donation WHERE project_id=?',[projectid],(error,results1)=>
	{
        	global.connection.query('SELECT *,DATEDIFF(enddate,NOW()) as date FROM project WHERE project_id =?',[projectid],(error,results)=>
        	{
                              
                	if(results.length)
                	{console.log(results);
                           global.connection.query('select * from (select * from review where project_id="' + projectid + '") r, member m where r.userid=m.userid', (error,results2)=>{

                                                   
                        	if(request.session.type=='creator')
                        	{
					response.render('projectreview_cre',{project:results[0],
									count:results1[0],
                                                                        review:results2,
									login:request.session.userId});
                        	}
                        	else if(request.session.type =='donator')
                        	{
                                        response.render('projectreview',{project:results[0],
									count:results1[0],
                                                                        review:results2,                                             
									login:request.session.userId});
                                                       }
                        	else if(request.session.type=='investor')
                        	{
					response.render('projectreview_inv',{project:results[0],
									count:results1[0],
                                                                        review:results2,
									login:request.session.userId});
                        	}
                        	else if(request.session.type=='admin')
                        	{
					response.render('projectreview_adm',{project:results[0],
									count:results1[0],
                                                                        review:results2,
									login:request.session.userId});
				}
                        	else
                        	{
					response.render('projectreview',{project:results[0],
									count:results1[0],
                                                                        review:results2,
									login:request.session.userId});
                        	}
                                              });
                	}
                	else
                	{
                        	response.status(404).send('not found');
                	}
                              
        	});
	});
});


//창작자가 해당 project_id를 가진 프로젝트의 해당 질문(QnA_id)의 답변을 쓰는 페이지(팝업창)을 불러오는 코드
router.get('/:project_id/QnA/:QnA_id', (req, res)=>{
 var projectid = req.params.project_id;
 var QnAid=req.params.QnA_id;
 res.render('answerwrite');
});


//후원자가 프로젝트 상세페이지의 QnA에서 질문을 작성해서 DB에 저장하는 코드
router.post('/:project_id/QnA',(req, res)=>{
   var id=req.session.userId;
   var projectid = req.params.project_id;

         var body=req.body;
  global.connection.query('INSERT INTO QnA (project_id, userid, question) VALUES (?,?,?)', [projectid, id, body.question], ()=>{
   res.redirect('/project/detail/'+projectid+'/QnA');
    });
  
});
  

//창작자가 답변을 쓰고 서버로 보내서 DB에 저장하는 코드
router.post('/:project_id/QnA/:QnA_id', (req, res)=>{
 var projectid = req.params.project_id;
 var QnAid=req.params.QnA_id; 
  var body=req.body;
  global.connection.query('UPDATE QnA SET answer=? where QnA_id=?', [body.answer, QnAid], ()=>{
       res.render('answercomplete');
    });
});

module.exports = router

