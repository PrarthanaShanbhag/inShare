require('dotenv').config()
const mongoose=require('mongoose')
const url=process.env.MONGO_CONNECTION_URL
// console.log(url)

function  connectDB(){
    mongoose.connect(url,
        {
            useNewUrlParser:true,
            useCreateIndex:true,
            useFindAndModify:true,
            useUnifiedTopology:true
        })

  .then(()=>{console.log('connection successfull')})
  .catch((err)=>{console.log('no connection'+err)
})
   
    
}

module.exports=connectDB;