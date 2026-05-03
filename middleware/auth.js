const jwt=require("jsonwebtoken")

const verifyToken=async(req,res,next)=>{
    let token=req.headers["authorization"]

    if (token && token.startsWith("Bearer ")) {
        token = token.split(" ")[1]
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("Token verification error:", err.message)
                return res.status(401).json({ message: "Invalid or expired token" })
            }
            else {
                console.log("User verified:", decoded)
                req.user = decoded
                next()
            }
        })
    }
    else {
        return res.status(401).json({ message: "Authorization token required (Bearer token)" })
    }
}
module.exports=verifyToken