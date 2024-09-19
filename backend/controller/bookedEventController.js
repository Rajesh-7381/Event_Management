const bookmodel=require("../model/bookedEventModel")

exports.bookEvent=async(req,res)=>{
    const {choosenevent,ticketType,eventDate,quantity,ticket_price,final_price,user_id}=req.body;
    const newbookingEvent={choosenevent,ticketType,eventDate,quantity,ticket_price,final_price,user_id}
    try {
        const data=await bookmodel.bookEvent(newbookingEvent)
        // console.log(data)
        res.status(200).json({ message: "Event booked successfully!" });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to book the event", error });

    }
}

exports.checkQuantity=async(req,res)=>{
    const { event_ticket_id } = req.query;

    try {
        const [data]=await bookmodel.checkQuantity(event_ticket_id)
        return res.json(data)
    } catch (error) {
        console.log(error)
    }
}

exports.ActiveEvents=async(req,res)=>{
    try {
        const data=await bookmodel.ActiveEvents();
        // console.log(data)
        res.json({activeEvents:data})
    } catch (error) {
        
    }
}

exports.userbookedOrderStatus = async (req, res) => {
    const email = req.params.email;
    try {
        const data = await bookmodel.userbookedOrderStatus(email);
        // console.log(data);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' }); 
    }
};


exports.feedback = async (req, res) => {
    const { event_name, feedback, user_id } = req.body;
    const data = { event_name, feedback, user_id }; 

    try {
        await bookmodel.feedback(data);
        // console.log('Feedback submitted successfully');
        res.status(200).json({ message: 'Feedback submitted successfully!' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ error: 'Failed to submit feedback.' });
    }
}


exports.fetchfeedback = async (req, res) => {
    try {
        const data = await bookmodel.fetchfeedback();
        // console.log( data);
        res.status(200).json(data); 
    } catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
}
