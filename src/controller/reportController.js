const Transaction = require("../model/transaction");
const Product = require("../model/product");

const getFinancialSummary = async (req, res) => {
  try {
    const result = await Transaction.find();

    let totalRevenue = 0;
    let totalCost = 0;

    result.forEach((transaction) => {
      if (transaction.type === "sale") {
        totalRevenue += transaction.amount;
      }
      if (transaction.type === "restock") {
        totalCost += transaction.amount;
      }
    });

    const profit = totalRevenue - totalCost;

    const products = await Product.find();
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
    return res.render("errors/500");
  }
};

module.exports = { getFinancialSummary };
