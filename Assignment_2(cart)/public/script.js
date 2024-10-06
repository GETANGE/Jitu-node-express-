// Show form functions
document.getElementById('showAddFormBtn').addEventListener('click', () => {
    document.getElementById('addProductForm').classList.remove('hidden');
    document.getElementById('updateProductForm').classList.add('hidden');
    document.getElementById('deleteProductForm').classList.add('hidden');
});

document.getElementById('showUpdateFormBtn').addEventListener('click', () => {
    document.getElementById('updateProductForm').classList.remove('hidden');
    document.getElementById('addProductForm').classList.add('hidden');
    document.getElementById('deleteProductForm').classList.add('hidden');
});

document.getElementById('showDeleteFormBtn').addEventListener('click', () => {
    document.getElementById('deleteProductForm').classList.remove('hidden');
    document.getElementById('addProductForm').classList.add('hidden');
    document.getElementById('updateProductForm').classList.add('hidden');
});

// Add Product Form Submission
document.getElementById('addProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newProduct = {
        imageUrl: document.getElementById('productImageUrl').value,
        title: document.getElementById('productTitle').value,
        price: document.getElementById('productPrice').value,
        date: document.getElementById('productDate').value,
        location: document.getElementById('productLocation').value,
        company: document.getElementById('productCompany').value
    };

    try {
        await axios.post("http://127.0.0.1:4004/api/product", newProduct);
        alert('New product added!');
        displayContent();
        document.getElementById('addProductForm').reset(); // Reset the form
        document.getElementById('addProductForm').classList.add('hidden'); // Hide the form
    } catch (error) {
        console.error('Error adding product:', error.response.data);
    }
});

// Update Product Form Submission
document.getElementById('updateProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const productId = document.getElementById('productIdToUpdate').value;
    const updatedProduct = {
        imageUrl: document.getElementById('updateProductImageUrl').value,
        title: document.getElementById('updateProductTitle').value,
        price: document.getElementById('updateProductPrice').value,
        date: document.getElementById('updateProductDate').value,
        location: document.getElementById('updateProductLocation').value,
        company: document.getElementById('updateProductCompany').value
    };

    try {
        await axios.put(`http://127.0.0.1:4004/api/product/${productId}`, updatedProduct);
        alert('Product updated!');
        displayContent();
        document.getElementById('updateProductForm').reset(); // Reset the form
        document.getElementById('updateProductForm').classList.add('hidden'); // Hide the form
    } catch (error) {
        console.log(error);
        console.error('Error updating product:', error.response.data);
    }
});

// Delete Product Form Submission
document.getElementById('deleteProductForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const productId = document.getElementById('productIdToDelete').value;

    try {
        await axios.delete(`http://127.0.0.1:4004/api/product/${productId}`);
        alert('Product deleted!');
        displayContent();
        document.getElementById('deleteProductForm').reset(); // Reset the form
        document.getElementById('deleteProductForm').classList.add('hidden'); // Hide the form
    } catch (error) {
        console.error('Error deleting product:', error.response.data);
    }
});

let events = []; // will store the items to be filtered.
let cartProducts = []; // will store items in the cart

// Function to display events
const displayContent = function (eventsToDisplay) {
    const container = document.getElementById("container");
    container.innerHTML = "";

    eventsToDisplay.forEach(event => {
        const card = document.createElement("div");
        card.className = "main";
        container.appendChild(card);

        const img = document.createElement('img');
        img.src = event.imageUrl;
        card.appendChild(img);

        const info = document.createElement('div');
        info.className = "info";
        card.appendChild(info);

        const title = document.createElement('h3');
        title.textContent = event.title;
        info.appendChild(title);

        const date = document.createElement('p');
        date.textContent = event.date;
        info.appendChild(date);

        const company = document.createElement('p');
        company.textContent = event.company;
        info.appendChild(company);

        const price = document.createElement('p');
        price.textContent = `Ksh ${event.price}`;
        info.appendChild(price);

        const button = document.createElement('button');
        button.textContent = 'Add to Cart';
        button.className = 'addProduct';
        info.appendChild(button);

        button.addEventListener('click', () => {
            addProductToCart(event); // Call the function to add the product to the cart
        });
    });
};

// Function to add products to the cart
const addProductToCart = function (product) {
const cartContainer = document.getElementById('cartContainer');

// Check if the product already exists in the cart
const existingProductIndex = cartProducts.findIndex(item => item.id === product.id);

if (existingProductIndex !== -1) {
// If the product already exists, increment the quantity
cartProducts[existingProductIndex].quantity += 1;
} else {
// If the product is new, set its quantity to 1 and add it to the cart
product.quantity = 1;
cartProducts.push(product);
}

// Clear the cart container and re-render items
updateCart();
};

// Function to render the cart
const updateCart = function() {
const cartContainer = document.getElementById('cartContainer');
cartContainer.innerHTML = '';

cartProducts.forEach((item, index) => {
const cartItem = document.createElement('div');
cartItem.className = 'cart-item';

const img = document.createElement('img');
img.src = item.imageUrl;
cartItem.appendChild(img);

const info = document.createElement('div');
info.className = "info-cart";
cartItem.appendChild(info);

const title = document.createElement('h4');
title.textContent = item.title;
info.appendChild(title);

const date = document.createElement('p');
date.textContent = item.date;
info.appendChild(date);

const company = document.createElement('p');
company.textContent = item.company;
info.appendChild(company);

const price = document.createElement('p');
price.className = 'price';
price.textContent = `Ksh ${item.price * item.quantity}`; // Total price based on quantity
info.appendChild(price);

// Create quantity control buttons and display inside the info container
const quantityContainer = document.createElement('div');
quantityContainer.className = 'quantity-container';

const decrementButton = document.createElement('button');
decrementButton.textContent = '-';
decrementButton.onclick = () => {
    if (item.quantity > 1) {
        cartProducts[index].quantity -= 1;
    } else {
        // If quantity is 1, remove the product from the cart
        cartProducts.splice(index, 1);
    }
    updateCart();
};
quantityContainer.appendChild(decrementButton);

const quantityDisplay = document.createElement('span');
quantityDisplay.textContent = `Quantity: ${item.quantity}`;
quantityContainer.appendChild(quantityDisplay);

const incrementButton = document.createElement('button');
incrementButton.textContent = '+';
incrementButton.onclick = () => {
    cartProducts[index].quantity += 1;
    updateCart();
};
quantityContainer.appendChild(incrementButton);

// Append the quantity control to the info container
info.appendChild(quantityContainer);

// Create delete button
const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.className = 'delete-button';
deleteButton.onclick = () => {
    // Remove the product entirely from the cart
    cartProducts.splice(index, 1);
    updateCart();
};
info.appendChild(deleteButton);

// Create edit button
const editButton = document.createElement('button');
editButton.textContent = 'Edit';
editButton.className = 'edit-button';
editButton.onclick = () => {
    editProduct(index); // Call the edit function with the product index
};
info.appendChild(editButton);

// Append the new cart item to the cart container
cartContainer.appendChild(cartItem);
});
};

// Function to edit product details
const editProduct = function(index) {
// Get the product to edit
const product = cartProducts[index];

// Create a form for editing the product
const form = document.createElement('div');
form.className = 'edit-form';

const titleInput = document.createElement('input');
titleInput.type = 'text';
titleInput.value = product.title;
form.appendChild(titleInput);

const dateInput = document.createElement('input');
dateInput.type = 'date';
dateInput.value = product.date;
form.appendChild(dateInput);

const companyInput = document.createElement('input');
companyInput.type = 'text';
companyInput.value = product.company;
form.appendChild(companyInput);

const priceInput = document.createElement('input');
priceInput.type = 'number';
priceInput.value = product.price;
form.appendChild(priceInput);

const saveButton = document.createElement('button');
saveButton.textContent = 'Save';
saveButton.onclick = () => {
// Save the edited values to the product
product.title = titleInput.value;
product.date = dateInput.value;
product.company = companyInput.value;
product.price = parseFloat(priceInput.value);

// Re-render the cart with the updated product information
updateCart();

// Remove the form after saving
form.remove();
};
form.appendChild(saveButton);

// Append the form to the cart container
const cartContainer = document.getElementById('cartContainer');
cartContainer.appendChild(form);
};

// Fetch data and initialize page
fetch("http://127.0.0.1:4004/api/product")
    .then((res) => res.json())
    .then((data) => {
        events = data;
        displayContent(events); // Call the function to display the events initially
    })
    .catch(error => console.error('Error fetching data:', error));

// Filter functionality
document.getElementById('priceFilter').addEventListener('change', () => {
    const priceFilter = document.getElementById('priceFilter').value;

    let filteredEvents = events; 

    if (priceFilter === 'low') {
        filteredEvents = events.filter(event => event.price <= 50);
    } else if (priceFilter === 'high') {
        filteredEvents = events.filter(event => event.price > 50);
    }

    displayContent(filteredEvents);
});