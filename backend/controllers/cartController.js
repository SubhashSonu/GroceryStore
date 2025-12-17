import { CartItem } from "../models/cartModel.js";
import createError from "http-errors";

// ✅ Get all cart items for user
export const getCart = async (req, res, next) => {
  try {
    const items = await CartItem.find({ user: req.user._id }).populate({
      path: "product",
      model: "Product",
    });

    const formatted = items.map((ci) => ({
      _id: ci._id.toString(),
      product: ci.product,
      quantity: ci.quantity,
    }));

    // console.log("📦 Cart fetched for user:", req.user._id, formatted.length);
    res.json(formatted);
  } catch (error) {
    next(error);
  }
};

// ✅ Add to cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, itemId, quantity } = req.body;
    const pid = productId || itemId;
    const qty = Number(quantity) || 1;

    // console.log("🛒 AddToCart =>", { pid, qty, user: req.user._id });

    if (!pid) {
      throw createError(400, "Product identifier required");
    }

    let cartItem = await CartItem.findOne({ user: req.user._id, product: pid });

    if (cartItem) {
      cartItem.quantity = Math.max(0, cartItem.quantity + qty);
      if (cartItem.quantity < 1) {
        await cartItem.deleteOne();
        return res.status(200).json({
          message: "Item removed",
          _id: cartItem._id.toString(),
        });
      }
      await cartItem.save();
      await cartItem.populate("product");
      return res.status(200).json({
        _id: cartItem._id.toString(),
        product: cartItem.product,
        quantity: cartItem.quantity,
      });
    }

    cartItem = await CartItem.create({
      user: req.user._id,
      product: pid,
      quantity: qty,
    });

    await cartItem.populate("product");
    return res.status(201).json({
      _id: cartItem._id.toString(),
      product: cartItem.product,
      quantity: cartItem.quantity,
    });
  } catch (error) {
    console.error("❌ Error in addToCart:", error);
    next(error);
  }
};

// ✅ Update quantity
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!cartItem) throw createError(404, "Cart item not found");

    cartItem.quantity = Math.max(1, Number(quantity));
    await cartItem.save();
    await cartItem.populate("product");

    return res.json({
      _id: cartItem._id.toString(),
      product: cartItem.product,
      quantity: cartItem.quantity,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete item
export const deleteCartItem = async (req, res, next) => {
  try {
    const cartItem = await CartItem.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!cartItem) throw createError(404, "Cart item not found");

    await cartItem.deleteOne();
    return res.json({ message: "Item deleted", _id: req.params.id });
  } catch (error) {
    next(error);
  }
};

// ✅ Clear cart
export const clearCart = async (req, res, next) => {
  try {
    await CartItem.deleteMany({ user: req.user._id });
    res.json({ message: "Cart Cleared" });
  } catch (error) {
    next(error);
  }
};
