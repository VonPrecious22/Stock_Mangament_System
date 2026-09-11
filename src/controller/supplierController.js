const Joi = require("joi");
const Supplier = require("../model/supplier");

// Create form
const renderCreateForm = (req, res) => {
  return res.render("suppliers/create", {
    currentPage: "suppliers",
  });
};

// Create supplier
const createSupplier = async (req, res) => {
  try {
    const userId = req.session.userId;

    const { name, contact, address } = req.body;

    const { error } = validate(req.body);

    if (error) {
      return res.status(400).render("suppliers/create", {
        error: error.details[0].message,
        currentPage: "suppliers",
      });
    }

    await Supplier.create({
      name,
      contact,
      address,
      user: userId,
    });

    return res.redirect("/suppliers");
  } catch (err) {
    console.error(err);

    return res.status(500).render("suppliers/create", {
      error: "Something went wrong. Please try again.",
      currentPage: "suppliers",
    });
  }
};

// Get all suppliers
const getAllSuppliers = async (req, res) => {
  try {
    const userId = req.session.userId;

    const suppliers = await Supplier.find({
      user: userId,
    }).sort({ createdAt: -1 });

    return res.render("suppliers/index", {
      suppliers,
      currentPage: "suppliers",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};

// Get supplier
const getSupplier = async (req, res) => {
  try {
    const userId = req.session.userId;

    const supplier = await Supplier.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!supplier) {
      return res.status(404).render("errors/404");
    }

    return res.render("suppliers/show", {
      supplier,
      currentPage: "suppliers",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};

// Edit form
const renderEditForm = async (req, res) => {
  try {
    const userId = req.session.userId;

    const supplier = await Supplier.findOne({
      _id: req.params.id,
      user: userId,
    }).lean();

    if (!supplier) {
      return res.status(404).render("errors/404");
    }

    return res.render("suppliers/edit", {
      supplier,
      currentPage: "suppliers",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};

// Update
const updateSupplier = async (req, res) => {
  try {
    const userId = req.session.userId;

    const { name, contact, address } = req.body;

    const { error } = validate(req.body);

    if (error) {
      const supplier = await Supplier.findOne({
        _id: req.params.id,
        user: userId,
      });

      return res.render("suppliers/edit", {
        supplier,
        error: error.details[0].message,
        currentPage: "suppliers",
      });
    }

    const updatedSupplier = await Supplier.findOneAndUpdate(
      {
        _id: req.params.id,
        user: userId,
      },
      {
        name,
        contact,
        address,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedSupplier) {
      return res.status(404).render("errors/404");
    }

    return res.redirect(`/suppliers/${updatedSupplier._id}`);
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};

// Delete
const deleteSupplier = async (req, res) => {
  try {
    const userId = req.session.userId;

    const deletedSupplier = await Supplier.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!deletedSupplier) {
      return res.status(404).render("errors/404");
    }

    return res.redirect("/suppliers");
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};

function validate(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(40).required(),
    supplyQuantity: Joi.number(),
    supplyPrice: Joi.number(),
    contact: Joi.string(),
    address: Joi.string(),
  });
  return schema.validate(data);
}

module.exports = {
  renderCreateForm,
  renderEditForm,
  createSupplier,
  getSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
};
