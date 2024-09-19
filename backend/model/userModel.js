const db=require("../config/db")


const user={
    Register:async(newUser)=>{
        const {name,email,hashedpassword,profileImage }=newUser
            // console.log(newUser)
        const query="INSERT INTO Users2 (name,email,password,image) values(?,?,?,?)"
        try {
            const [result]=await db.promise().query(query,[name,email,hashedpassword,profileImage ])
            // console.log("inserted")
            return result;
        } catch (error) {
            throw error
        }

    },
    Login: async (registerUser) => {
        const { email } = registerUser;
        const query = "SELECT * FROM Users2 WHERE email = ?";

        return new Promise((resolve, reject) => {
            db.query(query, [email], (err, data) => {
                if (err) {
                    return reject({ message: "Internal server error", success: false });
                }
                if (data.length === 0) {
                    return reject({ message: "Invalid email or password", success: false });
                }
                resolve(data[0]); 
            });
        });
    },
    findByEmail:async(email)=>{
        try {
            const query = "SELECT * FROM Users2 WHERE email=?";
            const [result]=await db.promise().query(query, [email]);
            return result;
          } catch (error) {
              console.error(error)
          }
    }
}

module.exports=user