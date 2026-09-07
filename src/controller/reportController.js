const Transaction = require("../model/transaction");
const Product = require("../model/product");

const getFinancialSummary = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    let totalRevenue = 0;
    let totalCost = 0;

    result.forEach((r) => {
      if (r._id === "sale") totalRevenue = r.total;
      if (r._id === "restock") totalCost = r.total;
    });

    const profit = totalRevenue - totalCost;

    const products = await Product.find();
    const inventoryValue = products.reduce(
      (sum, p) => sum + p.quantity * p.sellingPrice,
      0,
    );

    return res.status(200).json({
      totalRevenue,
      totalCost,
      profit,
      inventoryValue,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        error: "Error calculating financial summary",
        details: err.message,
      });
  }
};

module.exports = { getFinancialSummary };
