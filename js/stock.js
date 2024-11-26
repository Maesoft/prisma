const loadProducts = async () => {
  const productsTableBody = document.querySelector("#productsTable tbody");
  try {
    const response = await window.prismaFunctions.getProducts();

    if (!response.success) {
      alert(response.message);
      return;
    }

    const products = response.products;

    productsTableBody.innerHTML = "";

    products.forEach((product) => {
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
  const stockActual = Number(document.getElementById("currentStock").value)
  const stockNuevo = Number(document.getElementById("newStock").value)
  const idProduct = Number(document.getElementById("itemId").value)

  if (!stockActual || !stockNuevo || !idProduct) {
    alert("Uno de los campos es de tipo NaN.")
    return
  }
  try {
    const productData = {
      stock: stockActual + stockNuevo
    };
    
    const res = await window.prismaFunctions.editProduct(idProduct, productData)
    alert(res.message)
  } catch (error) {
    alert(res.message)
  }

  

}
const findProducts = () => {
  
}

window.addEventListener("DOMContentLoaded", loadProducts);
