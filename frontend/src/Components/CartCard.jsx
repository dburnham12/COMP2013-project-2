import QuantityCounter from "./QuantityCounter";

// CartCard represents one single cart item in the cart
export default function CartCard({
    id,
    productName,
    image,
    price,
    quantity,
    total,
    handleRemoveItemFromCart,
    handleUpdateQuantity,
}) {
    return (
        <div className="CartCard">
            <div className="CartCardInfo">
                <img src={image} />
                <h4>{productName}</h4>
                <p>{price}</p>
                {/* Add a quantity counter with mode 1 to update cart instead of products */}
                <QuantityCounter id={id} mode={1} itemQuantity={quantity} handleUpdateQuantity={handleUpdateQuantity} />
            </div>
            <div className="CartCardInfo">
                {/* Add the total to the card and use to fixed to set the precision */}
                <h4>Total: ${total.toFixed(2)}</h4>
                {/* Remove button using the removeItemFromCart function to remove a specific item */}
                <button
                    className="RemoveButton"
                    onClick={() => {
                        handleRemoveItemFromCart(id);
                    }}
                >
                    Remove
                </button>
            </div>
        </div>
    );
}
