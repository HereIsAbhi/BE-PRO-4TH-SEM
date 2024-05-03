const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors=require("../middleware/catchAsyncErrors");
const User=require("../models/userModel");
const sendToken=require("../utils/jwtToken");
// const sendEmail = require("../utils/sendEmail.js");

//register user

exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
    const{name,email,password}=req.body;
    const user= await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:"this is a sample id",
            url:"profilepicUrl",
        }
    });

    sendToken(user,201,res);
});

    //login user
    exports.loginUser=catchAsyncErrors(async(req,res,next)=>{
        const {email,password}=req.body;

        //check if user has given pwd and email both
        if(!email||!password){
            return next(new ErrorHandler("please enter email & pwd",400));

        }
        const user= await User.findOne({email}).select("+password");
        if(!user){
            return next(new ErrorHandler("Invalid email or pwd",401));
        }
        const isPasswordMatched=user.comparePassword();

        if(!isPasswordMatched){
            return next(new ErrorHandler("Invalid email or pwd",401));
        }
        sendToken(user,200,res);

});

//logout User

exports.logout= catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,

    });

    res.status(200).json({
        success:true,
        message:"Logged Out",

    });
});

// forgot pwd 
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHander("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorHander(error.message, 500));
    }
  });