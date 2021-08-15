const router = require('express').Router();
const File = require('../models/file')
const path = require('path')
const dir=path.join(__dirname,'..','..')
const uploads = `${dir}`;

router.get('/:uuid',async(req,res)=>{
    try{
        const file =await File.findOne({uuid:req.params.uuid})
        if(!file){
            return res.render('404',{err :'Download link expired'});
        }
        console.log(uploads)
        const filePath=`${uploads}/${file.path}`
        console.log(filePath)
         res.download(filePath);
       
    }
    catch(err){
        return res.render('404',{err :'Download link expired'});
    }
})


module.exports=router;
