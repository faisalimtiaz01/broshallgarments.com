import JWt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

//protetcetd routes

export const requireSignIn = (req, res, next) => {

   try {
    const decode = JWt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
        );
    req.user = decode;
    next()
   } catch (error) {
    console.log(error)
   }


}


//admin acess

export const isAdmin = async  (req, res,next) => {

try {
    const user = await userModel.findById(req.user._id)
    if(user.role !==1){
        return res.status(401).send({
            succes: false,
            message:"unAthorized Access"
        })
    }else{
        next();
    }

    
} catch (error) {
    console.log(error);
    res.status(404).send({
        succes: false,
        error,
        message:"erro in admin middle ware"
    })
 
}

}