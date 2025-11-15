//
export default function NavBar({ cartCount }) {
    return (
        <div className="NavBar">
            <div className="NavDiv">
                <p className="NavUser">Hello, username</p>
            </div>
            <div className="NavDiv">
                <h3 className="NavTitle">Groceries App 🍎</h3>
            </div>
            <div className="NavDiv">
                {/* Check if the cart has items in it and choose which image to display */}
                <img
                    className="NavCart"
                    src={cartCount > 0 ? "src/assets/cart-full.png" : "src/assets/cart-empty.png"}
                />
            </div>
        </div>
    );
}
