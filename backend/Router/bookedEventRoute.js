const expres=require("express")
const router=expres.Router();
const bookeEventController=require("../controller/bookedEventController")

router.post("/BookEvent",bookeEventController.bookEvent)
router.get("/checkQuantity",bookeEventController.checkQuantity)
router.get("/ActiveEvents",bookeEventController.ActiveEvents)
router.get("/userbookedOrderStatus/:email", bookeEventController.userbookedOrderStatus);
router.post("/feedback", bookeEventController.feedback);
router.get("/fetchfeedback", bookeEventController.fetchfeedback);

module.exports=router