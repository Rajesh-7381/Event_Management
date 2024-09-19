
const mysql=require("mysql2")
require('dotenv').config()

const db=mysql.createConnection({
    host:process.env.LOCALHOST,
    user:process.env.ROOT,
    password:process.env.PASSWORD,
    port:process.env.PORT,
    database:process.env.DATABASE
})

db.connect((err,connect)=>{
    if(err){
        console.log(err)
    }else{
        console.log("connect to the database")
    }
})
module.exports=db;