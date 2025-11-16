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
            <input
                type="text"
                name="price"
                id="price"
                value={price}
                onChange={handleOnProductsFormChange}
                placeholder="Price"
                required
            />
            <br />
            <button>{isEditing ? "Edit" : "Submit"}</button>
            <h4>{postResponse.message}</h4>
        </form>
    );
}
