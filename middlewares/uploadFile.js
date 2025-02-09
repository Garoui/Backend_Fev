const multer = require('multer');
const path = require('path');
const fs = require('fs');

var storage= multer.diskStorage(
    {
    destination: function (req , res , cb){
    cb(null, "public/files")     
    },
    filename: function (req , re , cb){
        const uploadPath = 'public/files';
        const originalName = file.originalName;
        const fileExtension = path.extname(originalName);
        const filename = originalName

        const fileIndex = 1;
        while (fs.existsSync(path.join(uploadPath, filename))){
            const baseName = path.basename(originalName, fileExtension);
            fileName =`${baseName}_${fileIndex}${fileExtension}`;
            fileIndex++;
        }
        cb(null,fileName)
    }
   
    }
)
const uploafile = multer({storage : storage})
module.exports = uploadfile