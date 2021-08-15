const router = require('express').Router();
const File = require('../models/file')
router.get('/:uuid', async (req, res) => {

    try {
        const file = await File.findOne({ uuid: req.params.uuid })
        var filesize;
        if (res.status===500|| res.status===400) {
            return res.render('404', { err: 'Download link expired' });
        }
        else {
            if(!file)
            {
                return res.render('404', { err: 'Download link expired' });
            }



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

            return res.render('download', {
                uuid: file.uuid,
                fileName: file.original_name,
                fileSize: filesize,
                downloadLink: `${process.env.APP_BASED_URL}/files/download/${file.uuid}`


            });
        }
    }
    catch (err) {
        res.render('404', { err: 'Something went wrong' });
    }
})

module.exports = router;





