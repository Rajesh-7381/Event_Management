const express=require("express")
const db=require("./config/db")
require('dotenv').config()
const cors=require("cors")
const bodyparser=require("body-parser")
const session = require('express-session');
const passport=require("passport")
const googleAuthStrategy=require("passport-google-oauth20").Strategy
// const FacebookStrategy = require('passport-facebook').Strategy;
const path=require("path")
const jwt=require("jsonwebtoken")

const fs = require('fs'); // Required to delete files


const app=express()
app.use(cors())
app.use(express.json())
app.use(bodyparser.json())
app.use(session({secret: process.env.JWTSECRET, resave: false, saveUninitialized: false, cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }})); //maxage 24 hours
app.use(passport.initialize())
app.use(passport.session())
// app.use(routerCheckAuth)

const userRoutes=require("./Router/userRoute")
const eventRoutes=require("./Router/eventRoute")
const bookeventRoutes=require("./Router/bookedEventRoute")
const upload = require("./utils/multerConfig")
app.use("/api",userRoutes )
app.use("/api",eventRoutes )
app.use("/api",bookeventRoutes )

app.use('/profile', express.static(path.join(__dirname, 'uploads/profile')));
app.use('/eventImage', express.static(path.join(__dirname, 'uploads/eventImage')));


app.patch("/update/:id", upload.single('eventImage'), (req, res) => {
    const id = req.params.id;
    const { title, description, eventDate, eventTime, location, privacy, general_ticket_price, vip_ticket_price, quantity, organizer_id } = req.body;

    const eventImage = req.file;
    const fetchImageQuery = "SELECT event_image FROM Events2 WHERE id = ?";
    
    db.query(fetchImageQuery, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Error fetching current image." });
        }
        const oldImagePath = result[0]?.event_image; 
        let query = "UPDATE Events2 SET title = ?, description = ?, eventDate = ?, eventTime = ?, location = ?, privacy = ?, organizer_id = ?";
        let params = [title, description, eventDate, eventTime, location, privacy, organizer_id];
        
        if (eventImage) { query += ", event_image = ?"; 
             params.push(eventImage.path);
        }
        
        query += " WHERE id = ?";
        params.push(id);

        db.query(query, params, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: "Error updating event." });
            } else {
               
                if (eventImage && oldImagePath) {
                    const fullPath = path.join(__dirname, oldImagePath);
                    fs.unlink(fullPath, (err) => {
                        if (err) {
                            console.error("Error deleting old image:", err);
                        } else {
                            // console.log("Old image deleted successfully:", fullPath);
                        }
                    });
                }

                const event_id = id;
                const EventTicketsQuery = "UPDATE EventTickets2 SET general_ticket_price = ?, vip_ticket_price = ?, quantity = ? WHERE event_id = ?";
                const EventTicketsParams = [general_ticket_price, vip_ticket_price, quantity, event_id];

                db.query(EventTicketsQuery, EventTicketsParams, (err, data) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: "Error updating event tickets." });
                    } else {
                        return res.json({ message: "Event updated successfully." });
                    }
                });
            }
        });
    });
});



app.post("/addeditEvent",upload.single('eventImage'),(req,res)=>{
    const {title,description,eventDate,eventTime,location,privacy,general_ticket_price,vip_ticket_price,ticket_price,quantity,organizer_id}=req.body
    const eventImage=req.file;
    // console.log(req.body)
    const query='insert into Events2 (title,description,eventDate,eventTime,location,privacy,organizer_id,event_image) values(?,?,?,?,?,?,?,?)';
    db.query(query,[title,description,eventDate,eventTime,location,privacy,organizer_id,eventImage.path],(err,data)=>{
        if(err){
            console.log(err)
        }
        const event_id=data.insertId;
        const EventTicketsQuery="insert into EventTickets2 (event_id,general_ticket_price,vip_ticket_price,quantity) values(?,?,?,?)";
        db.query(EventTicketsQuery,[event_id,general_ticket_price,vip_ticket_price,quantity],(err,data)=>{
            if(err){
                console.log(err)
            }
        }) 
        return res.json({message:"event created"})
    })
}) 


app.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { email: user.email, role: user.role, id: user.id },
      process.env.JWTSECRET,
      { expiresIn: "1h" } 
    )
  
    if (user.role === 1) {
        res.redirect(`http://localhost:3000/dashboard2?token=${token}&role=${user.role}`);
      } else {
        res.redirect(`http://localhost:3000/dashboard2?token=${token}&role=${user.role}`);
      }
  })

passport.use(new googleAuthStrategy({
    clientID:process.env.CLIENTID,
    clientSecret:process.env.CLIENTSECRET,
    callbackURL:process.env.CALLBACKURL,
    scope:["profile","email"]

},(acessToken,RefreshToken,profile,done)=>{
    try {
        const email=profile.emails[0].value;
        const getquery="select * from Users2 where email=?";
        const insQuery="insert into Users2 (social_login_provider,   social_login_id,name,email,password) values(?,?,?,?,?)"
        db.query(getquery,[email],(err,data)=>{
            if(err){
                console.log(err)
                return done(err,null)
            }
            if(data.length > 0){
                return done(null,data[0])
            }else{
                const user={social_login_provider:'google',social_login_id:profile.id,name:profile.displayName,email:email,password:null}
                db.query(insQuery,[user.social_login_provider,user.social_login_id,user.name,user.email,user.password],(err,results)=>{
                    if(err){
                        console.log(err)
                        return done(err,null)
                    }
                    user.id=results.insertId;
                    return done(null,user)
                })
            }
           
        })
    } catch (error) {
            console.log("error in passport",error)
            return done(error,null)
    }
}
))

passport.serializeUser((user,done)=>{
    return done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    const query="select * from Users2 where id=?";
    db.query(query,[id],(err,data)=>{
        if(err){
            console.log(err);
            return done(err,null)
        }
        return done(null,data[0])
    })
})

app.get("/userDetails",(req,res)=>{
    const query="SELECT  tb.id,u.name AS username,e.title, e.title AS event_name, t.ticket_type AS ticket_type,tb.status, tb.purchase_date, tb.quantity, t.general_ticket_price AS ticket_price, tb.total_price FROM      ticketBooks2 tb JOIN      Users2 u ON tb.user_id = u.id JOIN      EventTickets2 t ON tb.event_ticket_id = t.event_id JOIN Events2 e ON t.event_id = e.id;"
    try {
        db.query(query,(err,data)=>{
            if(err){
                console.error(err)
            }
            return res.status(200).json(data)
        })
    } catch (error) {
        
    }
})

app.patch("/updateStatus/:id",(req,res)=>{
    // console.log(1)  
    const id=req.params.id;
    const {status}=req.body;
    
    // console.log(status)
    const query="update ticketBooks2 set status=? where id=?";
    db.query(query,[status,id],(err,data)=>{
        if(err){
            console.log(err)
        }
        res.status(200).json(data)
    })
    
})


app.get("/details/:email",(req,res)=>{
    const email=req.params.email
    const query="select * from Users2 where email=?";
    db.query(query,[email],(err,data)=>{
        if(err){
            console.log(err)
        }
        // console.log(data[0])
        const user=data[0]
        res.json({name:user.name,email:user.email,profileimage:user.image})
    })
})

app.listen(process.env.SERVER_PORT,()=>{
    console.log(`server listened at port ${process.env.SERVER_PORT}`)
})