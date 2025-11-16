// Initializing Server
const express = require("express");
const server = express();
const port = 3000;
const mongoose = require("mongoose"); // import mongoose
require("dotenv").config(); // import dotenv
const { DB_URI } = process.env; // To grab the same variable from the dotenv file
const cors = require("cors"); // For disabling default browser security
const Product = require("./models/product"); // importing the model schema

// Middleware
server.use(express.json()); // to ensure the data is transmitted as json
server.use(express.urlencoded({ extended: true })); // to ensure data is encoded and decoded while transmission
server.use(cors());

// Database connection and server listening
mongoose
    .connect(DB_URI)
    .then(() => {
        server.listen(port, () => {
            console.log(`Database is connected\nServer is listening on ${port}`);
        });
    })
    .catch((error) => console.log(error.message));

// Routes
// Root route
server.get("/", (request, response) => {
    response.send("Server is Live!");
});

// To GET all the data from contacts collection
server.get("/products", async (request, response) => {
    try {
        const products = await Product.find();
        response.send(products);
    } catch (error) {
        response.status(500).send({ message: error.message, date: new Date(Date.now()) });
    }
});

// To POST a new contact to DB
server.post("/products", async (request, response) => {
    const { productName, brand, image, price } = request.body;
    const newProduct = new Product({
        id: crypto.randomUUID(),
        productName,
        brand,
        image,
        price,
    });
    try {
        await newProduct.save();
        response.status(200).send({ message: `Product is added successfully`, date: new Date(Date.now()) });
    } catch (error) {
        response.status(400).send({ message: error.message });
    }
});

// To DELETE a product from DB by it's id
server.delete("/products/:id", async (request, response) => {
    const { id } = request.params;
    try {
        await Product.findByIdAndDelete(id);
        response.send({ message: `Product is deleted with id ${id}`, date: new Date(Date.now()) });
    } catch (error) {
        response.status(400).send({ message: error.message });
    }
});

// To GET one product by id
server.get("/products/:id", async (request, response) => {
    const { id } = request.params;
    try {
        const productToEdit = await Product.findById(id);
        response.send(productToEdit);
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
});

// To PATCH a product by id
server.patch("/products/:id", async (request, response) => {
    const { id } = request.params;
    const { productName, brand, image, price } = request.body;
    try {
        await Product.findByIdAndUpdate(id, {
            productName,
            brand,
            image,
            price,
        });
        response.send({ message: `Product has been updated with id ${id}`, date: new Date(Date.now()) });
    } catch (error) {
        response.status(500).send({ message: error.message });
    }
});
