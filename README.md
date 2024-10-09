# **Xata Product Search API**

## **Overview**

This is a Node.js API built with Express.js that allows users to perform CRUD operations on products stored in a Xata database. The API also supports searching for products based on various fields such as title, location, and price.

## **Features**

- **CRUD Operations**: Create, Read, Update, and Delete products.
- **Search Functionality**: Search across the product database based on user-defined criteria like product title, location, and price.
- **Flexible Filtering**: Search with fuzziness, prefix matches, and boosters for numeric fields.

## **Tech Stack**

- **Backend**: Node.js, Express.js
- **Database**: Xata (A serverless database)
- **Environment Management**: dotenv
- **Middleware**: CORS, Express body-parser for handling JSON and URL-encoded payloads.

## **Installation**

### **Requirements**

- Node.js (v14.x or later)
- Xata Account and API Key
- Environment variables set up for `.env`

### **Setup Instructions**

1. Clone the repository:
   ```bash
   git clone https://github.com/GETANGE/Jitu-node-express-.git
