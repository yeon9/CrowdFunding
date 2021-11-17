var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var session = require('express-session')
var mysql = require('mysql')
var nodemailer = require('nodemailer')
var reg = require('./routes/register')
var logout = require('./routes/logout')
var detail = require('./routes/projectdetail')
var index = require('./routes/index')
var apply = require('./routes/apply')
var project = require('./routes/project')
var admin = require('./routes/admin')
var mypage = require('./routes/mypage')
var donation = require('./routes/donation')
var login = require('./routes/login')
var find = require('./routes/find')
var addcart = require('./routes/addcart')
var mediation = require('./routes/mediation')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use((request, response, next) => {
	global.connection = mysql.createConnection({
		host: '192.9.44.53',
		port: 3306,
		user: 'Thurs_7team',
		password: 'clfwh12345',
		database: 'Thurs_7team',
	})
	connection.connect()
	next()
})

app.use(
	session({
		secret: 'secret key',
		resave: false,
		saveUninitialized: true,
	})
)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/project/detail', detail)
app.use('/find', find)
app.use('/logout', logout)
app.use('/reg', reg)
app.use('/login', login)

app.use('/donation', donation)
app.use('/mypage', mypage)
app.use('/apply', apply)
app.use('/admin', admin)
app.use('/project', project)
app.use('/addcart', addcart)
app.use('/mediation', mediation)
app.use('/', index)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found')
	err.status = 404
	next(err)
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app
