const { cloudinary } = require('../../utils/cloudinary');
const { Router } = require('express');
const router = Router();

// Config dotev
require('dotenv').config({
  path: '../config/config.env'
})

router.post('/', async (req, res) => {
   
    
        const fileStr = req.body.data;
      
        if (fileStr){

       await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'react_images',
        },function (err, result) {
            if (err) {
               console.log(err.message);
               return res.redirect('/');
            }
            const file=result.json()
            console.log(file)
            // add cloudinary url for the image to the novel object under image property
            res.send(file)
            
        });   
};
});

module.exports = router;
