import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";



// create category model

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "category already exists",
      });
    }
    const category = await new categoryModel({
      name,
      slug:slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "new Category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "error creating category",
    });
  }
};

// update category model
export const updateCategoryController = async (req, res) => {
    try {
        const {name} = req.body;
        const {id}=req.params;

        const category = await categoryModel.findByIdAndUpdate(id,{name, slug:slugify(name) },{new:true})
res.status(200).send({
    success:true,
    message:"category updated successfully",
    category
})        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error updating category"
        })
    }
};
//get All category controllers
export const categoryController = async (req,res)=>{
    try {
        
        const category = await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"category list",
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "error getting all category controllers"
        })
    }
}

//get single category

export const singleCategoryController = async (req,res) =>{

    try {

    
        const category = await categoryModel.findOne({slug:req.params.slug});
        res.status(200).send({
            success:true,
            message:"get single category succefully",
            category
        })
        
    } catch (error) {
     console.log(error);
     res.status(500).send({
        success: false,
        error,
        message: "error getting single category"
     })   
    }
}
//deleteCategoryController
export const deleteCategoryController = async (req,res)=> {

try {
    const {id}=req.params
    await categoryModel.findByIdAndDelete(id)

    res.status(200).send({
        success:true,
        message:"delete category successfully",
        
    })


} catch (error) {
    console.log(error);
res.status(500).send({
    success: false,
    message: "error in delleting category controller",
    error
})
}

}