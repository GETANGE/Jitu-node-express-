import express from "express";
import { body } from "express-validator";

import { 
    createProduct, 
    getAllProducts, 
    getSingleProduct, 
    updateProduct, 
    deleteProduct,
    searchProduct,
    getProductsByPrice
} from "./../controllers/productsController"
import { productValidator } from "../validators/validators";

const router = express.Router();

router
    .route('/')
        .get(getAllProducts)
        .post(productValidator,createProduct);

router
    .route("/phrase").get(searchProduct);

router
    .route("/price").get(getProductsByPrice)
    
router
    .route("/:id")
        .get(getSingleProduct)
        .patch(productValidator,updateProduct)
        .delete(deleteProduct);

export default router;