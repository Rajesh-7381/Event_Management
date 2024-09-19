const eventmodel=require("../model/eventModel")

exports.getALL = async (req, res) => {
    try {
        const data = await eventmodel.getALL();
        // console.log(data)
        return res.status(200).json({ success: true,     message: "Events fetched successfully",     data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false,  message: "Internal server error",  error: error  });
    }
};

exports.edit=async(req,res)=>{
    const id=req.params.id
    // console.log(id)
    try {
        const data=await eventmodel.edit(id)
        // console.log(data)
        return res.json(data)
    } catch (error) {
        console.error(error)
    }
}

exports.upComing=async(req,res)=>{
    // console.log(1)
    try {
        const data=await eventmodel.upComing();
        // console.log(data)
        return res.json(data)
    } catch (error) {
        
    }
}
exports.lastFive=async(req,res)=>{
    // console.log(1)
    try {
        const data=await eventmodel.lastFive();
        return res.json(data)
    } catch (error) {
        console.error(error)
    }
}
exports.DeleteEvent=async(req,res)=>{
    // console.log(1)
    const id=req.params.id
    try {
        const data=await eventmodel.DeleteEvent(id);
        return res.json(data)
    } catch (error) {
        console.error(error)
    }
}