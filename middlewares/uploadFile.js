const multer = require('multer');
const path = require('path');
const fs = require('fs');

var storage= multer.diskStorage(
    {
    destination: function (req, file, cb){
    cb(null, "public/files")     
    },
    filename: function (req, file, cb){
        const uploadPath = 'public/files';
        const originalName = file.originalname;
        const fileExtension = path.extname(originalName);
        const fileName = originalName;

        var fileIndex = 1;
        while (fs.existsSync(path.join(uploadPath, fileName))){
            const baseName = path.basename(originalName, fileExtension);
            fileName =`${baseName}_${fileIndex}${fileExtension}`;
            fileIndex++;
        }
        cb(null,fileName);
    }
   
    })
const uploadfile = multer({storage : storage});
module.exports = uploadfile;