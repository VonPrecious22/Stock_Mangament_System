const Joi = require("joi");
const Supplier = require("../model/supplier");

const createSupplier = async (req, res) => {
  try {
    const { name, supplyQuantity, supplyPrice, contact, address } = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newSupplier = await Supplier.create({
      name,
      supplyQuantity,
      supplyPrice,
      contact,
      address,
    });

    return res.status(201).json({
      message: "Supplier created successfully",
      supplier: newSupplier,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error creating supplier", details: err.message });
  }
};

const getSupplier = async (req, res) => {
  try {
    const foundSupplier = await Supplier.findById(req.params.id);
    if (!foundSupplier)
      return res.status(404).json({ error: "Supplier not found" });
    return res.status(200).json(foundSupplier);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error getting supplier", details: err.message });
  }
};

const getAllSuppliers = async (req, res) => {
  try {
    const allSuppliers = await Supplier.find();
    return res.status(200).json({
      message: "All suppliers retrieved successfully",
      suppliers: allSuppliers,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error getting all suppliers", details: err.message });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { name, supplyQuantity, supplyPrice, contact, address } = req.body;
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { name, supplyQuantity, supplyPrice, contact, address },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedSupplier)
      return res.status(404).json({ error: "Supplier not found" });

    return res.status(200).json({
      message: "Supplier updated successfully",
      supplier: updatedSupplier,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error updating supplier", details: err.message });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!deletedSupplier)
      return res.status(404).json({ error: "Supplier not found" });
    return res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error deleting supplier", details: err.message });
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
  createSupplier,
  getSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
};
