import express from 'express'
import multer from 'multer'
import { createProduct, deleteProduct, getProducts } from '../controllers/productController.js';

const itemRouter = express.Router();

// Multer Setup
const storage = multer.diskStorage({
    destination: (_req,_file, cb) => cb(null,'uploads/'),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})

const upload = multer({storage})

// Routes
itemRouter.get('/',getProducts)
itemRouter.post('/',upload.single('image'),createProduct)
itemRouter.delete('/:id', deleteProduct)



export default itemRouter