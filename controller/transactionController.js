const Joi = require("joi");
const Transaction = require("../model/transaction");

const createTransaction = async (req, res) => {
  try {
    const { amount, quantityBought, type, notes, customerId, managerId } =
      req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newTransaction = await Transaction.create({
      amount,
      quantityBought,
      type,
      notes,
      customer: customerId,
      manager: managerId,
    });

    const populatedTransaction = await newTransaction.populate([
      "customer",
      "manager",
    ]);

    return res.status(201).json({
      message: "Transaction created successfully",
      transaction: populatedTransaction,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error creating transaction", details: err.message });
  }
};

const getTransaction = async (req, res) => {
  try {
    const foundTransaction = await Transaction.findById(req.params.id).populate(
      ["customer", "manager"],
    );
    if (!foundTransaction)
      return res.status(404).json({ error: "Transaction not found" });
    return res.status(200).json(foundTransaction);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error getting transaction", details: err.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const allTransactions = await Transaction.find().populate([
      "customer",
      "manager",
    ]);
    return res.status(200).json({
      message: "All transactions retrieved successfully",
      transactions: allTransactions,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error getting all transactions", details: err.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const { amount, quantityBought, type, notes } = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { amount, quantityBought, type, notes },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedTransaction)
      return res.status(404).json({ error: "Transaction not found" });

    return res.status(200).json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error updating transaction", details: err.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedTransaction)
      return res.status(404).json({ error: "Transaction not found" });
    return res
      .status(200)
      .json({ message: "Transaction deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error deleting transaction", details: err.message });
  }
};

function validate(data) {
  const schema = Joi.object({
    amount: Joi.number().required(),
    quantityBought: Joi.number(),
    type: Joi.string(),
    notes: Joi.string().min(2).max(200),
    customerId: Joi.string(),
    managerId: Joi.string(),
  });
  return schema.validate(data);
}

module.exports = {
  createTransaction,
  getTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
};
