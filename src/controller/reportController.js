const Transaction = require("../model/transaction");
const Product = require("../model/product");

const getFinancialSummary = async (req, res) => {
  try {
    const userId = req.session.userId;

    const transactions = await Transaction.find({
      user: userId,
    });


    let totalRevenue = 0;
    let totalCost = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "sale") {
        totalRevenue += transaction.amount;
      }

      if (transaction.type === "restock") {
        totalCost += transaction.amount;
      }
    });

    const profit = totalRevenue - totalCost;

    const products = await Product.find({
      user: userId,
    });

    let inventoryValue = 0;

    products.forEach((product) => {
      inventoryValue += product.quantity * product.sellingPrice;
    });

    return res.render("reports/summary", {
      totalRevenue,
      totalCost,
      profit,
      inventoryValue,
      currentPage: "reports",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).render("errors/500");
  }
};

module.exports = {
  getFinancialSummary,
};
