import { useState, useEffect } from "react";

import CartContainer from "./CartContainer";
import NavBar from "./NavBar";
import ProductsContainer from "./ProductsContainer";
import ProductsForm from "./ProductsForm";

import axios from "axios";

// Contains all logic for the application and manages states, all functions to be used are written here
export default function GroceriesAppContainer() {
    // State used to store all products in our list of products
    const [products, setProducts] = useState([]);
    // State used to store product quantities for all products in the list of products
    const [productQuantities, setProductQuantities] = useState([]);
    // State used to store all cart items for all products currently in the cart
    const [cartItems, setCartItems] = useState([]);
    // Form Data used for editing and submitting new products
    const [formData, setFormData] = useState({
        productName: "",
        brand: "",
        image: "",
        price: "",
    });
    // Response from DB which SHOULD change after each DB call (Other than in handleProductsDB)
    const [postResponse, setPostResponse] = useState({ message: "", date: "" });
    // Set the editing state so we can swap between editing and submitting new products
    const [isEditing, setIsEditing] = useState(false);

    // Use Effect to update products DB on postReponse changes
    useEffect(() => {
        handleProductsDB();
    }, [postResponse]);

    // =====================================
    // ======= Info And DB Handling ========
    // =====================================
    // Function to grab all products from the DB and update product quantities on first render
    const handleProductsDB = async () => {
        try {
            // Get all products from the db via our server
            const response = await axios.get("http://localhost:3000/products");
            // Set products using the response
            setProducts(response.data);
            // Check if post response is set
            if (!postResponse.message) {
                // If it is set up product quantities, this prevents product quantities from being reset
                // every time a DB operation happens maintaining their current amounts
                setProductQuantities(
                    response.data.map((prod) => {
                        return {
                            _id: prod._id,
                            quantity: 0,
                        };
                    })
                );
            }
        } catch (error) {
            // log an error message if one is recieved
            console.log(error.message);
        }
    };

    // Function to Reset the form data to empty values
    const handleResetForm = () => {
        setFormData({
            productName: "",
            brand: "",
            image: "",
            price: "",
        });
    };

    // Function to handle the onChange event for the products form
    const handleOnProductsFormChange = (e) => {
        // Update form data using the html infor using name and value for each form field
        setFormData((prevData) => {
            return { ...prevData, [e.target.name]: e.target.value };
        });
    };

    // Handle the submission of data
    const handleOnProductsFormSubmit = async (e) => {
        // Prevent the default action (dont force a refresh)
        e.preventDefault();
        try {
            // If we are in editing mode
            if (isEditing) {
                // Update the product based off of form data
                handleOnProductUpdate(formData._id);
                // Reset the form
                handleResetForm();
                // Turn off editing mode
                setIsEditing(false);
            }
            // If we are not in editing mode
            else {
                // Add the new submission to the DB
                await axios
                    // Format price specifically since form data does not include the $
                    .post("http://localhost:3000/products", { ...formData, price: `$${formData.price}` }) // reformat price from our number field to have dollar sign encorporated
                    // Using the response from the server
                    .then((response) => {
                        // Set the post response forcing a re-render
                        setPostResponse(response.data);
                        // Update product quantities to contain the new product quantity
                        setProductQuantities((prevQuantities) => [
                            ...prevQuantities,
                            { _id: response.data._id, quantity: 0 },
                        ]);
                    })
                    // Once both operations are complete reset the form
                    .then(() => {
                        handleResetForm();
                    });
            }
        } catch (error) {
            // log an error message if one is recieved
            console.log(error.message);
        }
    };

    // Function to handle deleting one product by id
    const handleOnProductDelete = async (_id) => {
        try {
            // Send the delete request to the server to delete the item from the DB
            const response = await axios.delete(`http://localhost:3000/products/${_id}`);
            // Set the post response based off the object returned
            setPostResponse(response.data);
            // Update product quantities to remove the item from our quantities as well
            setProductQuantities((prevQuantities) => prevQuantities.filter((itemQuantity) => itemQuantity._id !== _id));

            // If the item is in the cart and we have deleted it delete item from cart as well
            const foundCartItem = cartItems.find((cartItem) => cartItem._id === _id);
            if (foundCartItem) {
                handleRemoveItemFromCart(_id);
            }
        } catch (error) {
            // log an error message if one is recieved
            console.log(error.message);
        }
    };

    // Function to handle to editing a product based off id
    const handleOnProductEdit = async (_id) => {
        try {
            // Get the current product that we want to edit based off the id
            const productToEdit = await axios.get(`http://localhost:3000/products/${_id}`);
            // Set up formData with all relavent information for the product
            setFormData({
                _id,
                productName: productToEdit.data.productName,
                brand: productToEdit.data.brand,
                image: productToEdit.data.image,
                price: productToEdit.data.price.replace("$", ""), // need to remove dollar sign for number field
            });
            // Set our editing mode to true to show we are editing an existing product and not submitting a new product
            setIsEditing(true);
        } catch (error) {
            // log an error message if one is recieved
            console.log(error);
        }
    };

    // Handle updating the api patch route
    const handleOnProductUpdate = async (_id) => {
        try {
            // Send the patch to the server based off of the updated information
            const result = await axios.patch(`http://localhost:3000/products/${_id}`, {
                ...formData,
                price: `$${formData.price}`,
            });
            // Set the post response based off of what is returned when the operation is completed
            setPostResponse(result.data);

            // If the item exists within the cart we need to update it as well
            const foundCartItem = cartItems.find((cartItem) => cartItem._id === formData._id);
            // If we have updated an item in our cart
            if (foundCartItem) {
                setCartItems(
                    cartItems.map((cartItem) => {
                        if (cartItem._id === foundCartItem._id) {
                            // update the information in our cart based off of the information provided in formData
                            return {
                                _id,
                                productName: formData.productName,
                                brand: formData.brand,
                                image: formData.image,
                                price: `$${formData.price}`, // Re-add dollar sign for display
                                quantity: cartItem.quantity,
                                total: calculateItemTotal(formData.price, cartItem.quantity),
                            };
                        }
                        return cartItem;
                    })
                );
            }
        } catch (error) {
            // log an error message if one is recieved
            console.log(error);
        }
    };

    // =====================================
    // ======= Cart And Item Handling ======
    // =====================================
    // Function used to calculate the item total based off of quantity and price
    const calculateItemTotal = (price, quantity) => {
        // Use replace to remove the $ and multiply by quantity
        return price.replace("$", "") * quantity;
    };

    // Function used to calculate the cart total based off of the items currently in the cart
    const calculateCartTotal = (newCartItems) => {
        // Use reduce to add up all item totals
        return newCartItems.reduce((total, item) => total + item.total, 0);
    };

    // Function used to update the quantity of items either in cart card or product card
    const handleUpdateQuantity = (_id, increment, mode) => {
        // 0 is the mode to add to product total
        if (mode === 0) {
            // Use map to cycle through each item in product quantites and update them
            const newQuantities = productQuantities.map((prodQuantity) => {
                // Once we find the item that we are adding to
                if (prodQuantity._id === _id) {
                    // Set up a new value for quantity and increment by either a positive value (increment) or a negative value (decrement)
                    let newQuantity = prodQuantity.quantity + increment;
                    // Check if the quantity is within range, if not assign it to 0 as it cannot be negative
                    newQuantity = newQuantity > 0 ? newQuantity : 0;
                    // Update the item quantity for the specified item
                    prodQuantity = { ...prodQuantity, quantity: newQuantity };
                }
                // Return the item with either its original quantity or an updated quantity
                return prodQuantity;
            });
            // Update product quantites to our newly mapped array
            setProductQuantities(newQuantities);
        }
        // Any other number will handle adding to the cart total
        else {
            // Set up a flag to check if the item should be removed
            let removeItem = false;
            // Use map to cycle through each item in cart items and update them
            const newCartItems = cartItems.map((item) => {
                // If we have found our item to be updated
                if (item._id === _id) {
                    // Set up a new value for quantity and increment by either a positive value (increment) or a negative value (decrement)
                    let newQuantity = item.quantity + increment;
                    // https://stackoverflow.com/questions/9334636/how-to-create-a-dialog-with-ok-and-cancel-options
                    // Used this article to set up an alert with Ok Cancel dialogue allowing the user to select their
                    // option as to wether or not the item should be removed.
                    // Check if our quantity is equal to 0 and if the user selects the option to remove from cart
                    if (
                        newQuantity === 0 &&
                        confirm(`Quantity reduced to 0 would you like to remove ${item.productName} from the cart?`)
                    ) {
                        // if ok selected set our removeItem flag to true
                        removeItem = true;
                    } else {
                        // otherwise update the quantity to the new quantity or 1 if less than 1
                        newQuantity = newQuantity > 1 ? newQuantity : 1;
                        // Update the item total based off of the new quantity
                        const newTotal = calculateItemTotal(item.price, newQuantity);
                        // Assign new quantity and total for the item
                        item = { ...item, quantity: newQuantity, total: newTotal };
                    }
                }
                // Return the item with either its original quantity and total or an updated quantity and total
                return item;
            });

            // If we are to remove the item then call removeItemFromCart function to do so
            if (removeItem) handleRemoveItemFromCart(_id);
            // Update cart items to our newly mapped array and update cart total if the item is not to be removed
            else {
                setCartItems(newCartItems);
            }
        }
    };

    // Function to add an item to the cart
    const handleAddItemToCart = (newItem) => {
        // If our item quantity is 0 dont add the item and display an alert
        if (newItem.quantity === 0) {
            alert(`Trying to add: ${newItem.productName} \nNumber of items cannot be 0`);
            return;
        }

        // If the quantity is greater than 0 we must update cart items
        // Check if the new item already exists in the array
        const foundCartItem = cartItems.find((cartItem) => cartItem._id === newItem._id);
        let newCartItems = [];
        // If the new item exists in the array of cart items
        if (foundCartItem) {
            // Update the current list of cart items by mapping over it
            newCartItems = cartItems.map((cartItem) => {
                // Check if the cart items id matches the new items id
                if (cartItem._id === newItem._id) {
                    // If it does add the quantity to the cart items quantity
                    const newQuantity = cartItem.quantity + newItem.quantity;
                    // Set up the total based off quantity and price
                    const newTotal = calculateItemTotal(cartItem.price, newQuantity);
                    // Update the quantity and price to the new values
                    return { ...cartItem, quantity: newQuantity, total: newTotal };
                }
                // Return either the updated or non updated cart item based off of if it is the one that we are
                // currently checking for
                return cartItem;
            });
        }
        // If the new item does not yet exist in the cart
        else {
            // Calculate the new total based off price and quantity
            const newTotal = calculateItemTotal(newItem.price, newItem.quantity);
            // Add the new item to the array of cart items
            newCartItems = [{ ...newItem, total: newTotal }, ...cartItems];
        }
        // Update cart items to be our updated array
        setCartItems(newCartItems);
    };

    // Function to remove an item from the cart
    const handleRemoveItemFromCart = (_id) => {
        // Filter the items to only include items without a specified id
        const newCartItems = cartItems.filter((cartItem) => cartItem._id !== _id);
        // Update the cart items based off of the newly removed item
        setCartItems(newCartItems);
    };

    // Function to clear our the cart
    const handleEmptyCart = () => {
        // Set the cart items to an empty array
        setCartItems([]);
    };

    return (
        <>
            {/* Set up the NavBar */}
            <NavBar cartCount={cartItems.length} />
            <div className="GroceriesApp-Container">
                <ProductsForm
                    {...formData}
                    handleOnProductsFormSubmit={handleOnProductsFormSubmit}
                    handleOnProductsFormChange={handleOnProductsFormChange}
                    postResponse={postResponse}
                    isEditing={isEditing}
                />
                {/* Set up the ProductsContainer */}
                <ProductsContainer
                    products={products}
                    productQuantities={productQuantities}
                    handleAddItemToCart={handleAddItemToCart}
                    handleUpdateQuantity={handleUpdateQuantity}
                    handleOnProductEdit={handleOnProductEdit}
                    handleOnProductDelete={handleOnProductDelete}
                />
                {/* Set up the CartContainer */}
                <CartContainer
                    cartItems={cartItems}
                    calculateCartTotal={calculateCartTotal}
                    handleEmptyCart={handleEmptyCart}
                    handleRemoveItemFromCart={handleRemoveItemFromCart}
                    handleUpdateQuantity={handleUpdateQuantity}
                />
            </div>
        </>
    );
}
