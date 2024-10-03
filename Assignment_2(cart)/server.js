import http from 'http';
import fs from 'fs';
import path from 'path'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import JSON with assertion
import data from '../Assignment_2(cart)/dev_data/data.json' assert { type: 'json' };

const PORT = 4004;
const HOST = '127.0.0.1';

let fullProductData = [...data]

// Serve static files from public directory
const __filename = fileURLToPath(import.meta.url);
console.log(__filename);

const __dirname = dirname(__filename);

// Defining the directory where the static files are located.
const staticDirectory = path.join(__dirname, 'public');

// Define MIME types for common file types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
};

const server = http.createServer((req, res) => {
    /**
     * PERFORMING THE CRUD OPERATIONS HERE.
     * (POST, PATCH, DELETE, CREATE)
     */

    // Set CORS headers manually
    const headers = {
        'Access-Control-Allow-Origin': '*', // Allow all origins for simplicity
        'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204, headers); // Respond with "No Content" for preflight
        res.end();
        return;
    }

    // Parse the URL using the `URL` class
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    // Serve static files or API routes
    if (pathname === '/api/product' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json', ...headers });
        res.end(JSON.stringify(fullProductData));
    } else {
        // Get the requested file path from the URL
        let filePath = path.join(staticDirectory, pathname === '/' ? 'index.html' : pathname);

        // Get the file extension to determine the MIME type
        const extname = path.extname(filePath);
        const contentType = mimeTypes[extname] || 'application/octet-stream';

        // Check if the file exists
        fs.readFile(filePath, (err, file) => {
            if (err) {
                if (err.code === 'ENOENT') { // meaning not found 
                    // If file is not found, serve a 404 page
                    fs.readFile(path.join(staticDirectory, '404.html'), (err404, content404) => {
                        res.writeHead(404, { 'Content-Type': 'text/html', ...headers });
                        res.end(content404 || '404 Not Found', 'utf-8');
                    });
                } else {
                    res.writeHead(500, headers);
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                // Serve the file with the correct MIME type
                res.writeHead(200, { 'Content-Type': contentType, ...headers });
                res.end(file, 'utf-8');
            }
        });
    }

    if (req.url.match(/\/api\/product\/\d+/) && req.method === "GET") {
        // 'http://localhost:4004/api/product/2'.split("/")
        //     (6)['localhost:4004', 'api', 'product', '2']
        const id = parseInt(req.url.split("/")[3])
        //find the product that matches this id 
        const product = fullProductData.find((product) => product.id === id)

        if(product){
            res.writeHead(200, { 'Content-Type': 'application/json', ...headers });
            res.end(JSON.stringify(product));
        }else{
            res.writeHead(404, { 'Content-Type': 'application/json', ...headers });
            res.end(JSON.stringify({message: "Product not found"}));
        }
    }

    if (req.url.match(/\/api\/product\/\d+/) && req.method === "DELETE") {
        const id = parseInt(req.url.split("/")[3])
        const productIndex = fullProductData.findIndex((product) => product.id === id)
        if (productIndex !== -1) {
            fullProductData = fullProductData.filter((element) => element.id !== id)

            res.writeHead(200, { 'Content-Type': 'application/json', ...headers });
            res.end(JSON.stringify({
                message: "Successfully deleted"
            }));
        } else {
            res.writeHead(200, { 'Content-Type': 'application/json', ...headers });
            res.end(JSON.stringify({
                message: "Product not found"
            }));
        }
    }

    if (req.url.startsWith('/api/product/') && req.method === 'PATCH') {
        const productId = parseInt(req.url.split('/api/product/')[1]); // Extract the product ID from the URL
    
        if (!isNaN(productId)) {
            const productIndex = fullProductData.findIndex(product => product.id === productId);
    
            if (productIndex > -1) {
                let body = '';
    
                // Listen for data chunks in the request
                req.on('data', chunk => {
                    body += chunk.toString(); // Convert binary data to string
                });
    
                // Once all data has been received
                req.on('end', () => {
                    // Parse the body as JSON and destructure the properties
                    const {imageUrl, title, price, date, location, company } = JSON.parse(body);
    
                    // Update only the provided fields while keeping other fields intact
                    const updatedProduct = {
                        ...fullProductData[productIndex], // Existing product data
                        ...(imageUrl && { imageUrl }),
                        ...(title && { title }),  
                        ...(price && {price}),   
                        ...(date && { date }),     
                        ...(location && { location }),
                        ...(company && { company }),  // Update only if company is provided
                    };
    
                    // Update the product in the data array
                    fullProductData[productIndex] = updatedProduct;
    
                    // Write the updated data back to the file
                    fs.writeFile('dev_data/data.json', JSON.stringify(fullProductData, null, 2), (err) => {
                        if (err) {
                            console.error(err);
                            res.writeHead(500, { 'Content-Type': 'application/json', ...headers });
                            res.end(JSON.stringify({ error: 'Failed to update data' }));
                            return;
                        }
    
                        // Respond with the updated product
                        res.writeHead(200, { 'Content-Type': 'application/json', ...headers });
                        res.end(JSON.stringify(updatedProduct));
                    });
                });
            } else {
                // Product not found
                res.writeHead(404, { 'Content-Type': 'application/json', ...headers });
                res.end(JSON.stringify({ message: 'Product not found' }));
            }
        } else {
            // Invalid product ID
            res.writeHead(400, { 'Content-Type': 'application/json', ...headers });
            res.end(JSON.stringify({ message: 'Invalid product ID' }));
        }
    }
    
    if(req.url === '/api/product' && req.method === "POST") {
        let body = "" // we will store the request data
        req.on("data", chunk => { // req.on listnes incoming data as streams
            //append each data chunk to the body
            body += chunk.toString()
        })

        req.on("end", () => {
            //we have the data in  body
            //so we can destructure the properies
            const {imageUrl, title, price, date, location, company } = JSON.parse(body);
            const newId = fullProductData.length + 1
            const newProduct = {
                id: newId,
                imageUrl,
                title,
                price,
                date,
                location,
                company
            }
            fullProductData.push(newProduct)
            fs.writeFile('dev_data/data.json', JSON.stringify(fullProductData, null, 2), (err) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500, { 'Content-Type': 'application/json', ...headers });
                    res.end(JSON.stringify({ error: 'Failed to save data' }));
                    return;
                }
                res.writeHead(201, { 'Content-Type': 'application/json', ...headers });
                res.end(JSON.stringify(newProduct));
            });
        })
    }
    
});

server.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});