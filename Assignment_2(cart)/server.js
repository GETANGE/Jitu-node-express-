import http from 'http';
import fs from 'fs';
import path from 'path'; 
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const PORT = 4004;
const HOST = '127.0.0.1';

// Serve static files from public directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Defining the directory where the static files are located.
const staticDirectory = path.join(__dirname, 'public');
const txtFilePath = path.join(__dirname, '../Assignment_2(cart)/dev_data/data.txt');

// Read the text file asynchronously and then parse it
fs.readFile(txtFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the text file:', err);
        return;
    }

    let productData;
    try {
        productData = JSON.parse(data);
    } catch (error) {
        console.error('Error parsing JSON from the text file:', error);
        return;
    }

    let fullProductData = [...productData];

    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
    };

    const server = http.createServer((req, res) => {

        // CORS headers
        const headers = {
            'Access-Control-Allow-Origin': '*', // Allow all origins for simplicity
            'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type',
        };

        // Handle CORS preflight request
        if (req.method === 'OPTIONS') {
            res.writeHead(204, headers);
            res.end();
            return;
        }

        // Serve static files or handle API routes
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        const pathname = parsedUrl.pathname;

        if (pathname === '/api/product' && req.method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json', ...headers });
            res.end(JSON.stringify(fullProductData));
        } else {
            let filePath = path.join(staticDirectory, pathname === '/' ? 'index.html' : pathname);
            const extname = path.extname(filePath);
            const contentType = mimeTypes[extname] || 'application/octet-stream';

            // Serve static files
            fs.readFile(filePath, (err, file) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        // 404 Not Found page
                        fs.readFile(path.join(staticDirectory, '404.html'), (err404, content404) => {
                            res.writeHead(404, { 'Content-Type': 'text/html', ...headers });
                            res.end(content404 || '404 Not Found');
                        });
                    } else {
                        res.writeHead(500, headers);
                        res.end(`Server Error: ${err.code}`);
                    }
                } else {
                    res.writeHead(200, { 'Content-Type': contentType, ...headers });
                    res.end(file);
                }
            });
        }

        // GET a specific product by ID
        if (req.url.match(/\/api\/product\/\d+/) && req.method === 'GET') {
            const id = parseInt(req.url.split('/')[3]);
            const product = fullProductData.find((product) => product.id === id);
            if (product) {
                res.writeHead(200, { 'Content-Type': 'application/json', ...headers });
                res.end(JSON.stringify(product));
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json', ...headers });
                res.end(JSON.stringify({ message: 'Product not found' }));
            }
        }

        // DELETE a product by ID
        if (req.url.match(/\/api\/product\/\d+/) && req.method === 'DELETE') {
            const id = parseInt(req.url.split('/')[3]);
            const productIndex = fullProductData.findIndex((product) => product.id === id);
            
            if (productIndex !== -1) {
                fullProductData = fullProductData.filter((element) => element.id !== id);
                res.writeHead(200, { 'Content-Type': 'application/json', ...headers });
                res.end(JSON.stringify({ message: 'Successfully deleted' }));
                return; 
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json', ...headers });
                res.end(JSON.stringify({ message: 'Product not found' }));
                return;
            }
        }


        // PATCH (Update) a product by ID
        if (req.url.startsWith('/api/product/') && req.method === 'PATCH') {
            const productId = parseInt(req.url.split('/api/product/')[1]);
            if (!isNaN(productId)) {
                const productIndex = fullProductData.findIndex((product) => product.id === productId);
                if (productIndex > -1) {
                    let body = '';
                    req.on('data', chunk => body += chunk.toString());
                    req.on('end', () => {
                        const { imageUrl, title, price, date, location, company } = JSON.parse(body);
                        const updatedProduct = { ...fullProductData[productIndex], ...(imageUrl && { imageUrl }), ...(title && { title }), ...(price && { price }), ...(date && { date }), ...(location && { location }), ...(company && { company }) };
                        fullProductData[productIndex] = updatedProduct;

                        fs.writeFile('dev_data/data.json', JSON.stringify(fullProductData, null, 2), (err) => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'application/json', ...headers });
                                res.end(JSON.stringify({ error: 'Failed to update data' }));
                                return;
                            }
                            res.writeHead(200, { 'Content-Type': 'application/json', ...headers });
                            res.end(JSON.stringify(updatedProduct));
                        });
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json', ...headers });
                    res.end(JSON.stringify({ message: 'Product not found' }));
                }
            } else {
                res.writeHead(400, { 'Content-Type': 'application/json', ...headers });
                res.end(JSON.stringify({ message: 'Invalid product ID' }));
            }
        }

        // POST (Add) a new product
        if (req.method === 'POST' && req.url === '/api/product') {
            let body = '';
        
            req.on('data', chunk => {
                body += chunk.toString(); // Convert Buffer to string
            });
        
            req.on('end', () => {
                try {
                    const { imageUrl, title, price, date, location, company } = JSON.parse(body);
        
                    const newProduct = {
                        id: fullProductData.length + 1, // Simple ID generation
                        imageUrl,
                        title,
                        price,
                        date,
                        location,
                        company,
                    };
        
                    // Push the new product to the data array
                    fullProductData.push(newProduct);
        
                    // Write updated data back to the file
                    fs.writeFile(txtFilePath, JSON.stringify(fullProductData, null, 2), (err) => {
                        if (err) {
                            console.error(err);
                            if (!res.headersSent) {
                                res.writeHead(500, { 'Content-Type': 'application/json' });
                                res.end(JSON.stringify({ error: 'Failed to save product' }));
                            }
                            return; // Exit to prevent further execution
                        }
        
                        // Only send the response if headers have not been sent
                        if (!res.headersSent) {
                            res.writeHead(201, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify(newProduct));
                        }
                    });
                } catch (parseError) {
                    console.error(parseError);
                    if (!res.headersSent) {
                        res.writeHead(400, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Invalid JSON' }));
                    }
                }
            });
        
            req.on('error', (err) => {
                console.error(err);
                if (!res.headersSent) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Server error' }));
                }
            });
        }
    });

    server.listen(PORT, HOST, () => {
        console.log(`Server running at http://${HOST}:${PORT}`);
    });
});