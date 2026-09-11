const Joi = require("joi");
const Customer = require("../model/customer");

// Create form
const renderCreateForm = (req, res) => {
  return res.render("customers/create", {
    currentPage: "customers",
  });
};

// Create customer
const createCustomer = async (req, res) => {
  try {
    const userId = req.session.userId;

    const { name, contact, address } = req.body;

    const { error } = validate(req.body);

    if (error) {
      return res.status(400).render("customers/create", {
        error: error.details[0].message,
        currentPage: "customers",
      });
    }

    await Customer.create({
      name,
      contact,
      address,
      user: userId,
    });

    return res.redirect("/customers");
  } catch (err) {
    console.error(err);

    return res.status(500).render("customers/create", {
      error: "Something went wrong. Please try again.",
      currentPage: "customers",
    });
  }
};

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const userId = req.session.userId;

    const customers = await Customer.find({
      user: userId,
    }).sort({ createdAt: -1 });

    return res.render("customers/index", {
      customers,
      currentPage: "customers",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};

// Get customer
const getCustomer = async (req, res) => {
  try {
    const userId = req.session.userId;

    const customer = await Customer.findOne({
      _id: req.params.id,
      user: userId,
    });

    if (!customer) {
      return res.status(404).render("errors/404");
    }

    return res.render("customers/show", {
      customer,
      currentPage: "customers",
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

    const customer = await Customer.findOne({
      _id: req.params.id,
      user: userId,
    }).lean();

    if (!customer) {
      return res.status(404).render("errors/404");
    }

    return res.render("customers/edit", {
      customer,
      currentPage: "customers",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};

// Update
const updateCustomer = async (req, res) => {
  try {
    const userId = req.session.userId;

    const { name, contact, address } = req.body;

    const { error } = validate(req.body);

    if (error) {
      const customer = await Customer.findOne({
        _id: req.params.id,
        user: userId,
      });

      return res.render("customers/edit", {
        customer,
        error: error.details[0].message,
        currentPage: "customers",
      });
    }

    const updatedCustomer = await Customer.findOneAndUpdate(
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

    if (!updatedCustomer) {
      return res.status(404).render("errors/404");
    }

    return res.redirect(`/customers/${updatedCustomer._id}`);
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};

// Delete
const deleteCustomer = async (req, res) => {
  try {
    const userId = req.session.userId;

    const deletedCustomer = await Customer.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!deletedCustomer) {
      return res.status(404).render("errors/404");
    }

    return res.redirect("/customers");
  } catch (err) {
    console.error(err);
    return res.status(500).render("errors/500");
  }
};

function validate(data) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(40).required(),
    quantityBought: Joi.number(),
    buyingPrice: Joi.number(),
  });
  return schema.validate(data);
}

module.exports = {
  renderCreateForm,
  renderEditForm,
  createCustomer,
  getCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
};
