const express=require("express")
const app=express()
const morgan=require("morgan")
const db=require("./connection")
const otpGenerator = require('otp-generator')
require('dotenv').config();
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
const port=5000
app.listen(port,()=>{
    console.log("server started")
})
db.connect((err,_res)=>{

    if(!err){

        console.log("db connected")

    }else{

        console.log(err)

    }

})

app.post("/login",(req,res)=>{
    const otp=otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    const login=req.body
    let insert=`insert into otp(email,otp)
    values('${login.email}','${otp}')`
    db.query(insert,(err,result)=>{
        if(!err){
            console.log("success")
        }
        else{
            console.log("data insertion failed",err)
            res.status(400)
        }
    })
})

app.post("/loginverify",(req,res)=>{
    const verify=req.body
    let readotp=`select * from otp where email='${verify.email}' and otp='${verify.otp}'`
    db.query(readotp,async(err,result)=>{
        if(!err){
            let read=await(db.query(readotp))
            res.send().status(200)
            if(read.rowCount==0){
                console.log("invalid otp")
            }else
            {
                console.log("otp verified")
            }
        }else{
            console.log("otp verification failed",err)
            res.send().status(400)
        }
    })
 })