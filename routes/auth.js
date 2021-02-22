const express=require('express');
const app=express();
const controller=require('../controller/auth');
const {check}=require('express-validator');
app.get('/ask/:option',controller.ask);
app.get('/signin/:user',controller.signin);
app.get('/login/:user',controller.login);
app.post('/login',controller.postlogin);
app.post('/logout',controller.postlogout);
app.post('/signin',[check('email').isEmail().withMessage('Please enter a valid email'),check('password').trim()
.isLength({min: 5})
.withMessage('The length of your password is less than 5'),
check('confirmpassword').custom((value,{req})=>{
    console.log(req.body.password+","+value)
if(value!=req.body.password)
{
    throw new Error("Password don't match");
}
return true;
})],controller.postsignin);
app.get('/reset/:user',controller.reset);
app.post('/reset',controller.postreset);
app.get('/resetpassword/:token',controller.getnewpassword);
app.post('/newpassword',[check('password').trim().isLength({min: 5}).withMessage('The length of password is less than 5')],controller.postnewpassword);
module.exports=app;