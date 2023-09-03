import  express  from "express";
import {forgotPasswordController, getOrdersController, loginController, registerController,testController, updateProfileController,getAllOrdersController,orderStatusController} from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";


//router object

const router = express.Router();

//routing

//register |||Method post
router.post("/register",registerController);
//login||post
router.post("/login",loginController);

//forget password
router.post('/forgot-password',forgotPasswordController);

//test route
router.get("/test",requireSignIn,isAdmin,testController);
//protected user route auth
router.get('/user-auth',requireSignIn,(req,res)=>{
    res.status(200).send({ok:true});
});
//admin protected route auth
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true});
});
//update profile 

router.put('/profile',requireSignIn,updateProfileController);

//orders
router.get('/orders',requireSignIn,getOrdersController)
// All orders
router.get('/all-orders',requireSignIn,isAdmin,getAllOrdersController)
// order status
router.put('/orders-status/:orderId',requireSignIn,isAdmin,orderStatusController)

export default router