const db=require('../database/database');
module.exports=class Seller{
    constructor(title,summary,price,image,description,seller_id)
    {
        this.title=title;
        this.summary=summary;
        this.price=price;
        this.image=image;
        this.description=description;
        this.seller_id=seller_id;
    }
    save()  
    {
       return db.execute('insert into products(title,summary,price,image,description,seller_id) values(?,?,?,?,?,?)',[this.title,this.summary,this.price,this.image,this.description,this.seller_id]);
    }

    static fetchsome(id)
        {
        return db.execute('select * from products where seller_id=(?) ',[id]);
    }
    static fetchall()
    {
        return db.execute('select * from products');
    }
    static delete(id)
    {
    return db.execute('delete from products where id=(?)',[id])
    } 
    static fetchone(id)
    {
        return db.execute(`select * from products where id =(?)`,[id])
    }
     update(id)
    {
        return db.execute('update products set title=(?),summary=(?),price=(?),image=(?),description=(?) where id=(?)',[this.title,this.summary,this.price,this.image,this.description,id])
    }
    static fetchrecent(id)
    {
        return db.execute('select * from products where seller_id=(?) order by id desc',[id]);
    }
    static search(mame)
{   let m='m%';
    return db.execute(`select * from products where title like '${mame}%'`);
}
    static savesearch(name)
    {
        return db.execute('insert into search(title) values(?)',[name]);
    }
    static release()
    {
        return db.execute('select * from search');
    }
    static delete()
    {
        return db.execute('delete from search');
    }

}