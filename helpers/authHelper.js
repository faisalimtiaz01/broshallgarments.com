import bcrypt from "bcrypt";



//password hashed here 

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.log(err);
  }
};


//know compare hash and simple   password here 


export const comparePassword = async (password,hashedPassword) => {

    return bcrypt.compare(password,hashedPassword);
}
