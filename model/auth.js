const db=require('../database/database');
module.exports=class Person{
    constructor(email,password)
    {
        this.email=email;
        this.password=password;
    }
    save(user)
    {  
        return db.execute(`insert into ${user} (email,password) values(?,?)`,[this.email,this.password]);
    }
    verifyEmail(user)
{   console.log("So user is "+user);
    return db.execute(`select * from ${user} where email=(?)`,[this.email])
}
static fetch()
{
    return db.execute('select * from buyer order by id desc limit 1');
}
static reset(user,token,email)
{
    return db.execute(`update ${user} set token=(?),expiration=(?) where email=(?)`,[token,Date.now()+3600000,email]);
} 
static verify(user,token)
{
    return db.execute(`select * from ${user} where token=(?) and expiration>(?)`,[token,Date.now()])
}
static update(user,password,id)
{console.log(user);
    console.log(password);
    console.log(id);
return db.execute(`update ${user} set password=(?) where id=(?)`,[password,id])
}
}