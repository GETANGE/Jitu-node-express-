import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { getXataClient } from "./xata";
import cors from "cors";
import morgan from "morgan";

dotenv.config();

// Inference
const app: Express = express();
const port = process.env.PORT || 7000;

const xata = getXataClient();

// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cors());
app.use(morgan('dev'))

// GET Request
app.get("/api/v1/products", async (req: Request, res: Response) => {
  try {
    const products = await xata.db.Products.getAll();

    res.json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error fetching products",
    });
  }
});

// POST Request
app.post("/api/v1/products", async (req: Request, res: Response) => {
  try {
    const newProduct = await xata.db.Products.create(req.body);

    res.json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating product",
    });
  }
});

// PATCH Request (partial update)
app.patch("/api/v1/products/:id", async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const updatedProduct = await xata.db.Products.update(productId, req.body);

    res.json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating product",
    });
  }
});

// PATCH Request (update or create)
app.patch("/api/v1/productsOrCreate/:id", async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    const updatedProduct = await xata.db.Products.createOrUpdate(productId, req.body);

    res.json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating product",
    });
  }
});

// DELETE Request
app.delete("/api/v1/products/:id", async (req: Request, res: Response) => {
  try {
    const productId = req.params.id;

    await xata.db.Products.delete(productId);

    res.json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error deleting product",
    });
  }
});

// Search across tables
app.post("/api/v1/search", async (req: Request, res: Response) => {
  
  try {
    const data = req.body.data; 

    if(!data){
      res.status(400).json({
        message: "No data provided",
      });
    }

    const results = await xata.search.all(data,{
      tables:[
        {
          table: "Products",
          target: ["title","location" ,"price"],
          filter: {"date": "Sollicito illo a perspiciatis defleo capillus umerus. Depulso carus considero occaecati chirographum tumultus. Victus ultio cetera sto.\nAlter cauda voluptatibus defungo voro deorsum capio curso. Talis demens tero carus cotidie dolor tantum decipio. Unus armarium quidem cruentus theatrum tenetur dolorem clamo."},
          boosters: [{
            numericBooster:{
              column: "price",
              factor: 3
            }
          }]
        }
      ],
      fuzziness:1,
      prefix: "phrase"
    });

    if(!results){
      res.status(404).json({
        message: "No results found",
      });
    }

    res.json({
      message: "Search results",
      data: results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error performing search",
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`[server]: Server is running at port: ${port} 🎉`);
});
