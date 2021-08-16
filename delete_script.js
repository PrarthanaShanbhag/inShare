const File = require('./models/file');
const fs=require('fs')
const path=require('path')


const connectDB = require('./config/db');
connectDB()



async function deleteData() {
    
    //File befor 24 hours to be deleted
    const pastDate=new Date(Date.now()-(24*60*60*1000))

    const files = await File.find({ createdAt: { $lt: pastDate} })

    if(files.length){
        for(const file of files){
            try{
            fs.unlinkSync(`./${file.path}`)
            await file.remove()
            console.log(`successfully removed ${file.filename}`)
            }
            catch(err){
                console.log(`Error while deleting ${file.filename}- ${err}`)
            }
        }


    }

}



module.exports=deleteData;
