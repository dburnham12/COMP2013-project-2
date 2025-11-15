import ProductCard from "./ProductCard";

// Products container is the wrapper for all items that a user can add to the cart
export default function ProductsContainer({ products, productQuantities, handleAddItemToCart, handleUpdateQuantity }) {
    return (
        <div className="ProductsContainer">
            {/* Set up all product cards so that the user can add items to the cart */}
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    {...product}
                    productQuantity={productQuantities.find((p) => p.id === product.id)}
                    handleAddItemToCart={handleAddItemToCart}
                    handleUpdateQuantity={handleUpdateQuantity}
                />
            ))}
        </div>
    );
}
