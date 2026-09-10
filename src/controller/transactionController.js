const Joi = require("joi");
const Transaction = require("../model/transaction");
const Customer = require("../model/customer");
const Supplier = require("../model/supplier");

const renderCreateForm = async (req, res) => {
  try {
    const customers = await Customer.find().lean();
    return res.render("transactions/create", {
      customers,
      currentPage: "transactions",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};

const createTransaction = async (req, res) => {
  try {
    const { 
      amount, 
      quantityBought, 
      type, 
      notes,
     customerId,
      supplierId
     } = req.body;
    const { error } = validate(req.body);

    if (error) {
     const [customers, suppliers] = await Promise.all([
           Customer.find().lean(),
           Supplier.find().lean()
     ])
      return res.render("transactions/create", {
        error: error.details[0].message,
        customers,
        suppliers,
        currentPage: "transactions",
      });
    }

    await Transaction.create({
      amount,
      quantityBought,
      type,
      notes,
      customer: customerId,
      supplier: supplierId,
    });

    return res.redirect("/transactions");
  } catch (err) {
    console.error(err);
    const customers = await Customer.find();
    return res.render("transactions/create", {
      error: "Something went wrong. Please try again.",
      customers,
      supplier,
      currentPage: "transactions",
    });
  }
};

const getTransaction = async (req, res) => {
  try {
    const foundTransaction = await Transaction.findById(req.params.id).populate(
      ["customer",
        "supplier"
      ],
    );
    if (!foundTransaction) return res.status(404).render("errors/404");

    return res.render("transactions/show", {
      transaction: foundTransaction,
      currentPage: "transactions",
    });
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const allTransactions = await Transaction.find().populate(["customer","supplier"
    ]).sort({date: -1});

    return res.render("transactions/index", {
      transactions: allTransactions,
      currentPage: "transactions",
    });
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

const renderEditForm = async (req, res) => {
  try {
    const foundTransaction = await Transaction.findById(req.params.id).lean();
    if (!foundTransaction) return res.status(404).render("errors/404");

    const [customers, supplier] = await Promise.all([
      Customer.find().lean(),
      Supplier.find().lean()
    ])
    return res.render("transactions/edit", {
      transaction: foundTransaction,
      customers,
      suppliers,
      currentPage: "transactions",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};
const updateTransaction = async (req, res) => {
  try {
    const { amount, quantityBought, type, notes, customerId, supplierId } = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { amount, quantityBought, type, notes, customer: customerId, supplier: supplierId },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedTransaction) return res.status(404).render("errors/404");

    return res.redirect(`/transactions/${updatedTransaction._id}`);
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedTransaction) return res.status(404).render("errors/404");

    return res.redirect("/transactions");
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

function validate(data) {
  const schema = Joi.object({
    supplierId: Joi.string().allow("").optional(),
    amount: Joi.number().required(),
    quantityBought: Joi.number(),
    notes: Joi.string().min(2).max(200),
    customerId: Joi.string(),
    type: Joi.string().valid("sale", "restock").required(),
  });
  return schema.validate(data);
}

module.exports = {
  renderCreateForm,
  createTransaction,
  getTransaction,
  getAllTransactions,
  renderEditForm,
  updateTransaction,
  deleteTransaction,
};
