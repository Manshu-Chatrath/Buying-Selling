const db=require('../database/database');
module.exports=class Buyer{
static fetchall()
{   console.log();
    return db.execute('select * from products');
}
static createcart(id)
{   console.log("So id for cart is "+id);
    return db.execute('insert into cart (buyer_id) values(?)',[id])
}
static fetchone(id)
{
    return db.execute('select * from products where id=(?)',[id])
}
static storecart(product_id,seller_id,cart_id,buyer_id)
{
    return db.execute('insert into products_in_cart (product_id,seller_id,cart_id,buyer_id) values(?,?,?,?)',[product_id,seller_id,cart_id,buyer_id]);
}
static cartId(id)
{   console.log(id);
    return db.execute('select id from cart where buyer_id=(?)',[id]);
}
static showcart(id)
{
    return db.execute('select id,image,title,price,count(product_id) as quantity from products left join products_in_cart on products.id=products_in_cart.product_id where cart_id=(?) group by products_in_cart.product_id',[id])
}
static deletecart(id)
{
    return db.execute('delete from products_in_cart where product_id=(?)',[id])
}
static search(mame)
{ 
    return db.execute(`select * from products where title like '${mame}%'`);
}
static fetchrecent()
{
    return db.execute('select * from products order by id desc ');
}
static order(buyer_id)
{
    return db.execute('insert into orders(buyer_id) values(?)',[buyer_id]);
}
static orderId()
{
    return db.execute('select * from orders order by id desc limit 1');
}
static cartInfo(buyer_id)
{
    return db.execute('select * from products_in_cart where buyer_id=(?)',[buyer_id]);
}
static productorders(product_id,seller_id,orders_id,orders_user_id)
{
    return db.execute('insert into product_has_orders(product_id,seller_id,order_id,buyer_id) values(?,?,?,?)',[product_id,seller_id,orders_id,orders_user_id]);
}
static removecart(buyer_id)
{
    return db.execute('delete from products_in_cart where buyer_id=(?)',[buyer_id]);
}
static getorders()
{
    return db.execute('select ')
}
static getorders(id)
{
    return db.execute('select order_id,title,count(product_has_orders.product_id) as quantity from products left join product_has_orders on product_has_orders.product_id=products.id where buyer_id=(?) group by product_has_orders.product_id,product_has_orders.order_id;',[id])
}
}