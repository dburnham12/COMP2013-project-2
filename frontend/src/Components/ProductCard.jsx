import QuantityCounter from "./QuantityCounter";

// Represents a single product card for items that can be added to the cart
export default function ProductCard({
    id,
    productName,
    brand,
    quantity,
    image,
    price,
    productQuantity,
    handleAddItemToCart,
    handleUpdateQuantity,
}) {
    return (
        <div className="ProductCard">
            <h4>{productName}</h4>
            <img src={image} />
            <h5>
                {brand} ({quantity})
            </h5>
            {/* Add a quantity counter with mode 0 to update products instead of cart */}
            <QuantityCounter
                id={id}
                mode={0}
                itemQuantity={productQuantity.quantity}
                handleUpdateQuantity={handleUpdateQuantity}
            />
            <p>{price}</p>
            {/* Add a button to add an item to cart */}
            <button
                onClick={() => {
                    // Set up a new object and use the addItemToCart function to add it to the cart
                    handleAddItemToCart({
                        id,
                        productName,
                        brand,
                        quantity: productQuantity.quantity,
                        image,
                        price,
                    });
                }}
            >
                Add To Cart
            </button>
        </div>
    );
}
