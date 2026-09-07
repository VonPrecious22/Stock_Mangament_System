const mongoose = require("mongoose");
const Joi = require("joi");
const stock = require("../model/stock");
const Product = require("../model/product");


const renderCreateForm = async (req, res) => {
  try {
    const products = await Product.find().lean();
    return res.render("stocks/create", {
      products,
      currentPage: "stocks",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};
// Create a new stock
const createStock = async (req, res) => {
  try {
    const {
      name,
      description,
      valuationMethod,
      ProductId,
      productName,
      category,
      sellingPrice,
      quantity,
    } = req.body;

    const { error } = validateCreate(req.body);
    if (error) {
      const products = await Product.find();
      return res.render("stocks/create", {
        error: error.details[0].message,
        products,
        currentPage: "stocks",
      });
    }

    let finalProductId = ProductId;

    if (!finalProductId) {
      const newProduct = await Product.create({
        name: productName,
        category,
        sellingPrice,
        quantity,
      });
      finalProductId = newProduct._id;
    }

    const newStock = await stock.create({
      name,
      description,
      valuationMethod,
      Product: finalProductId,
    });

    return res.redirect(`/stocks/${newStock._id}`);
  } catch (err) {
    console.error(err);
    const products = await Product.find();
    return res.render("stocks/create", {
      error: "Something went wrong. Please try again.",
      products,
      currentPage: "stocks",
    });
  }
};

// Get single stock
const getStock = async (req, res) => {
  try {
    const foundStock = await stock.findById(req.params.id).populate("Product");
    if (!foundStock) return res.status(404).render("errors/404");

    return res.render("stocks/show", {
      stock: foundStock,
      currentPage: "stocks",
    });
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

// Get all stocks
const getAllStocks = async (req, res) => {
  try {
    const allStocks = await stock.find().populate("Product");

    return res.render("stocks/index", {
      stocks: allStocks,
      currentPage: "stocks",
    });
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};


const renderEditForm = async (req, res) => {
  try {
    const foundStock = await stock.findById(req.params.id).lean();
    if (!foundStock) return res.status(404).render("errors/404");

    return res.render("stocks/edit", {
      stock: foundStock,
      currentPage: "stocks",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};

// Update stock
const updateStock = async (req, res) => {
  try {
    const { name, description, valuationMethod } = req.body;
    const { error } = validateUpdate(req.body);
    if (error) {
      const existingStock = await stock.findById(req.params.id);
      return res.render("stocks/edit", {
        stock: existingStock,
        error: error.details[0].message,
        currentPage: "stocks",
      });
    }

    const updatedStock = await stock.findByIdAndUpdate(
      req.params.id,
      { name, description, valuationMethod },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedStock) return res.status(404).render("errors/404");

    return res.redirect(`/stocks/${updatedStock._id}`);
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

// Delete stock
const deleteStock = async (req, res) => {
  try {
    const deletedStock = await stock.findByIdAndDelete(req.params.id);
    if (!deletedStock) return res.status(404).render("errors/404");

    return res.redirect("/stocks");
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

function validateCreate(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(40).required(),
    description: Joi.string().min(2).max(200).allow(""),
    valuationMethod: Joi.string().valid("FIFO", "LIFO").required(),
    ProductId: Joi.string().allow(""),
    productName: Joi.string().min(2).max(40).allow(""),
    category: Joi.string().valid("A", "B", "C").allow(""),
    sellingPrice: Joi.number().allow(""),
    quantity: Joi.number().allow(""),
  }).or("ProductId", "productName"); // must provide one or the other
  return schema.validate(data);
}

function validateUpdate(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(40).required(),
    description: Joi.string().min(2).max(200).allow(""),
    valuationMethod: Joi.string().valid("FIFO", "LIFO").required(),
  });
  return schema.validate(data);
}

module.exports = {
  renderEditForm,
  renderCreateForm,
  createStock,
  getStock,
  getAllStocks,
  updateStock,
  deleteStock,
};
