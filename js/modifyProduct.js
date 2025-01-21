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
      window.prismaFunctions.showMSG("error","Prisma", response.message);
      return;
    }
    products = response.products;
    renderProducts(products);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
};
const loadCategories = async () => {
    const res = await window.prismaFunctions.getCategories();
    if (res.success) {
      const categorySelect = document.getElementById("productCategory");
      categorySelect.innerHTML = "";
      res.categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
      });
    } else {
      window.prismaFunctions.showMSG("error","Prisma", res.message,["Aceptar"], 0);
    }
  };
const loadProductIntoForm = (product) => {
  document.getElementById("itemId").value = product.id;
  document.getElementById("productCode").value = product.codigo;
  document.getElementById("productName").value = product.nombre;
  document.getElementById("productCategory").value = product.categoria.id;
  document.getElementById("initialStock").value = product.stock;
  document.getElementById("productImage").src = product.imagen;
  document.getElementById("productDescription").innerText = product.descripcion;
  document.getElementById("productCost").value=product.costo;
  document.getElementById("productPrice1").value=product.precio1;
  document.getElementById("productPrice2").value=product.precio2;
  document.getElementById("productSearchModal").style.display = "none";
};

const updateStock = async () => {
  const stockActual = Number(document.getElementById("currentStock").value);
  const stockNuevo = Number(document.getElementById("newStock").value);
  const idProduct = Number(document.getElementById("itemId").value);
  const stockDesc = document.getElementById("detailStock").value;

  if (isNaN(stockActual) || isNaN(stockNuevo) || isNaN(idProduct)) {
    window.prismaFunctions.showMSG("error","Prisma", "Uno de los campos es de tipo NaN.");
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
      window.prismaFunctions.showMSG("error","Prisma", stockDesc);
      return;
    }
    window.prismaFunctions.showMSG("info","Prisma", "Stock actualizado correctamente.");
    loadProducts();
    document.getElementById("stockForm").reset();
    document.getElementById("productSearchModal").style.display = "block";
  } catch (error) {
    window.prismaFunctions.showMSG("error","Prisma", "Error al actualizar el stock:", error);
  }
};
const findProducts = async () => {
  const searchInput = document.getElementById("searchInput").value;
  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(searchInput.toLowerCase())
  );
  renderProducts(filteredProducts);
};

loadProducts();
loadCategories();
