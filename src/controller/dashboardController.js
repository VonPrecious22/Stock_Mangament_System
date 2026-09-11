const Product = require("../model/product");
const Stock = require("../model/stock");

const getDashboard = async (req, res) => {
  try {
    const userId = req.session.userId;
    const totalProducts = await Product.countDocuments({
      user: userId,
    });

    const totalStocks = await Stock.countDocuments({
      user: userId,
    });

       const lowStockCount = await Product.countDocuments({
      user: userId,
      quantity: { $lte: 5 },
    });

    const recentStocks = await Stock.find({
      user: userId,
    })
      .populate("product")
      .populate("supplier")
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return res.render("dashboard", {
      totalProducts,
      totalStocks,
      lowStockCount,
      recentStocks,
      currentPage: "dashboard",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).render("errors/500");
  }
};

module.exports = {
  getDashboard,
};
