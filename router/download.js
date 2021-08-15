const router = require('express').Router();
const File = require('../models/file')


router.get('/:uuid',async(req,res)=>{
    try{
        const file =await File.findOne({uuid:req.params.uuid})
        if(!file){
            return res.render('404',{err :'Download link expired'});
        }
        console.log(__dirname)
        const filePath=`${__dirname}/${file.path}`
        console.log(filePath)
        res.download(filePath);
    }
    catch(err){
        return res.render('404',{err :'Download link expired'});
    }
})


module.exports=router;
