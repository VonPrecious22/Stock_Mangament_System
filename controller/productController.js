const Joi = require("joi");
const stock = require("../model/stock");
const Product = require("../model/product");

const createProduct = async (req, res) => {
  try {
    const { name, quantity, sellingPrice, category } = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const createdProduct = await Product.create({
      name,
      quantity,
      sellingPrice,
      category,
    });
    return res.status(201).json({
      message: "Product created succesfully.",
      Product: {
        id: createdProduct._id,
        name: createdProduct.name,
        quantity: createdProduct.quantity,
        category: createdProduct.category,
        sellingPrice: createdProduct.sellingPrice,
      },
    });
  } catch (err) {
    console.error(err);
  return res
    .status(500)
    .json({ error: "Error creating a product",details: err.message });
  }
};

//get all product.

const getAllProduct = async (req, res) => {
  try {
    const allProduct = await Product.find();
    if (!allProduct) return res.status(500).send("products not found");
    return res.status(200).json({
      message: "All products retrieved succesfully",
      Product: allProduct.map((product) => ({
        productId: product._id,
        name: product.name,
        price: product.sellingPrice,
        quantity: product.quantity,
        category: product.category,
        sellingPrice: product.sellingPrice,
      })),
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send("Error occured when finding product", err.message);
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, category, sellingPrice, quantity } = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        category, 
        sellingPrice, 
        quantity },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedProduct)
      return res.status(404).json({ error: "Product not found" });

    return res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error updating product", details: err.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ error: "Product not found" });
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error deleting product", details: err.message });
  }
};

function validate(data) {
  const schema = Joi.object({
    quantity: Joi.number().required(),
    sellingPrice: Joi.number().required(),
    category: Joi.string().valid("A", "B", "C"),
    name: Joi.string().min(2).max(40).required(),
    description: Joi.string().min(2).max(200),
    valuationMethod: Joi.string().valid("FIFO", "LIFO").required(),
  });
  return schema.validate(data);
}


module.exports = {createProduct, getAllProduct, updateProduct, deleteProduct};
