import express from "express";
import { query } from "express-validator";

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
        .post(createProduct);
    
router
    .route("/:id")
        .get(query('productId').notEmpty().escape(),getSingleProduct)
        .patch(updateProduct)
        .delete(deleteProduct);

router
    .route("/:phrase").get(searchProduct);
export default router;