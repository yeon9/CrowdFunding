var express = require('express');
var fs = require('fs');
var router = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var util = require('util');

var title;
var category;
var type;
var content;
var info;
var goal;
var enddate;
var reward1, reward2, reward3, reward4, reward5, price1, price2, price3, price4, price5;
var main1, main2;
var userid, data;

router.get('/', function(req, res) {
    userid = req.session.userId;

	// 창작자가 아닐 경우 메인으로 리다이렉트
	var type = req.session.type;
	if(type != 'creator'){
		res.redirect('/');
	}
    res.render('apply');
});

router.get('/image', function(req, res) {
// 메인 이미지 업로드 페이지
    res.render('apply_file');    
});

router.post('/image', function(req, res){
	// price 옵션을 입력하지 않았을 경우 0으로 세팅
   if(!price2)	price2=0;
   if(!price3)	price3=0;
   if(!price4)	price4=0;
   if(!price5)	price5=0;

	// 메인이미지까지 업로드 하면 디비에 삽입
	global.connection.query(`INSERT INTO project (title, userid, goal, gather, type, category, enddate, status, main_image1, main_image2, content, creators, reward1, reward2, reward3, reward4, reward5, price1, price2, price3, price4, price5) values ('`+ title + `', '` +  userid + `', ` +  goal + `, 0, '` +  type + `' , '` +  category + `', '` +  enddate + `' , '미승인', '`+  main1 +  `' , '` +  main2 + `' , '` +  content + `' , '` +  info + `' , '` +  reward1 + `', '` + reward2 + `', '`+ reward3 + `', '` + reward4 +`', '` + reward5 + `', ` +  price1 + `,`+ price2 + `,` +  price3 + `,` +  price4 + `,` +  price5 + `)`, (err)=>{
		if(err)
			console.log(err);
		// 디비에 업로드 후 메인으로 리다이렉트
		res.redirect('/');
    }); 

});

router.post('/image/upload1', multipartMiddleware, function(req, res){

    var fs = require('fs');

    // 메인 이미지1 업로드
    fs.readFile(req.files.upload.path, function (err, data) {
	// 업로드한 이미지 파일 이름, 경로 설정
        var newPath = __dirname + '/../public/uploads/' + req.files.upload.name;

	// 디비에 저장할 메인 이미지 파일 이름
	 main1 = req.files.upload.name;
	
	// 업로드한 이미지 /public/uploads에 새로운 파일명으로 쓰기
        fs.writeFile(newPath, data, function (err) {
            if (err) console.log({err: err});
            else {
                html = "";
                html += "<script type='text/javascript'>";
                html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
                html += "    var url     = \"/uploads/" + req.files.upload.name + "\";";
                html += "    var message = \"Uploaded file successfully\";";
                html += "";
                html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
                html += "</script>";

                res.send(html);
            }
        });
    });
    
});

router.post('/image/upload2', multipartMiddleware, function(req, res){

    var fs = require('fs');
    
    // 메인 이미지2 업로드
    fs.readFile(req.files.upload.path, function (err, data) {

	// 디비에 저장할 메인 이미지 파일 이름
        var newPath = __dirname + '/../public/uploads/' + req.files.upload.name;
	main2 = req.files.upload.name;

	// 업로드한 이미지 /public/uploads에 새로운 파일명으로 쓰기
        fs.writeFile(newPath, data, function (err) {
            if (err) console.log({err: err});
            else {
                html = "";
                html += "<script type='text/javascript'>";
                html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
                html += "    var url     = \"/uploads/" + req.files.upload.name + "\";";
                html += "    var message = \"Uploaded file successfully\";";
                html += "";
                html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
                html += "</script>";

                res.send(html);
            }
        });
    });
});

function strip_tags (input, allowed) {
    allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); 
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {        
    return  allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';

   });
}


router.post('/', function(req, res){

    title = req.body.title;
    category = req.body.category;
    type = req.body.type;
    content = req.body.editor;
 
    content = content.replace('/&amp;/g', ' ');
    content = content.replace('/&nbsp;/g', ' ');
    content = content.replace('/&quot;/g', ' ');
    content = content.replace('/&#39;/g', ' ');
    content = content.replace('/&lt;/g', '<');
    content = content.replace('/&gt;/g', '>');
   content = strip_tags(content);


    info = req.body.info;
    goal = req.body.goal;
    reward1 = req.body.reward1;
    reward2 = req.body.reward2;
    reward3 = req.body.reward3;
    reward4 = req.body.reward4;
    reward5 = req.body.reward5;
    price1 = req.body.price1;
    price2 = req.body.price2;
    price3 = req.body.price3;
    price4 = req.body.price4;
    price5 = req.body.price5;

    enddate = req.body.enddate;

   res.redirect('/apply/image');

});



router.post('/uploader', multipartMiddleware, function(req, res) {
 
   var fs = require('fs');

    fs.readFile(req.files.upload.path, function (err, data) {
        var newPath = __dirname + '/../public/uploads/' + req.files.upload.name;
        fs.writeFile(newPath, data, function (err) {
            if (err) console.log({err: err});
            else {
                html = "";
                html += "<script type='text/javascript'>";
                html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
                html += "    var url     = \"/uploads/" + req.files.upload.name + "\";";
                html += "    var message = \"Uploaded file successfully\";";
                html += "";
                html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
                html += "</script>";

                res.send(html);
            }
        });
    });
});


module.exports = router;

