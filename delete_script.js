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

// async function del(){
//     const file = new File({
//         //data to be stored
//         original_name: 'req.file.originalname',
//         filename: 'req.file.filename',
//         path: 'req.file.path',
//         size: 10,
//         uuid: '5'


//     });
//     //send response->download link
//     const response = await file.save();
//     console.log('hi')
// }
// deleteData()
// .then(process.exit)
// .catch()

module.exports=deleteData;
// module.exports=del;