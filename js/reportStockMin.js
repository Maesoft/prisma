const loadProducts = async () => {
  try {
    const res = await window.prismaFunctions.getProducts();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    renderProducts(res.products);
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const renderProducts = (arrProducts) => {
  const listProducts = document.getElementById("listProducts");
  listProducts.innerHTML = "";
  if (arrProducts.length === 0) {
    listProducts.innerHTML = `
        <tr>
            <td colspan="4">No se encontraron productos.</td>
        </tr>`;
    return;
  }
  arrProducts
    .filter((product) => product.stock <= product.stock_minimo && product.stock_minimo > 0)
    .forEach((product) => {
      let status = "";
      if (product.stock <= 0) {
        status = `<span class="badge bg-danger">Agotado</span>`;
      } else {
        status = `<span class="badge bg-warning text-dark">Stock Bajo</span>`;
      }
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.codigo}</td>
        <td>${product.descripcion}</td>
        <td>${product.categoria.name}</td>
        <td class="text-center">${product.stock}</td>
        <td class="text-center">${product.stock_minimo}</td>
        <td class="text-center">${status}</td>
        
        `;

      listProducts.appendChild(row);
    });
};

document.addEventListener("DOMContentLoaded", async () => {
  await loadProducts();
});
