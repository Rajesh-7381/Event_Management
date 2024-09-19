const express=require("express")
const router=express.Router();
const usercontroller=require("../controller/userController")
const upload=require("../utils/multerConfig")

router.post("/register",upload.single("profile"),usercontroller.Register)
router.post("/emailCheck/:email",usercontroller.emailCheck)
router.post("/login",usercontroller.Login) 
 
module.exports=router