import { Request, Response, NextFunction } from "express";
import { getXataClient } from "../xata";
import AppError from "../utils/AppError";

const xata = getXataClient();

export const createProduct = async (req: Request, res: Response, next:NextFunction) => {
        try {
            const newProduct = await xata.db.Products.create(req.body);
    
            res.json({
                message: "Product created successfully",
                data: newProduct,
            });

        } catch (err) {
            return next(new AppError("Error creating product", 500));
        }
}

export const getAllProducts = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const products = await xata.db.Products.getAll();
    
        res.status(200).json({
            message: "Products fetched successfully",
            data: products
        });
        
        } catch (err) {
            return next(new AppError("Error fetching products", 500))
    }
}

export const getSingleProduct =async (req: Request, res: Response, next:NextFunction) => {
    try {
            const productId = req.params.id;

            const product = await xata.db.Products.read(productId);
        
            if(!product){
                return next(new AppError("Product not found", 404));
            }
            
            res.json({
                message: "Products fetched successfully",
                data: product,
            }); 
            
    } catch (err) {
        return next(new AppError("Error fetching product", 500));
    }
}

export const updateProduct = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const productId = req.params.id;
    
        const updatedProduct = await xata.db.Products.update(productId, req.body);
    
        res.json({
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        return next(new AppError("Error updating product", 500))
    }
}

export const deleteProduct = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const productId = req.params.id;
    
        await xata.db.Products.delete(productId);
    
        res.json({
            message: "Product deleted successfully",
        });
    } catch (err) {
        return next(new AppError("Error deleting product", 500))
    }
}

export const searchProduct = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const { phrase } = req.params;
        
        if (!phrase) {
            return next(new AppError("provide a valid phrase", 404));
        }

      // Performing the search with the phrase
        const results = await xata.search.all(phrase, {
            tables: [
                {
                    table: "Products",
                    target: ["title", "location", "price"]
                }
            ]
        });

        res.json({
            message: "Search results",
            data: results,
        });
    } catch (error) {
        return next(new AppError("Error searching product", 500))
    }
}