const Joi = require("joi");
const stock = require("../model/stock");
const Product = require("../model/product");

//form. 

const renderCreateForm = (req, res) =>{
  res.render("products/create", {currentPage: "products"});
}

const createProduct = async (req, res) => {
  try {
    const { name, quantity, sellingPrice, category } = req.body;
    const { error } = validate(req.body);
    if (error) {
      return res.render("products/create", {
        error: error.details[0].message,
        currentPage: "products",
      });
    }

    await Product.create({ name, quantity, sellingPrice, category });
    return res.redirect("/products");
  } catch (err) {
    console.error(err);
    return res.render("products/create", {
      error: "Something went wrong. Please try again.",
      currentPage: "products",
    });
  }
};

//get all product.

const getAllProduct = async (req, res) => {
  try {
    const allProduct = await Product.find();

    return res.render("products/index", {
      products: allProduct,
      currentPage: "products",
    });
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

// Update product
const renderEditForm = async(req, res) =>{
  try{
   const product = await Product.findById(req.params.id).lean();
   if(!product) return res.status(404).render("errors/404");

   return res.render("product/edit",{
    product,
    currentPage: "products"
   })
  }catch(err){
console.error(err);
return res.status(500).render("errors/500");
  }
}


const updateProduct = async (req, res) => {
  try {
    const { name, category, sellingPrice, quantity } = req.body;
    const { error } = validate(req.body);
    if (error) {
      const product = await Product.findById(req.params.id);
      return res.render("products/edit", {
        product,
        error: error.details[0].message,
        currentPage: "products",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, sellingPrice, quantity },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedProduct) return res.status(404).render("errors/404");

    return res.redirect(`/products/${updatedProduct._id}`);
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).render("errors/404");

    return res.redirect("/products");
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

const getProduct = async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.id);
    if (!foundProduct) return res.status(404).render("errors/404");

    return res.render("products/show", {
      product: foundProduct,
      currentPage: "products",
    });
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

module.exports = {
  renderCreateForm,
  renderEditForm,
  createProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
};

function validate(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(40).required(),
    category: Joi.string().valid("A", "B", "C").allow(""),
    sellingPrice: Joi.number().required(),
    quantity: Joi.number().required(),
  });
  return schema.validate(data);
}
