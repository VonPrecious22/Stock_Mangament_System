const Joi = require("joi");
const Supplier = require("../model/supplier");

const renderCreateForm = (req, res) => {
  return res.render("suppliers/create", {
    error: null,
    currentPage: "suppliers",
  });
};

const createSupplier = async (req, res) => {
  try {
    const { name, supplyQuantity, supplyPrice, contact, address } = req.body;
    const { error } = validate(req.body);
    if (error) {
      return res.render("suppliers/create", {
        error: error.details[0].message,
        currentPage: "suppliers",
      });
    }

    await Supplier.create({
      name,
      supplyQuantity,
      supplyPrice,
      contact,
      address,
    });
    return res.redirect("/suppliers");
  } catch (err) {
    console.error(err);
    return res.render("suppliers/create", {
      error: "Something went wrong. Please try again.",
      currentPage: "suppliers",
    });
  }
};

const getSupplier = async (req, res) => {
  try {
    const foundSupplier = await Supplier.findById(req.params.id);
    if (!foundSupplier) return res.status(404).render("errors/404");

    return res.render("suppliers/show", {
      supplier: foundSupplier,
      currentPage: "suppliers",
    });
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    const allSuppliers = await Supplier.find();

    return res.render("suppliers/index", {
      suppliers: allSuppliers,
      currentPage: "suppliers",
    });
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

const renderEditForm = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).lean();
    if (!supplier) return res.status(404).render("errors/404");

    return res.render("suppliers/edit", {
      supplier,
      error: null,
      currentPage: "suppliers",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { name, supplyQuantity, supplyPrice, contact, address } = req.body;
    const { error } = validate(req.body);
    if (error) {
      const supplier = await Supplier.findById(req.params.id);
      return res.render("suppliers/edit", {
        supplier,
        error: error.details[0].message,
        currentPage: "suppliers",
      });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { name, supplyQuantity, supplyPrice, contact, address },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedSupplier) return res.status(404).render("errors/404");

    return res.redirect(`/suppliers/${updatedSupplier._id}`);
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier) return res.status(404).render("errors/404");

    return res.redirect("/suppliers");
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
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
