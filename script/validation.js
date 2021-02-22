let email=document.querySelector('.email');
let password=document.querySelector('.password');
let signIn=document.querySelector('.sign');
let line=document.querySelector('.line');
let line1=document.querySelector('.line1');
email.oninput=function()
{   
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(this.value))
    {
        signIn.disabled=false;
        line1.classList.add('visible');
        console.log(true);
    }

    else
    {    signIn.disabled=true;
        line1.classList.remove('visible');
    }
}
password.oninput=function()
{
    if(this.value.length<6)
    {
        signIn.disabled=true;
        line.classList.remove('visible')
    }
    else
    {
        signIn.disabled=false;
        line.classList.add('visible');
    }
}