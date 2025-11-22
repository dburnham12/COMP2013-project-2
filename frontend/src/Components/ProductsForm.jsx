// Component used to allow users to fill in information about new products as well as to update existing products
export default function ProductsForm({
    productName,
    brand,
    image,
    price,
    handleOnProductsFormSubmit,
    handleOnProductsFormChange,
    postResponse,
    isEditing,
}) {
    return (
        <form className="ProductsForm" onSubmit={handleOnProductsFormSubmit}>
            <h3>Product Form</h3>
            {/* Input for product name */}
            <input
                type="text"
                name="productName"
                id="productName"
                value={productName}
                onChange={handleOnProductsFormChange}
                placeholder="Product Name"
                required
            />
            <br />
            {/* Input for product brand */}
            <input
                type="text"
                name="brand"
                id="brand"
                value={brand}
                onChange={handleOnProductsFormChange}
                placeholder="Brand"
                required
            />
            <br />
            {/* Input for product image */}
            <input
                type="text"
                name="image"
                id="image"
                value={image}
                onChange={handleOnProductsFormChange}
                placeholder="Image Link"
                required
            />
            <br />
            {/* Input for product price */}
            <input
                type="number"
                name="price"
                id="price"
                value={price}
                onChange={handleOnProductsFormChange}
                placeholder="Price"
                step={0.01}
                min={0}
                required
            />
            <br />
            {/* If we are in edit mode display Edit and if we are not display Submit as we are in submit mode */}
            <button>{isEditing ? "Edit" : "Submit"}</button>
            {/* Set up our post response from DB */}
            <h4>{postResponse.message}</h4>
        </form>
    );
}
