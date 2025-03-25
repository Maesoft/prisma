const productsTableBody = document.querySelector("#productsTable tbody");
const inputCode = document.getElementById("productCode");
const inputName = document.getElementById("productName");
const selectCategory = document.getElementById("productCategory");
const inputStock = document.getElementById("initialStock");
const inputImage = document.getElementById("productImage");
const inputDesc = document.getElementById("productDescription");
const inputCost = document.getElementById("productCost");
const inputPrice1 = document.getElementById("productPrice1");
const inputPrice2 = document.getElementById("productPrice2");
const productControlStock = document.getElementById("productControlStock");
const productTax = document.getElementById("productTax");

let products = [];
let inputId = 0;

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
      window.prismaFunctions.showMSG("error", "Prisma", response.message);
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
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      res.message,
      ["Aceptar"],
      0
    );
  }
};
const loadProductIntoForm = (product) => {
  inputId = product.id;
  inputCode.value = product.codigo;
  inputName.value = product.nombre;
  selectCategory.value = product.categoria.id;
  inputStock.value = product.stock;
  inputImage.src = product.imagen;
  inputDesc.innerText = product.descripcion;
  inputCost.value = product.costo;
  inputPrice1.value = product.precio1;
  inputPrice2.value = product.precio2;
  productControlStock.checked= product.controla_stock;
  productTax.value=product.iva;

  document.getElementById("productSearchModal").style.display = "none";
};
const clearFields = () => {
  inputId.value = "";
  inputCode.value = "";
  inputName.value = "";
  selectCategory.value = "";
  inputStock.value = 0;
  inputImage.src = "../assets/sin_imagen.png";
  inputDesc.innerText = "";
  inputCost.value = "";
  inputPrice1.value = "";
  inputPrice2.value = "";
  document.getElementById("productSearchModal").style.display = "block";
};
const addCategory = async () => {
  const newCategoryName = document
    .getElementById("newCategoryName")
    .value.trim();
  if (!newCategoryName) {
    window.prismaFunctions.showMSG(
      "info",
      "Prisma",
      "Por favor, ingrese un nombre para la categoría."
    );
    return;
  }
  const res = await window.prismaFunctions.addCategory({
    name: newCategoryName,
  });
  if (res.success) {
    window.prismaFunctions.showMSG("info", "Prisma", res.message);
    document.getElementById("productCategory").innerHTML = "";
    document.getElementById("newCategoryName").value = "";
    const modalElement = document.getElementById("categoryModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
    await loadCategories();
  } else {
    window.prismaFunctions.showMSG("error", "Prisma", res.message);
  }
};
const findProducts = async () => {
  const searchInput = document.getElementById("searchInput").value;
  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(searchInput.toLowerCase())
  );
  renderProducts(filteredProducts);
};
const saveProduct = async () => {
  if (!inputCode.value.trim() || !inputName.value.trim()) {
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      "El producto debe tener un codigo y un nombre"
    );
    return;
  }
  try {
    const productData = {
      codigo: inputCode.value,
      nombre: inputName.value,
      descripcion: inputDesc.value,
      categoria: selectCategory.value,
      imagen: inputImage.src,
      costo: inputCost.value,
      precio1: inputPrice1.value,
      precio2: inputPrice2.value,
    };
    const res = await window.prismaFunctions.editProduct(
      inputId,
      productData
    );
    if (res.success) {
      window.prismaFunctions.showMSG(
        "info",
        "Prisma",
        "Producto modificado correctamente."
      );
      loadProducts();
      clearFields();
    } else {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
    }
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
loadProducts();
loadCategories();

document
  .querySelector('[data-bs-target="#categoryModal"]')
  .addEventListener("click", function () {
    const categoryModal = new bootstrap.Modal(
      document.getElementById("categoryModal")
    );
    categoryModal.show();
  });
