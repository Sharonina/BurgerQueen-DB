const { errorObject } = require("../../../utils/errors.utils");
const mongoose = require("mongoose");

const ProductModel = require("../models/product.model");

class ProductService {
  constructor() {}

  // get all products
  async getAllProducts(limit = 5, page = 1) {
    if (isNaN(limit) || isNaN(page)) {
      throw errorObject(400, "Limit y page deben ser números");
    }
    if (limit < 1 || page < 1) {
      throw errorObject(400, "Limit y page deben ser mayor a 1");
    }
    return await ProductModel.find()
      .populate("restaurant")
      .limit(limit)
      .skip(limit * (page - 1))
      .exec();
  }

  // get product by id
  async getProductById(productId) {
    const isMongoId = mongoose.Types.ObjectId.isValid(productId);
    if (!isMongoId) {
      throw errorObject(400, "Id de producto invalido");
    }
    const product = await ProductModel.findById(productId)
      .populate("restaurant")
      .exec();
    if (!product) {
      throw errorObject(404, "Producto no encontrado");
    }
    return product;
  }

  // create product
  async createProduct(productData) {
    // validate request
    const { name, price, type, image, restaurant } = productData;
    if (!(name && price && type)) {
      throw errorObject(400, "Los campos: name, price y type son requeridos");
    }

    // check if product already exist
    const oldProduct = await ProductModel.findOne({ name });
    if (oldProduct) {
      throw errorObject(
        409,
        "Producto registrado. Por favor revisa los productos en existencia"
      );
    }

    // check if restaurant id is valid
    const isMongoId = mongoose.Types.ObjectId.isValid(restaurant);
    if (!isMongoId) {
      throw errorObject(400, "Id de restaurante invalido");
    }

    // create product in db
    const product = await ProductModel.create({
      name, //lo mismo a hacer name:name
      price,
      type,
      image,
      restaurant,
      date_entry: new Date(),
    });

    //return new product
    product.save();
    return { product };
  }

  // update product by id
  async updateProductById(productId, productData) {
    const isMongoId = mongoose.Types.ObjectId.isValid(productId);
    if (!isMongoId) {
      throw errorObject(400, "Id de producto invalido");
    }
    if (productData?.password) {
      const encryptedPassword = await bcrypt.hash(
        productData.password,
        parseInt(HASH_STEPS)
      );
      productData.password = encryptedPassword;
    }
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { $set: productData }, // para que no genere dobles
      { new: true } //para que retorne el obj nuevo y no el anterior
    ).exec();

    if (!product) {
      throw errorObject(404, "producto no encontrado");
    }
    return product;
  }

  // delete product by id
  async deleteProductById(productId) {
    const isMongoId = mongoose.Types.ObjectId.isValid(productId);
    if (!isMongoId) {
      throw errorObject(400, "Id de producto invalido");
    }
    const product = await ProductModel.findByIdAndDelete(productId).exec();
    if (!product) {
      throw errorObject(404, "Producto no encontrado");
    }
    return product;
  }
}

module.exports = ProductService;
