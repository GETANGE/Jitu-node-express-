# **🚀 Xata Product Search API**

## **🔍 Overview**

This is a **Node.js API** built with **Express.js** and **TypeScript** that allows users to perform **CRUD operations** on products stored in a **Xata database**. It also supports advanced searching based on various product fields such as title, location, and price.

## **✨ Features**

- **🛠️ CRUD Operations**: Create, Read, Update, and Delete products.
- **🔍 Search Functionality**: Perform fuzzy and precise searches on product data based on fields like title, location, and price.
- **🔧 Flexible Filtering**: Search with features like fuzziness, prefix matching, and boosters for numeric fields.
- **✅ Validation**: Comprehensive data validation using `express-validator` for safer data handling.

---

## **⚙️ Tech Stack**

- **Backend**: Node.js, Express.js, and TypeScript
- **Database**: Xata (A serverless database)
- **Validation**: `express-validator` for request validation
- **Environment Management**: dotenv for environment variables
- **Middleware**: CORS, `express.json()` for JSON and URL-encoded payload parsing

---

## **📦 Installation**

### **📝 Requirements**

- Node.js (v18.x or later)
- Xata Account and API Key
- Set up `.env` file with the necessary environment variables

### **🔧 Setup Instructions**

1. Clone the repository:
   ```bash
   git clone https://github.com/GETANGE/Jitu-node-express-.git
   cd Jitu-node-express
   cd Typescript+express

### **Localhost**
http//localhost:7000

### **API Endpoints**
   POST /api/products => create a product

   GET /api/products => get all products

   GET /api/products/:id => create a single product

   PATCH /api/products/:id => update a single product

   DELETE /api/products/:ID => delete a single product

## **Sample Database with Table**

![Screenshot from 2024-10-09 09-30-06](https://github.com/user-attachments/assets/f85b346b-3619-439c-ad6f-27ce52016b1a)

### **Environment Variables**

Ensure the following environment variables are added to your `.env` file:

```bash
XATA_API_KEY=<your-xata-api-key>
XATA_WORKSPACE=<your-xata-workspace>
XATA_REGION=<your-xata-region>
PORT=3000
