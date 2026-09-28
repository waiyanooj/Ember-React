export default function SavedItems({
  saveItem,
  saveCartStyle,
  saveBox,
  handleAddCart,
  cartCount,
  getProductQuantity,
  handleRemoveCart,
}) {
  return (
    <div className="saved-block" style={{ marginTop: "22px" }}>
      <h3>Saved items</h3>

      <div className="saved-list" id="savedList">
        {saveItem.length > 0 ? (
          saveItem.map((item) => (
            <div className="saved-card" key={item.name} style={saveCartStyle}>
              <img src={item.image} alt={item.name} style={saveBox} />
              <div style={{ flex: "1" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                  }}
                >
                  <strong>{item.name}</strong>
                  <span style={{ font: "12px gray" }}>${item.price}</span>
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    display: "flex",
                    gap: "8px",
                  }}
                >
                  <button
                    className="dark-button add-saved"
                    data-name={item.name}
                    data-price={item.price}
                    style={{ padding: "8px 12px" }}
                    onClick={handleAddCart}
                  >
                    Add to cart{" "}
                    {cartCount > 0 && `(${getProductQuantity(item.name)})`}
                  </button>
                  <button
                    className="save-remove"
                    data-name={item.name}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "8px",
                      background: "transparent",
                      border: "1px solid red",
                    }}
                    onClick={handleRemoveCart}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No saved items yet.</p>
        )}
      </div>
    </div>
  );
}
