const mongoose = require("mongoose");
const Transaction = require("../model/transaction");

const getAllTransactions = async (req, res) => {
  try {
    const userId = req.session.userId;

    const transactions = await Transaction.find({
      user: userId,
    })
      .populate("product")
      .populate("customer")
      .populate("supplier")
      .sort({ date: -1 });

    return res.render("transactions/index", {
      transactions,
      currentPage: "transactions",
    });
  } catch (err) {
    console.error("Get transactions error:", err);
    return res.status(500).render("errors/500");
  }
};

const getTransaction = async (req, res) => {
  try {
    const userId = req.session.userId;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).render("errors/404");
    }

    const transaction = await Transaction.findOne({
      _id: id,
      user: userId,
    })
      .populate("product")
      .populate("customer")
      .populate("supplier");

    if (!transaction) {
      return res.status(404).render("errors/404");
    }

    return res.render("transactions/show", {
      transaction,
      currentPage: "transactions",
    });
  } catch (err) {
    console.error("Get transaction error:", err);
    return res.status(500).render("errors/500");
  }
};

module.exports = {
  getAllTransactions,
  getTransaction,
};
