const Joi = require("joi");
const Customer = require("../model/customer");

const createCustomer = async (req, res) => {
  try {
    const { name, quantityBought, buyingPrice } = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newCustomer = await Customer.create({
      name,
      quantityBought,
      buyingPrice,
    });

    return res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error creating customer", details: err.message });
  }
};

const getCustomer = async (req, res) => {
  try {
    const foundCustomer = await Customer.findById(req.params.id);
    if (!foundCustomer)
      return res.status(404).json({ error: "Customer not found" });
    return res.status(200).json(foundCustomer);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error getting customer", details: err.message });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const allCustomers = await Customer.find();
    return res.status(200).json({
      message: "All customers retrieved successfully",
      customers: allCustomers,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error getting all customers", details: err.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { name, quantityBought, buyingPrice } = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, quantityBought, buyingPrice },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedCustomer)
      return res.status(404).json({ error: "Customer not found" });

    return res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error updating customer", details: err.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer)
      return res.status(404).json({ error: "Customer not found" });
    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error deleting customer", details: err.message });
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
  createCustomer,
  getCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
};
