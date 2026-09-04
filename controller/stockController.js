const mongoose = require("mongoose");
const Joi = require("joi");
const stock = require("../model/stock");
const Product = require("../model/product");
//Create a new stock
const createStock = async (req, res) => {
  try {
    const { name,  description, valuationMethod, ProductId} = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const newStock = await stock.create({
      name,
      description,
      valuationMethod,
      Product: ProductId,
    })
   const populatedStock = await newStock.populate("Product");

    return res.status(201).json({
      message: "Stock created successfully",
      stock: populatedStock,
      // stock: {
      //   id: newStock._id,
      //   name: newStock.name,
      //   stockQuantity: newStock.stockQuantity,
      //   description: newStock.description,
      //   valuationMethod: newStock.valuationMethod,
      // },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error creating a new stock", err.message);
  }
};

//Get stocks
const getStock = async (req, res) => {
  try {
    const stock = await stock.findById(req.params.id).populate("Product");
    return res.send(stock);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error getting the stock", err.message);
  }
};

//Get all Stocks
const getAllStocks = async (req, res) => {
  try{
    const allStocks = await stock.find().populate("Product");
    if(!allStocks) return res.status(404).json({error: "No stocks found"});
    return res.status(200).json({
      message: "All stocks retrieved successfully",
      stocks: allStocks.map((stock) => ({
        id: stock._id,
        name: stock.name,
        description: stock.description,
        valuationMethod: stock.valuationMethod,
        product: stock.Product,
      }))
    })
  }catch(err) {
    console.error(err);
    return res.status(500).send("Error getting all stocks", err.message);
  }
}


//Update stock
const updateStock = async (req, res) =>{
  try{
   const {name,  description, valuationMethod} = req.body;
   const {error} = validate(req.body);
   if(error) return res.status(400).send(error.details[0].message);
   const updatedStock = await stock.findByIdAndUpdate(
     req.params.id,
     {
       name,
      
       description,
       valuationMethod,
     },
     { returnDocument: "after", runValidators: true },
   );
if (!updatedStock) return res.status(404).json({ error: "Stock not found" });

   return res.status(200).json({
    message: "Stock updated successfully",
    stock:{
      id: updatedStock._id,
      name: updatedStock.name,
      description: updatedStock.description,
      valuationMethod: updatedStock.valuationMethod,
    }
   });
  }catch(err) {
      console.error(err);
      return res.status(500).send("Error updating the stock", err.message);
  }
}

//Delete stock

const deleteStock = async (req, res) =>{
  try{
    const deletedStock = await stock.findByIdAndDelete(req.params.id);
  if(!deletedStock) return res.status(404).json({error: "Stock not found"});
  return res.status(200).json({message: "Stock deleted successfully"});
  } catch(err){
    console.error(err);
    return res.status(500).send("Error Occurred while deleting the stock", err.message);
  }
}
 

function validate(data) {
  const schema = Joi.object({
    ProductId: Joi.string().required(),
    name: Joi.string().min(2).max(40).required(),
    description: Joi.string().min(2).max(200),
    valuationMethod: Joi.string().valid("FIFO", "LIFO").required(),
  });
  return schema.validate(data);
}

module.exports = {createStock, getStock, getAllStocks, updateStock, deleteStock};
