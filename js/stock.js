const productsTableBody = document.querySelector("#productsTable tbody");
let products = [];

const renderProducts = (productList) => {
  productsTableBody.innerHTML = "";
  if (productList.length === 0) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="4">No se encontraron productos.</td>
      </tr>`;
    return;
  }
  productList.forEach((product) => {
    const row = document.createElement("tr");
    row.setAttribute("data-id", product.id);
    row.innerHTML = `
        <td>${product.codigo}</td>
        <td>${product.nombre}</td>
        <td>${product.categoria.name}</td>
        <td>${product.stock}</td>
    `;
    row.addEventListener("click", () => loadProductIntoForm(product));
    productsTableBody.appendChild(row);
  });
};

const loadProducts = async () => {
  try {
    const response = await window.prismaFunctions.getProducts();
    if (!response.success) {
      alert(response.message);
      return;
    }
    products = response.products;
    renderProducts(products);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
};
const loadProductIntoForm = (product) => {
  document.getElementById("itemId").value = product.id;
  document.getElementById("itemCode").value = product.codigo;
  document.getElementById("itemName").value = product.nombre;
  document.getElementById("itemCategory").value = product.categoria.name;
  document.getElementById("currentStock").value = product.stock;
  document.getElementById("itemImage").src = product.imagen;
  document.getElementById("itemDescription").innerText = product.descripcion;
  document.getElementById("productSearchModal").style.display = "none";
};

const updateStock = async () => {
  const stockActual = Number(document.getElementById("currentStock").value);
  const stockNuevo = Number(document.getElementById("newStock").value);
  const idProduct = Number(document.getElementById("itemId").value);
  const stockDesc = document.getElementById("detailStock").value;

  if (isNaN(stockActual) || isNaN(stockNuevo) || isNaN(idProduct)) {
    alert("Uno de los campos es de tipo NaN.");
    return;
  }

  try {
    const productData = {
      stock: stockActual + stockNuevo,
    };
    const resProduct = await window.prismaFunctions.editProduct(
      idProduct,
      productData
    );
    const resStock = await window.prismaFunctions.addStock({
      producto: { id: idProduct },
      detalle: stockDesc,
      operacion: stockNuevo > 0 ? "Ingreso" : "Egreso",
      cantidad: stockNuevo,
      stockResultante: stockActual + stockNuevo,
    });
    if (!resProduct.success || !resStock.success) {
      alert(stockDesc);
      return;
    }
    alert("Stock actualizado correctamente.");
    loadProducts();
    document.getElementById("stockForm").reset();
    document.getElementById("productSearchModal").style.display = "block";
  } catch (error) {
    console.error("Error al actualizar el stock:", error);
    alert("Hubo un problema al actualizar el stock.");
  }
};
const findProducts = async () => {
  const searchInput = document.getElementById("searchInput").value;
  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(searchInput.toLowerCase())
  );
  renderProducts(filteredProducts);
};

window.addEventListener("DOMContentLoaded", loadProducts);
