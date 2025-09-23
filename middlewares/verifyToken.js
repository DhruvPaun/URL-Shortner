const jwt=require("jsonwebtoken")
function verifyToken(req,res,next)
{
    const token=req.cookies.token;

    if(typeof token ===" ")
    {
        try {
            const decode=jwt.verify(token,process.env.SECRET_KEY)
            return decode;
        } catch (error) {
            
        }
    }
}