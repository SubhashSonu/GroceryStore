import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  addToCart,
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "../controllers/cartController.js";

const cartRouter = express.Router();
cartRouter.use(authMiddleware);

cartRouter.get("/", getCart);
cartRouter.post("/", addToCart);
cartRouter.post("/clear", clearCart); 
cartRouter.put("/:id", updateCartItem);
cartRouter.delete("/:id", deleteCartItem);

export default cartRouter;
