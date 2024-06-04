export const sendMessage = async(req, res)=>{
    try {
        return res.status(200).json({ success: true, msg: "chat success" });

        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
          status: false,
          msg: Msg.err
        });

        
    }
}