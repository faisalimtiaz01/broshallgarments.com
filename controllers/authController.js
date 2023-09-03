import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    //validation error
    if (!name) {
      return res.send({
        message: "name is required",
      });
    }
    //email is required
    if (!email) {
      return res.send({
        message: "email is required",
      });
    }
    // password is required
    if (!password) {
      return res.send({
        message: "password is required",
      });
    }
    //phone is required
    if (!phone) {
      return res.send({
        message: "phone is required",
      });
    }
    //address is required
    if (!address) {
      return res.send({
        message: "address is required",
      });
    }
    //answer is required
    if (!answer) {
      return res.send({
        message: "answer is required",
      });
    }

    //check user

    const existingUser = await userModel.findOne({ email });
    // existing user

    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User already registered please login",
      });
    }

    // register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "User successfully registered",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error occured in registrartion request",
      error,
    });
  }
};

//post login

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).send({
        success: false,
        message: "invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(403).send({
        success: false,
        message: "email not registered",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "invalid password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error occured in login request",
      error,
    });
  }
};

//forgot password

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "newPassword is required" });
    }

    //check emial answer
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "wrong email and answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

//test testController

export const testController = (req, res) => {
  res.send("protected routes");
};
//profile update

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "password must be greater then 6 characters" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        email: email || user.email,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "something went wrong while updaing profile",
      error,
    });
  }
};

// getOrdersController
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong while getting orders",
      error,
    });
  }
};

//getAllOrdersController
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ })
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt:'-1'})
    console.log(orders);
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong while getting orders",
      error,
    });
  }
};

//orderStatusController

export const orderStatusController = async () => {
  try {
    const {orderId} = req.params;
    const {status} = req.body;
    const  orders = await orderModel.findByIdAndUpdate(orderId, {status},{new: true})
    res.json(orders);

  } catch (error) {
    console.log(error);
  res.status(500).send({
    success: false,
    message: "Something went wrong while updating orders-status",
    error
  })
  }
}
