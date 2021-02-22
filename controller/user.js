const Seller=require('../model/seller');
const Buyer=require('../model/buyer');
const db=require('../database/database');
const {validationResult}=require('express-validator')
exports.get=(req,res,next)=>{
    Seller.fetchall().then(products=>{
    
        res.render('index',{products: products[0],path:'/'});
    }).catch(err=>{
        res.redirect('/500');
    })
  
}
exports.recent=(req,res,next)=>{
    if(req.session.seller)
    {  
        Seller.fetchrecent(+req.session.userId).then(result=>{
        res.render('myproducts',{products:result[0],path:''})
    }).catch(err=>{
        res.redirect('/500');
    })     
    }
    else if(req.session.buyer)
    {   Buyer.fetchrecent().then(result=>{
        res.render('products',{products: result[0],path:''})
    }).catch(err=>{
        res.redirect('/500');
    })
  
       
    }
    else 
    {     
        Buyer.fetchrecent().then(result=>{
        res.render('index',{products: result[0],path:''})
    }).catch(err=>{
        res.redirect('/500');
    })
  
        
    }
   
}
exports.search=(req,res,next)=>{
 
 Seller.savesearch(req.body.searched).then(result=>{
     res.redirect('/search')
 }).catch(err=>{
    res.redirect('/500');
})

}

exports.getsearch=(req,res,next)=>{
    Seller.release().then(search=>{
        let title=search[0][0].title;
        if(req.session.seller)
        {   Seller.search(title).then(result=>{
            Seller.delete().then(boom=>{
                res.render('myproducts',{products: result[0],path:'/myproducts'});
            }).catch(err=>{
                res.redirect('/500');
            })
        }).catch(err=>{
            res.redirect('/500');
        })
      
    }
        else if(req.session.buyer)
        {   Seller.release().then(search=>{
            let title=search[0][0].title;
       
          Seller.delete().then(boom=>{
              console.log("So title is "+title);
                Buyer.search(title).then(result=>{
              
                    res.render('products',{products: result[0],path:'/products'});          
            }).catch(err=>{
                console.log(err);
            }) 
        }).catch(err=>{
            res.redirect('/500');
        })
        }).catch(err=>{
            res.redirect('/500');
        })
      
     }
        else  
        {     console.log("haha");
       Seller.release().then(search=>{
           let title=search[0][0].title;
        Seller.delete().then(boom=>{
            Buyer.search(title).then(result=>{
                res.render('index',{products: result[0],path:'/'});
            }).catch(err=>{
                res.redirect('/500');
            })
                    
        }).catch(err=>{
            res.redirect('/500');
        })
       }).catch(err=>{
        res.redirect('/500');
    })
              
        }
})

}
exports.input=(req,res,next)=>{
    res.render('input',{editing: false,path:'/input',error:''});
}
exports.myproducts=(req,res,next)=>{
    Seller.fetchsome(req.session.userId).then(products=>{
        res.render('myproducts',{products: products[0],path:'/myproducts'});
    }).catch(err=>{
        res.redirect('/500');
    })
  
    
}
exports.postinput=(req,res,next)=>{
    const error=validationResult(req);

    if(!error.isEmpty())
    {
        return res.status(422).render('input',{
            path:'/input',
            error: error.array()[0].msg,
            validationError: error.array(),
            editing: false
        })
    }
      const seller=new Seller(req.body.title,req.body.summary,req.body.price,req.file.path,req.body.description,req.session.userId);
    seller.save().then(result=>{
        res.redirect('/myproducts')
    }).catch(err=>{
        res.redirect('/500');
    })
}
exports.delete=(req,res,next)=>{
 
   // db.execute('delete from products where id=(?)',[req.body.productId])
   db.execute('delete from products where id=(?) and seller_id=(?)',[req.body.productId,req.body.sellerId]).then(result=>{ //I m noty using model here because if i use seller function
    console.log("So we are inside delete ");    //it doesnt work so do verify when you ll read this project
    console.log(result);
    res.redirect('/myproducts');
}).catch(err=>{
    res.redirect('/500');
})
}
exports.edit=(req,res,next)=>{

Seller.fetchone(req.params.productId).then(result=>{
  
    res.render('input',{editing: req.query.editing,product: result[0][0],path:'',error:''})
}).catch(err=>{
    res.redirect('/500');
})
}
exports.postedit=(req,res,next)=>{

 const error=validationResult(req);
 console.log(error.array());
 if(!error.isEmpty())
 {console.log(req.file.path)
     return res.status(422).render('input',{
         path:'/input',
         error: error.array()[0].msg,
         validationError: error.array(),
         product: {title: req.body.title,summary: req.body.summary,price: req.body.price,image: req.file.path,description: req.body.description,id: req.body.productId},
         editing: true
     })
 }
    const seller=new Seller(req.body.title,req.body.summary,+req.body.price,req.file.path,req.body.description);
    seller.update(req.body.productId).then(result=>{
        res.redirect('/myproducts');
    }).catch(err=>{
        res.redirect('/500');
    })
}            
exports.details=(req,res,next)=>{
    Seller.fetchone(req.params.productId).then(result=>{
        
        res.render('details',{product: result[0][0]});
    }).catch(err=>{
        res.redirect('/500');
    })
}
exports.products=(req,res,next)=>{
    Buyer.fetchall().then(result=>{
        res.render('products',{products:result[0],path:'/products'})
    }).catch(err=>{ 
        res.redirect('/500');
    })  
}
exports.postcart=(req,res,next)=>{
    if(!req.body.quantity) 
    {
       Buyer.fetchone(req.body.productId).then(result=>{
           Buyer.cartId(req.session.userId).then(result1=>{
            Buyer.storecart(result[0][0].id,result[0][0].seller_id,result1[0][0].id,req.session.userId).then(result2=>{
                res.redirect('/cart');
            }).catch(err=>{
               res.redirect('/500')
            })
           }).catch(err=>{
            res.redirect('/500');
        })
        }).catch(err=>{ 
            res.redirect('/500');
        })
      
    }
    else 
    {   
      
        for(let i=0;i<req.body.quantity;i++)
        {    Buyer.fetchone(req.body.productId).then(result=>{
                Buyer.cartId(req.session.userId).then(result1=>{
                 Buyer.storecart(result[0][0].id,result[0][0].seller_id,result1[0][0].id,req.session.userId).then(result2=>{
                     res.redirect('/cart');
                 }).catch(err=>{
                     res.redirect('/500')
                 })
                })
            
             })
        }
    }
}  
exports.getcart=(req,res,next)=>{
    Buyer.cartId(req.session.userId).then(result1=>{
    Buyer.showcart(result1[0][0].id).then(products=>{
        res.render('cart',{products: products[0],buyerId: req.session.userId,path:'/cart'});
    }).catch(err=>{
        console.log(err);
        res.redirect('/500');
    })
    }).catch(err=>{
        console.log(err);
        res.redirect('/500');
    })
  
}
exports.deletecart=(req,res,next)=>{
    Buyer.deletecart(req.body.productId).then(result=>{
        res.redirect('/cart');
    }).catch(err=>{
      res.redirect('/500');
    })
}
exports.postorder=(req,res,next)=>{
    console.log("So id is "+req.session.userId);
 Buyer.order(req.session.userId).then(result=>{
    Buyer.orderId().then(result1=>{
        console.log(result1[0][0]);
        Buyer.cartInfo(req.session.userId).then(result2=>{
            console.log(result2[0]);
            for(let i=0;i<result2[0].length;i++)
            {
    Buyer.productorders(result2[0][i].product_id,result2[0][i].seller_id,result1[0][0].id,result2[0][i].buyer_id).then(result3=>{
     Buyer.removecart(req.session.userId).then(finaly=>{
         res.redirect('/orders');
         })
                }).catch(err=>{
                    console.log(err);
                });
            }
        })
    })
 }).catch(err=>{
     console.log(err);
     res.redirect('/500');
 })   
}    
exports.getorder=(req,res,next)=>{
Buyer.getorders(req.session.userId).then(result=>{
    console.log(result[0]);
    res.render('orders',{products: result[0],path:'/orders'})
})
}