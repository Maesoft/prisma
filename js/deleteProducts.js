const productsTableBody = document.querySelector("#productsTable tbody");
const input = document.getElementById("searchInput")
let products = [];

const loadProducts = async () => {
  try {
    const response = await window.prismaFunctions.getProducts();
    if (!response.success) {
      window.prismaFunctions.showMSG(
        "error",
        "Prisma",
        response.message,
        ["Aceptar"],
        0
      );
      return;
    }
    products = response.products;
    renderProducts(products);
  } catch (error) {
    console.error("Error al obtener los articulos:", error);
  }
};
const renderProducts = (productList) => {
  productsTableBody.innerHTML = "";
  if (productList.length === 0) {
    productsTableBody.innerHTML = `
        <tr>
          <td colspan="4">No se encontraron articulos.</td>
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
          <td>${product.stock}</td>`;
    row.addEventListener("click", async () => {
      const resMSG = await window.prismaFunctions.showMSG(
        "question",
        "Prisma",
        `¿Esta seguro que desea eliminar el articulo ${product.nombre}? Tambien se eliminaran todos los movimientos de Stock.`,
        ["Si", "No"],
        0
      );
      if (resMSG == 0) deleteProduct(product);
    });
    productsTableBody.appendChild(row);
  });
};
const deleteProduct = async (product) => {
  try {
    const res = await window.prismaFunctions.deleteProduct(product.id);
    if (!res.success) {
      window.prismaFunctions.showMSG(
        "error",
        "Prisma",
        res.message,
        ["Aceptar"],
        0
      );
      return;
    }
    window.prismaFunctions.showMSG(
      "info",
      "Prisma",
      res.message,
      ["Aceptar"],
      0
    );
    loadProducts()
  } catch (error) {
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      error.message,
      ["Aceptar"],
      0
    );
  }
};
input.addEventListener("input",()=>{
  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(input.value.toLowerCase())
  );
  renderProducts(filteredProducts);
})
loadProducts();
