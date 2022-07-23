const multer = require('multer');


const upload = multer({  //file처리 관련 부분
    storage:  multer.diskStorage({ 
        destination: (req,file,cb)=>{ 
            cb(null, 'images');
        },
        filename: (req,file,cb)=>{ 
            cb(null, new Date().valueOf()+"."+file.mimetype.split('/')[1]);
        }
    }),
});

module.exports = upload;
