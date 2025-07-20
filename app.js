 var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const {connectToMongoDb} = require("./config/db");
require("dotenv").config();
const http = require('http');//1
const session = require('express-session');
const cors = require("cors");//pour frontend
const authRouter = require("./routes/authRouter");
const logMiddleware = require('./middlewares/logsMiddlewares.js'); //log

 const fetch = require('node-fetch');
 global.fetch = fetch;
 global.Headers = fetch.Headers;
 global.Request = fetch.Request;
global.Response = fetch.Response;

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/usersRouter');
const osRouter = require('./routes/osRouter');
const formationRouter = require('./routes/formationRouter');
const GeminiRouter = require('./routes/GeminiRouter');
const chapitreRouter = require('./routes/chapitreRouter');
const enregistrementRouter = require('./routes/enregistrementRouter');
const categoryRouter = require('./routes/categoryRouter');
const sessionRouter = require('./routes/sessionRouter');

// Import meeting routes
const meetingRoutes = require("./routes/meetingRoutes"); 



var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(logMiddleware)  //log

app.use(cors({
  origin: process.env.origin_Front,//port frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(session({
  secret: "net secret pfe",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 24*60*60*1000,
    //maxAge: 1*60*60,
  },
}))


//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/os', osRouter);
app.use('/formations', formationRouter);
app.use('/Gemini', GeminiRouter);
app.use('/chapitre',chapitreRouter );
app.use('/enregistrement',enregistrementRouter );
app.use('/category',categoryRouter );
app.use('/session',sessionRouter );

app.use("/api/auth", authRouter);

// meeting endpoints base route  
app.use("/api/meetings", meetingRoutes);
// test
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint is working!' });
});



app.use(cookieParser());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({
  // res.render('error');
  error: err.message || 'internal server error'});
});

const server = http.createServer(app); //2
server.listen(process.env.port, () => {
  connectToMongoDb()
  console.log("app is running on port 5000");

});