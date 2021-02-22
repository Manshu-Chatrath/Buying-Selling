const express=require('express');
const app=express();
const path=require('path');
const user=require('./routes/user');
const auth=require('./routes/auth');
const parser=require('body-parser');
var session = require('express-session');
const error=require('./controller/error');
var flash = require('connect-flash');
var MySQLStore = require('express-mysql-session')(session);
const compression=require('compression');
const multer=require('multer');
var options = {
	host: 'us-cdbr-east-03.cleardb.com',
	user: 'b41c204bddea98',
	password: '24126f1b',
    database: 'heroku_14016bef64c0642',
    schema: {
		tableName: 'sessions',
		columnNames: {
			session_id: 'session_id',
			expires: 'expires',
			data: 'data'
        } 
    }
};
var sessionStore = new MySQLStore(options);
const filestorage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'images');
    },
    filename: (req,file,cb)=>{
        cb(null,Date.now()+'-'+file.originalname);
    }
})
const fileFilter=(req,file,cb)=>{
	console.log(file.mimetype);
	if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg')
	{
		cb(null,true)
	}
	else
	{
		cb(null,false)
	}
}
app.set('view engine','ejs'); 
app.set('views','views');
app.use(parser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'css')));
app.use('/images',express.static(path.join(__dirname,'images')));
app.use(multer({storage: filestorage,fileFilter: fileFilter}).single('url'));
app.use(session({ 
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}));
app.use(compression());
app.use(flash());
app.use((req,res,next)=>{
    buyer=req.session.buyer;
    seller=req.session.seller;
    next();
})
app.use(user);
app.use(auth);
app.use('/500',error.get500);
app.use(error.get404);
app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
