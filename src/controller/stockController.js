const mongoose = require("mongoose");
const Joi = require("joi");
const Stock = require("../model/stock");
const Product = require("../model/product");
const Transaction = require("../model/transaction");
const Supplier = require("../model/supplier");
const Customer = require("../model/customer");

const renderCreateForm = async (req, res) => {
  try {
    const userId = req.session.userId;

    const [products, suppliers] = await Promise.all([
      Product.find({ user: userId }).lean(),
      Supplier.find({ user: userId }).lean(),
    ]);

    return res.render("stocks/create", {
      products,
      suppliers,
      currentPage: "stocks",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};

// Create a new stock (restock) — increases Product quantity
const createStock = async (req, res) => {
  const useTransaction = process.env.USE_MONGO_TRANSACTIONS === "true";

  const session = useTransaction ? await mongoose.startSession() : null;

  try {
    const userId = req.session.userId;

    const {
      productName,
      supplierName,
      quantity,
      costPerUnit,
      valuationMethod,
      sellingPrice,
      notes,
    } = req.body;

    const { error } = validateCreate(req.body);

    if (error) {
      const [products, suppliers] = await Promise.all([
        Product.find({ user: userId }).lean(),
        Supplier.find({ user: userId }).lean(),
      ]);

      return res.status(400).render("stocks/create", {
        error: error.details[0].message,
        products,
        suppliers,
        currentPage: "stocks",
      });
    }

    if (session) {
      session.startTransaction();
    }

    const quantityNumber = Number(quantity);
    const costNumber = Number(costPerUnit);
    const sellingPriceNumber = Number(sellingPrice);
    const totalAmount = quantityNumber * costNumber;

    const options = session ? { session } : undefined;

    const createdProducts = await Product.create(
      [
        {
          name: productName.trim(),
          quantity: quantityNumber,
          sellingPrice: sellingPriceNumber,
          user: userId,
        },
      ],
     
    );

    const product = createdProducts[0];

    const createdSuppliers = await Supplier.create(
      [
        {
          name: supplierName.trim(),
          user: userId,
        },
      ],
     
    );

    const supplier = createdSuppliers[0];

    await Stock.create(
      [
        {
          name: "Restock",
          description: notes,
          product: product._id,
          supplier: supplier._id,
          quantity: quantityNumber,
          costPerUnit: costNumber,
          valuationMethod,
          user: userId,
        },
      ],
      options,
    );

    await Transaction.create(
      [
        {
          type: "restock",
          amount: totalAmount,
          quantityBought: quantityNumber,
          product: product._id,
          supplier: supplier._id,
          notes,
          user: userId,
        },
      ],
      options,
    );

    if (session) {
      await session.commitTransaction();
    }

    return res.redirect("/stocks");
  } catch (err) {
    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Create stock error:", err);

    const userId = req.session.userId;

    const [products, suppliers] = await Promise.all([
      Product.find({ user: userId }).lean(),
      Supplier.find({ user: userId }).lean(),
    ]);

    return res.status(500).render("stocks/create", {
      error: "Something went wrong. Please try again.",
      products,
      suppliers,
      currentPage: "stocks",
    });
  } finally {
    if (session) {
      await session.endSession();
    }
  }
};

// Sell a product to a customer
const sellProduct = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const userId = req.session.userId;
    const { productId } = req.params;
    const { customerId, quantitySold, salePrice, notes } = req.body;

    // Validate input before touching the database
    const { error } = validateSale(req.body);

    if (error) {
      const product = await Product.findOne({
        _id: productId,
        user: userId,
      });

      return res.status(400).render("products/show", {
        product,
        error: error.details[0].message,
        currentPage: "products",
      });
    }

    const product = await Product.findOne({
      _id: productId,
      user: userId,
    });

    if (!product) return res.status(404).render("errors/404");

    const customer = await Customer.findOne({
      _id: customerId,
      user: userId,
    });

    if (!customer) return res.status(404).render("errors/404");

    if (product.quantity < Number(quantitySold)) {
      return res.status(400).render("products/show", {
        product,
        error: `Only ${product.quantity} units in stock — cannot sell ${quantitySold}.`,
        currentPage: "products",
      });
    }

    const qty = Number(quantitySold);
    const price = Number(salePrice);

    session.startTransaction();

    await Product.findOneAndUpdate(
      {
        _id: productId,
        user: userId,
      },
      {
        $inc: {
          quantity: -qty,
        },
      },
      {
        session,
        runValidators: true,
      },
    );

    await Transaction.create(
      [
        {
          type: "sale",
          amount: qty * price,
          quantityBought: qty,
          product: productId,
          customer: customerId,
          notes,
          user: userId,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return res.redirect("/transactions");
  } catch (err) {
    await session.abortTransaction();

    console.error(err);

    return res.status(500).render("errors/500");
  } finally {
    session.endSession();
  }
};

// Get single stock
const getStock = async (req, res) => {
  try {
    const userId = req.session.userId;

    const foundStock = await Stock.findOne({
      _id: req.params.id,
      user: userId,
    })
      .populate("product")
      .populate("supplier");

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
    const userId = req.session.userId;

    const allStocks = await Stock.find({
      user: userId,
    })
      .populate("product")
      .populate("supplier");

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
    const userId = req.session.userId;

    const foundStock = await Stock.findOne({
      _id: req.params.id,
      user: userId,
    }).lean();

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
    const userId = req.session.userId;
    const { name, description, valuationMethod } = req.body;

    const { error } = validateUpdate(req.body);

    if (error) {
      const existingStock = await Stock.findOne({
        _id: req.params.id,
        user: userId,
      });

      return res.render("stocks/edit", {
        stock: existingStock,
        error: error.details[0].message,
        currentPage: "stocks",
      });
    }

    const updatedStock = await Stock.findOneAndUpdate(
      {
        _id: req.params.id,
        user: userId,
      },

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
    const userId = req.session.userId;

    const deletedStock = await Stock.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!deletedStock) return res.status(404).render("errors/404");

    return res.redirect("/stocks");
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

// Validates a new stocks

function validateCreate(data) {
  const schema = Joi.object({
    productName: Joi.string().required(),
    supplierName: Joi.string().required(),
    quantity: Joi.number().positive().required(),
    costPerUnit: Joi.number().min(0).required(),
    sellingPrice: Joi.number().min(0).required(),
    valuationMethod: Joi.string().valid("FIFO", "LIFO").required(),
    notes: Joi.string().max(200).allow(""),
  });
  return schema.validate(data);
}
// Validates a sale submission
function validateSale(data) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    quantitySold: Joi.number().positive().required(),
    salePrice: Joi.number().positive().required(),
    notes: Joi.string().max(200).allow(""),
  });

  return schema.validate(data);
}

// Validates an edit to an existing stock batch
function validateUpdate(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(40).required(),
    description: Joi.string().max(200).allow(""),
    valuationMethod: Joi.string().valid("FIFO", "LIFO").required(),
  });

  return schema.validate(data);
}

module.exports = {
  renderEditForm,
  renderCreateForm,
  createStock,
  sellProduct,
  getStock,
  getAllStocks,
  updateStock,
  deleteStock,
};
