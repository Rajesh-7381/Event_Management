const express=require("express")
const router=express.Router()
const routerCheckAuth=require("../middleware/auth")
const eventcontroller=require("../controller/eventController")

router.get("/allEventData",routerCheckAuth,eventcontroller.getALL)
router.get("/edit/:id",routerCheckAuth,eventcontroller.edit)
// router.patch("/update/:id",routerCheckAuth,eventcontroller.update)
router.get("/upcomingEvent/",routerCheckAuth,eventcontroller.upComing)
router.get("/lastFiveEvent/",routerCheckAuth,eventcontroller.lastFive)
router.delete("/deleteEvent/:id",routerCheckAuth,eventcontroller.DeleteEvent)

module.exports=router