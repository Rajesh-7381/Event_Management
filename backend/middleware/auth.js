const jwt=require("jsonwebtoken")

const auth = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
    //   console.log(token);
      const verify = jwt.verify(token, process.env.JWTSECRET);
    //   console.log(verify);

      if (verify) {
        next(); 
      } else {
        return res.status(401).json({ message: "invalid token" });
      }
    } catch (error) {
      return res.status(401).json({ message: "invalid token" });
    }
  };
  
module.exports=auth  