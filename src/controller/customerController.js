const Joi = require("joi");
const Customer = require("../model/customer");


//Render the blanck form to create a new customer. 


const renderCreateForm = (req, res) => {
  res.render("customers/create", {currentPage: "customers"});
}

const createCustomer = async (req, res) => {
  try {
    const { name, quantityBought, buyingPrice } = req.body;
    const { error } = validate(req.body);
    if (error) {
      return res.render("customers/create", {
        error: error.details[0].message,
        currentPage: "customers",
      });
    }

    await Customer.create({ name, quantityBought, buyingPrice });
    return res.redirect("/customers");
  } catch (err) {
    console.error(err);
    return res.render("customers/create", {
      error: "Something went wrong. Please try again.",
      currentPage: "customers",
    });
  }
};

const getCustomer = async (req, res) => {
  try {
    const foundCustomer = await Customer.findById(req.params.id);
    if (!foundCustomer) return res.status(404).render("errors/404");

    return res.render("customers/show", {
      customer: foundCustomer,
      currentPage: "customers",
    });
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const allCustomers = await Customer.find();

    return res.render("customers/index", {
      customers: allCustomers,
      currentPage: "customers",
    });
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};
//Render the edit form populated with customer data. 

const renderEditForm = async(req, res) =>{
  try{
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).render("errors/404");

    res.render("customers/edit", {
      customer,
      currentPage: "customers"
    })
  } catch(err){
    console.error(err);
    res.status(500).render("errors/500");
  }
}


//Edit customer.
const updateCustomer = async (req, res) => {
  try {
    const { name, quantityBought, buyingPrice } = req.body;
    const { error } = validate(req.body);
    if (error) {
      const customer = await Customer.findById(req.params.id);
      return res.render("customers/edit", {
        customer,
        error: error.details[0].message,
        currentPage: "customers",
      });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, quantityBought, buyingPrice },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedCustomer) return res.status(404).render("errors/404");

    return res.redirect(`/customers/${updatedCustomer._id}`);
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).render("errors/404");

    return res.redirect("/customers");
  } catch (err) {
    console.error(err);
    return res.render("errors/500");
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
