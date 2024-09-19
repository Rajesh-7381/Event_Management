const model=require("../model/userModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

exports.Register=async(req,res)=>{
    const {name,email,password}=req.body;
    const profileImage = req.file;
    if (!name || !email || !password || !profileImage) {
        return res.status(400).json({ message: "All fields are required!" });
    }
    const salt=await bcrypt.genSalt(parseInt(process.env.SALTROUNDS));
    const hashedpassword=await bcrypt.hash(password,salt)
    const newUser={name,email,hashedpassword,profileImage: profileImage.path}
    // console.log(newUser)
    try {
        const data=await model.Register(newUser)
        res.status(200).json({message:"user created successfully! "})
    } catch (error) {
        throw error
    }
}

exports.Login = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password ) {
        return res.status(400).json({ message: "Email and password are required", success: false });
    }

    try {
        const data = await model.Login({email});
        const match = await bcrypt.compare(password, data.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid email or password", success: false });
        }
        const token = jwt.sign(
            { email: data.email, role: data.role, id: data.id },
            process.env.JWTSECRET,
            { expiresIn: "1h" }
        )
        
        return res.status(200).json({ message: "Login successful", success: true, email: data.email, role: data.role, id: data.id,status:1, token });

    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
};

exports.emailCheck=async(req,res)=>{
  
        // console.log(1)
        try {
          const email = req.params.email;
          // console.log(email)
          const result=await model.findByEmail(email);
          const emailExists=result.length > 0;
          // console.log(emailExists)
          res.json({ emailExists })
        } catch (error) {
            console.error("Error checking email:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
      
}