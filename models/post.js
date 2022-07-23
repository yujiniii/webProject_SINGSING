class PostDBModel {
    constructor(title, code, state, price, detail, phone_number, img_path, password,id){
        this.title = title,
        this.code = code,
        this.state = state,
        this.price = price,
        this.detail = detail,
        this.phone_number = phone_number,
        this.img_path = img_path
        this.password  = crypto.createHash('sha512').update(password).digest('base64') //password 암호화
    }
    fetchAll(){

    }
    fetch(){
        
    }
    async save(){
        const newPost = {
            title : this.title,
            code : this.code,
            state : this.state,
            price : this.price,
            detail : this.detail,
            phone_number:this.phone_number,
            image : this.img_path ,
            password : this.password,
            sale:0,
            date:new Date(),
        };
        await db.getDb().collection('posts').insertOne(newPost); 
    }
    delete(){

    }
}