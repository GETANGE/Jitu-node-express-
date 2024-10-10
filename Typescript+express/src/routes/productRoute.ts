import express from "express";
import { body } from "express-validator";

import { 
    createProduct, 
    getAllProducts, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct,
    searchProduct
} from "./../controllers/productsController"

const router = express.Router();

router
    .route('/')
        .get(getAllProducts)
        .post(
            [
                body('company').isLength({ min: 5 }).withMessage('Company must be at least 5 characters long'),
                body('date').isLength({ min: 5 }).withMessage('Date must be at least 5 characters long'),
                body('imageUrl').isLength({ min: 5 }).withMessage('Image URL must be at least 5 characters long'),
                body('location').isLength({ min: 5 }).withMessage('Location must be at least 5 characters long'),
                body('price').isLength({ min: 5 }).withMessage('Price must be at least 5 characters long'),
                body('title').isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
            ],
    createProduct
);
    
router
    .route("/:id")
        .get(getSingleProduct)
        .patch(
            [
                body('company').isLength({ min: 5 }).withMessage('Company must be at least 5 characters long'),
                body('date').isLength({ min: 5 }).withMessage('Date must be at least 5 characters long'),
                body('imageUrl').isLength({ min: 5 }).withMessage('Image URL must be at least 5 characters long'),
                body('location').isLength({ min: 5 }).withMessage('Location must be at least 5 characters long'),
                body('price').isLength({ min: 5 }).withMessage('Price must be at least 5 characters long'),
                body('title').isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),
            ],
            updateProduct)
        .delete(deleteProduct);

router
    .route("/:phrase").get(searchProduct);
export default router;