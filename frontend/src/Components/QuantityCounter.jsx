// A reusable component used functionally by the cart and product card components, used to increment or decrement the amount
// of items currently held in a cart or product card
export default function QuantityCounter({ id, mode, itemQuantity, handleUpdateQuantity }) {
    return (
        <div className="ProductQuantityDiv">
            {/* Buttom that uses the updateQuantity function, in this case we increment by -1 as we are actually decrementing 
            the total */}
            <button
                onClick={() => {
                    handleUpdateQuantity(id, -1, mode);
                }}
            >
                -
            </button>
            <span>{itemQuantity}</span>
            {/* Buttom that uses the updateQuantity function, in this case we increment by 1 */}
            <button
                onClick={() => {
                    handleUpdateQuantity(id, 1, mode);
                }}
            >
                +
            </button>
        </div>
    );
}
