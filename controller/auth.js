const bcrypt=require('bcrypt');//To encrypt the passwords
const User=require('../model/auth');
const Buyer=require('../model/buyer');
let sgMail=require('@sendgrid/mail');
let nodemailer=require('nodemailer');
let sendmailer=require('nodemailer-sendgrid-transport');
let transporter=nodemailer.createTransport(sendmailer({
    auth: {
        api_key: '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' 
    }
}))
let crypto=require('crypto');
const {validationResult}=require('express-validator/check')
exports.ask=(req,res,next)=>{

    res.render('ask',{option: req.params.option,path:''});
}

exports.login=(req,res,next)=>{

    let a=req.flash('info');
    res.render('login',{user: req.params.user,path:'/ask/login',error: a[0]})
}
exports.signin=(req,res,next)=>{
    
    res.render('signin',{user: req.params.user,path:'/ask/signin',error: undefined,oldInput: {email: "",password: "",confirmPassword: ""}})
}
exports.postlogin=(req,res,next)=>{

    let user=new User(req.body.email,req.body.password);
    user.verifyEmail(req.body.user).then(result=>{
        console.log(result[0][0]);
        if(result[0][0])
        {   req.session.userId=result[0][0].id;
            bcrypt.compare(req.body.password,result[0][0].password).then(result2=>{

            if(result2)
           {
            if(req.body.user==="seller")
            {
            req.session.seller=true;
               req.session.save((err)=>{
                res.redirect('/'); 
               
            })
        }
        else if(req.body.user==="buyer")
        {
            req.session.buyer=true;
            req.session.save((err)=>{
             res.redirect('/'); 
            })
        }
        }
        else
        {req.flash('info', 'Invalid email or password');
        let a=req.flash('info');
    
        res.render('login',{user: req.body.user,path:`/ask/login/`,error: a[0]})
        }
    }).catch(err=>{
        res.redirect('/500');
    })
} 
else
{
    req.flash('info', 'Invalid email or password');
    let a=req.flash('info');

    res.render('login',{user: req.body.user,path:'/ask/login',error: a[0]})
}
        }).catch(err=>{
            console.log(err);
          res.redirect('/500');
        })
    
}
exports.postsignin=(req,res,next)=>{
    let boom=req.body.user;
   
    const error=validationResult(req);

    if(!error.isEmpty())
    {
        return res.status(422).render('signin',{
            path:'/signin',
            error: error.array()[0].msg,
            oldInput: {email: req.body.email,password: req.body.password,confirmPassword: req.body.confirmPassword},
            validationError: error.array(),
            user: boom
        })
    }
    bcrypt.hash(req.body.password,1).then(result=>{
        console.log(result);
        let user=new User(req.body.email,result);
        user.verifyEmail(req.body.user).then(result12=>{
           
            if(!result12[0][0])
            {   console.log("hehe");
                user.save(req.body.user).then((result)=>{
                    sgMail.setApiKey('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')
                    const msg = {
                        to: req.body.email, // Change to your recipient
                        from: 'manshuchatrath20@gmail.com', // Change to your verified sender
                        subject: 'Confirmation of sign up',
                        html: '<p>Thankyou for signing up and becoming the member of our Buying and Selling</p><br><div>From<br>CEO of our company<br>Manshu Chatrath</div>',
                      }
                      sgMail.send(msg).then(()=>{
                        if(boom==="buyer")
                        {
                            User.fetch().then(result=>{
                                Buyer.createcart(result[0][0].id).then(result44=>{
                                    res.redirect(`/login/${boom}`)
                                }).catch(err=>{
                                    console.log(err);
                                })
                            })
                        }
                        else
                        {
                            res.redirect(`/login/${boom}`)
                        }
                     
                        
                        }).catch(err=>{
                            res.redirect('/500');
                      })
                }).catch(err=>{
                    res.redirect('/500');
                })
             }
             else
             {
                  
    res.render('signin',{user: req.body.user,path:'/ask/signin',error: "This user already exists",oldInput: {email: req.body.email,password: "",confirmPassword: ""}})
             }
        }).catch(err=>{
            res.redirect('/500');
        })
   
    }).catch(err=>{
        res.redirect('/500');
    })   

}
exports.postlogout=(req,res,next)=>{
    req.session.destroy(()=>{
        res.redirect("/"); 
    })
}
exports.reset=(req,res,next)=>{
   
     let a=req.flash('error','');
    res.render('email',{path:'',user: req.params.user,error:a[0]})
}

exports.postreset=(req,res,next)=>{
  
    crypto.randomBytes(32,(err,buffer)=>{
        if(err)
        {   let a=req.flash('info', 'This email dont exist');
            console.log("its an error")
            console.log(err);
            res.render('email',{path:'',user: req.params.user,error: a[0]})
        }
        else
        {    
        let user=new User(req.body.email,"");
            
        user.verifyEmail(req.body.user).then(result=>{
     
            if(!result[0][0])
        {   req.flash('error', 'No account with that email found')
      //  res.render('email',{path:`/reset/${req.body.user}`,user: req.params.user,error:a[0]})
            res.redirect(`/reset/${req.body.user}`);
        }
        else
    {   const token=buffer.toString('hex');
        User.reset(req.body.user,token,req.body.email).then(result1=>{
            let email=req.body.email;
            res.redirect('/ask/login');
            transporter.sendMail({
                to: email,
                from: 'manshuchatrath20@gmail.com',
                subject: 'Password',
                 html: `<p>You requested a password reset </p>
                 <h1>Click this <a href="https://buying-selling.herokuapp.com/resetpassword/${token}?${req.body.user}=true">link</a> to set a new password</h1>`
            })  
        }).catch(err=>{
            console.log(err);
         })
    }
    }).catch(err=>{
        console.log(err);
    })
}
})
}

exports.getnewpassword=(req,res,next)=>{
console.log(Date.now())
console.log(req.params.token);
console.log(req.query);
if(req.query.seller)
{   User.verify('seller',req.params.token).then(result=>{
    let user='seller';
    console.log(result[0][0]);
    res.render('password',{user:user, path: '',error: '',userId: result[0][0].id,password: result[0][0].password});
}).catch(err=>{
    console.log(err)
})
}
else if(req.query.buyer)
{   User.verify('buyer',req.params.token).then(result=>{
    let user='buyer';
    console.log(result[0][0]);
    res.render('password',{user:user, path: '',error: '',userId: result[0][0].id,password: result[0][0].password});
}).catch(err=>{
    console.log(err)
})
}
}
exports.postnewpassword=(req,res,next)=>{
    const newpassword=req.body.password;
    const userId=req.body.id;
    const error=validationResult(req);
    console.log(error.array());
    if(!error.isEmpty())
    {
        return res.status(422).render('password',{
            path:'',
            error: error.array()[0].msg,
            validationError: error.array(),
            user: req.body.user,
            userId: req.body.id
        })
    }
    console.log(newpassword);
    bcrypt.hash(newpassword, 12).then(hashed=>{
    User.update(req.body.user,hashed,userId).then(result=>{
        res.redirect(`/login/${req.body.user}`);
    }).catch(err=>{
        console.log(err);
    })
})
}
