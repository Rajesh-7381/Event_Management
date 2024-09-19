const multer=require("multer")
const path = require("path");
const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file.fieldname === 'profile'){
            cb(null,"uploads/profile")
        }else if(file.fieldname === 'eventImage'){
            cb(null,"uploads/eventImage")
        }
    },
    filename:(req,file,cb)=>{
        if(!allowedTypes.includes(file.mimetype)){
            cb(new Error("Invalid File type!"));
        }
        const ext=path.extname(file.originalname);
        cb(null,`image-${Date.now()}${ext}`)
    }
})


const upload=multer({
    storage:storage,
    fileFilter(req,file,cb){
        if (file.size > 5 * 1024 * 1024) {
            return cb(new Error("File size exceeds 5MB"));
          }
        cb(null, true);
    }   
})

module.exports=upload