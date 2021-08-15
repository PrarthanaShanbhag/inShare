
const express=require('express');
const path=require('path');
const fs=require('fs');
const cors=require('cors');
const schedule=require('node-schedule')
const connectDB = require('./config/db');
const deleteData=require('./delete_script')
const app= express();
const port= process.env.PORT||3300;


connectDB()

const corsOption={
    origin:process.env.ALLOWED_CLIENTS.split(',')

}


//middlewares
app.use(cors(corsOption))
app.use(express.static('./public'));
app.use(express.json())
//template engine

app.set('views',path.join(__dirname,'/views'))
app.set('view engine','ejs')



// Routes

app.use('/api/files',require('./router/files'));
app.use('/files',require('./router/show'));
app.use('/files/download',require('./router/download'));


const testFolder = `${__dirname}/uploads`;
fs.readdirSync(testFolder).forEach(file => {
  console.log(file);
});

schedule.scheduleJob('*/60 * * * * *', () => {
//schedule.scheduleJob('0 0 * * *', () => {    
        
deleteData()
})

app.listen(port,()=>{
    console.log(`listening to port no ${port}`)
})