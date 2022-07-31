//Middleware to check user is authorized 

require('dotenv').config();
const JWT = require('jsonwebtoken');

module.exports = async (req,res,next) => {

    const token = req.header('x-auth-token')

    if(!token){
        return res.status(400).json({
            "errors":[{
                "msg" : "No token found"
            }]
        })
    }

    try{
       let user =  JWT.verify(token,process.env.JWT_KEY);
        next();
    }catch(err){
        return res.status(400).json({
            "errors":[{
                "msg" : "Token invalid"
            }]
        })
    }

}