const productsTableBody = document.querySelector("#productsTable tbody");
const inputCode = document.getElementById("productCode");
const inputName = document.getElementById("productName");
const selectCategory = document.getElementById("productCategory");
const inputStock = document.getElementById("initialStock");
const inputImage = document.getElementById("productImage");
const inputDesc = document.getElementById("productDescription");
const selectPrices = document.getElementById("productPrices");
const selectTaxes = document.getElementById("productTaxes");
const productControlStock = document.getElementById("productControlStock");
const productTax = document.getElementById("productTaxes");
let productSearchModal;

let products = [];
let idProduct = 0;

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
  console.log(product);
  
  idProduct = product.id;
  inputCode.value = product.codigo;
  inputName.value = product.nombre;
  selectCategory.value = product.categoria.id;
  inputStock.value = product.stock;
  inputImage.src = product.imagen;
  inputDesc.innerText = product.descripcion;

  selectPrices.innerHTML = "";
  product.precios.forEach((price) => {
    const option = document.createElement("option");
    option.value = price.precio;
    option.textContent = `${price.titulo} : $${price.precio.toLocaleString(
      "es-AR",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )} ❌`;
    selectPrices.appendChild(option);
  });
  selectTaxes.innerHTML = "";
  product.impuestos.forEach((tax) => {  
    const option = document.createElement("option");
    option.value = tax.procentaje;
    option.textContent = `${tax.titulo} ${tax.porcentaje}% ❌`;
    selectTaxes.appendChild(option);
  });

  productControlStock.checked = product.controla_stock;
  productSearchModal.hide();
};
const clearFields = () => {
  loadProducts();
  inputCode.value = "";
  inputName.value = "";
  selectCategory.value = "";
  inputStock.value = 0;
  inputImage.src = "../assets/sin_imagen.png";
  inputDesc.innerText = "";
  document.getElementById("productSearchModal").style.display = "block";
  selectPrices.innerHTML = "";
  productTax.innerHTML = "";
  productSearchModal.show();
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
    };

    const res = await window.prismaFunctions.editProduct(
      idProduct,
      productData
    );

    if (res.success) {
      await savePrices();
      await saveTaxes();
      clearFields();
      window.prismaFunctions.showMSG(
        "info",
        "Prisma",
        "Producto modificado correctamente."
      );
    } else {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
    }
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const saveTaxes = async () => {
  const resDel = await window.prismaFunctions.deleteTax(idProduct);

  if (resDel.success) {
    const taxes = Array.from(selectTaxes.options).map((option) => ({
      producto: {id: idProduct},
      titulo: option.textContent.split(" : ")[0],
      porcentaje: parseFloat(option.value),
    }));
    const resAdd = await window.prismaFunctions.addTax(taxes);
    if (!resAdd.success)window.prismaFunctions.showMSG("error", "Prisma", res.message);
} else {
    window.prismaFunctions.showMSG("error", "Prisma", res.message);
  }
};
const savePrices = async () => {
  const resDel = await window.prismaFunctions.deletePrice(idProduct);

  if (resDel.success) {
    const prices = Array.from(selectPrices.options).map((option) => ({
      producto: {id: idProduct},
      titulo: option.textContent.split(" : ")[0],
      precio: parseFloat(option.value),
    }));
    const resAdd = await window.prismaFunctions.addPrice(prices);
    if (!resAdd.success)window.prismaFunctions.showMSG("error", "Prisma", res.message);
} else {
    window.prismaFunctions.showMSG("error", "Prisma", res.message);
  }
};
const addPrice = () => {
  const title = document.getElementById("priceTitle").value.trim();
  const valueNumber = Number(document.getElementById("priceValue").value);
  const value = valueNumber.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (title && value) {
    const option = document.createElement("option");
    option.textContent = `${title} : $${value}`;
    option.value = valueNumber;
    selectPrices.appendChild(option);
    document.getElementById("priceTitle").value = "";
    document.getElementById("priceValue").value = "";
  }
};
const addTax = () => {
  const title = document.getElementById("taxTitle").value.trim();
  const value = document.getElementById("taxValue").value.trim();

  if (title && value) {
    const option = document.createElement("option");
    option.textContent = `${title} ${value}%`;
    option.value = value;
    productTax.appendChild(option);
    document.getElementById("taxTitle").value = "";
    document.getElementById("taxValue").value = "";
  }
};
document.addEventListener("DOMContentLoaded", function () {
  productSearchModal = new bootstrap.Modal(
    document.getElementById("productSearchModal")
  );
  productSearchModal.show();
  loadProducts();
  loadCategories();
});
selectPrices.addEventListener("click", (e) => {
  if (e.target.tagName === "OPTION") {
    e.target.remove();
  }
});
selectTaxes.addEventListener("click", (e) => {
  if (e.target.tagName === "OPTION") {
    e.target.remove();
  }
});
