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
        // If we are connected to the DB then have the server listen on port 3000
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
        // Find all products in our products DB
        const products = await Product.find();
        // Send the list of products to the frontend
        response.send(products);
    } catch (error) {
        // send back an appropriate error if need be
        response.status(500).send({ message: error.message });
    }
});

// To POST a new contact to DB
server.post("/products", async (request, response) => {
    // Get our information from the request body
    const { productName, brand, image, price } = request.body;
    // Create a new product based off the information provided on frontend
    const newProduct = new Product({
        id: crypto.randomUUID(),
        productName,
        brand,
        image,
        price,
    });
    try {
        // Save our newly created product to the DB
        let savedProduct = await newProduct.save();
        // Send back a response with a message, the date, and our saved product id as in this case it will be needed
        // by the frontend to update product quantities. In all other cases we don't need to send back the id.
        response.status(200).send({
            message: `${productName} added successfully`,
            date: new Date(Date.now()),
            _id: savedProduct._id,
        });
    } catch (error) {
        // send back an appropriate error if need be
        response.status(400).send({ message: error.message });
    }
});

// To DELETE a product from DB by it's id
server.delete("/products/:id", async (request, response) => {
    // Get the id from the request params
    const { id } = request.params;
    try {
        // Find a product with the id we specified and delete it
        await Product.findByIdAndDelete(id);
        // Send back a user friendly message and the date so that our post response will be unique
        response.send({ message: `Product is deleted with id ${id}`, date: new Date(Date.now()) });
    } catch (error) {
        // send back an appropriate error if need be
        response.status(400).send({ message: error.message });
    }
});

// To GET one product by id
server.get("/products/:id", async (request, response) => {
    // Get the id from the request params
    const { id } = request.params;
    try {
        // Find the product we need to edit
        const productToEdit = await Product.findById(id);
        // Send the product we need to edit to the frontend
        response.send(productToEdit);
    } catch (error) {
        // send back an appropriate error if need be
        response.status(500).send({ message: error.message });
    }
});

// To PATCH a product by id
server.patch("/products/:id", async (request, response) => {
    // Get the id from the request params
    const { id } = request.params;
    // Get our information from the request body
    const { productName, brand, image, price } = request.body;
    try {
        // Update the product in the DB based off the id provided
        await Product.findByIdAndUpdate(id, {
            productName,
            brand,
            image,
            price,
        });
        // Send back a user friendly message and the date so that our post response will be unique
        response.send({ message: `${productName} has been updated with id ${id}`, date: new Date(Date.now()) });
    } catch (error) {
        // send back an appropriate error if need be
        response.status(500).send({ message: error.message });
    }
});
