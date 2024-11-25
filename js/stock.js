const getProducts = async () => {
  const productsTableBody = document.querySelector("#productsTable tbody");
  try {
    const response = await window.prismaFunctions.getProducts();

    if (!response.success) {
      alert(response.message);
      return;
    }

    const products = response.products;

    console.log(products);

    productsTableBody.innerHTML = "";

    products.forEach((product) => {
      const row = document.createElement("tr");
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
  document.getElementById("itemCode").value = product.codigo;
  document.getElementById("itemName").value = product.nombre;
  document.getElementById("itemCategory").value = product.categoria.name;
  document.getElementById("currentStock").value = product.stock;
  document.getElementById("itemImage").src = product.imagen;
  document.getElementById("itemDescription").innerText = product.descripcion;
  document.getElementById("productSearchModal").style.display = "none";
};

window.addEventListener("DOMContentLoaded", getProducts);
