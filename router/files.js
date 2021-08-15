const router = require('express').Router();
const multer = require('multer')
const path = require('path')
const fs=require('fs');
const File = require('../models/file')
const { v4: uuid4 } = require('uuid');

const dir=path.join(__dirname,'..')
const testFolder = `${dir}/uploads`;
fs.readdirSync(testFolder).forEach(file => {
  console.log(file);
});
// console.log(__dirname)
let storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, `${dir}/uploads/`) },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }

})

let upload = multer({
    storage,
    limits: { fileSize: 100 * 1000000 }
}).single('myfile')//single file


router.post('/', (req, res) => {

    //store file using multer

    upload(req, res, async (err) => {
        //validate request
        if (!req.file) {
            return (res.json({ error: 'All fields are required' }))
        }
        if (err) {
            res.status(500).send({ error: err.message })
        }
        //store into db

        const file = new File({
            //data to be stored
            original_name: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            uuid: uuid4()


        });
        //send response->download link
        const response = await file.save();
        return res.json({ file: `${process.env.APP_BASED_URL}/files/${response.uuid}` })

    })
})

router.post('/send', async (req, res) => {
    
    const { uuid, emailfrom, emailto } = req.body;


    //validate request
    if (!uuid || !emailfrom || !emailto) {
        return res.status(422).send({ error: 'All fields are required' })
    }
    const file = await File.findOne({ uuid });


    if (file.sender) {
        return res.status(422).send({ error: 'Email already sent' })
    }

    file.sender = emailfrom;
    file.reciever = emailto;
    const response = await file.save();
    //filesize
    var filesize;
    if (file.size > 1024 && file.size < (1024 * 1024)) {
        file.size = file.size / (1024)
        filesize = `${file.size.toFixed(2)} KB`
    }
    else
        if (file.size >= (1024 * 1024)) {
            file.size = file.size / (1024 * 1024)
            filesize = `${file.size.toFixed(2)} MB`
        }
        else {
            filesize = `${file.size.toFixed(2)} B`
        }




    //send email
    const sendMail = require('../services/emailServices')
    sendMail({
        from:file.sender,
        to:file.reciever,
        subject:'inShare file  sharing ',
        text:`${emailfrom} has shared a file with you`,
        html:require('../services/emailTemplate')({
            emailFrom:emailfrom, 
            downloadLink: `${process.env.APP_BASED_URL}/files/${file.uuid}`, 
            size:filesize, 
             expires:`24 hours`
        })
    
    })
    return res.send({success:true})
})

module.exports = router;