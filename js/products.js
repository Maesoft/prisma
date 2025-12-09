const modalCategory = document.getElementById("categoryModal");
const modalPrice = document.getElementById("priceModal");
const modalTax = document.getElementById("taxModal");
const productImage = document.getElementById("productImage");
const productImageInput = document.getElementById("productImageInput");
const selectPrices = document.getElementById("productPrices");
const selectTaxes = document.getElementById("productTaxes");
const productControlStock = document.getElementById("productControlStock");
const initialStock = document.getElementById("initialStock");
const minStock = document.getElementById("minStock");
const btnAddSupplier = document.getElementById("btnAddSupplier");

const loadCategories = async () => {
  const res = await window.prismaFunctions.getProductCategories();
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
const loadProviders = async () => {
  const res = await window.prismaFunctions.getProviders();

  if (res.success) {
    const providerSelect = document.getElementById("productSupplier");
    providerSelect.innerHTML = "";
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione un proveedor";
    providerSelect.appendChild(defaultOption);
    res.providers.forEach((provider) => {
      const option = document.createElement("option");
      option.value = provider.id;
      option.textContent = provider.razon_social;
      providerSelect.appendChild(option);
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
  const res = await window.prismaFunctions.addProductCategory({
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
const showModal = () => {
  modalCategory.style.display = "block";
};
const newProduct = async () => {
  const productData = {
    codigo: document.getElementById("productCode").value.trim(),
    nombre: document.getElementById("productName").value.trim(),
    descripcion: document.getElementById("productDescription").value.trim(),
    categoria: document.getElementById("productCategory").value,
    imagen: document.getElementById("productImage").src,
    controla_stock: productControlStock.checked,
    stock: parseInt(document.getElementById("initialStock").value, 10) || 0,
    stock_minimo: parseInt(document.getElementById("minStock").value, 10) || 0,
    proveedor: {
      id: Number(document.getElementById("productSupplier").value) || null,
    },
  };

  if (productData.codigo === "" || productData.nombre === "") {
    window.prismaFunctions.showMSG(
      "info",
      "Prisma",
      "El producto debe tener asignado un código y un nombre."
    );
    return;
  }
  try {
    const productRes = await window.prismaFunctions.addProduct(productData);
    if (productRes.success) {
      Array.from(selectPrices.options).forEach(async (price) => {
        const priceData = {
          titulo: price.innerText.split(":")[0].trim(),
          precio: parseFloat(price.value),
          producto: { id: productRes.productId },
        };
        try {
          await window.prismaFunctions.addPrice(priceData);
        } catch (error) {
          window.prismaFunctions.showMSG(
            "error",
            "Prisma",
            "Error al agregar precio:" + error
          );
        }
      });
      Array.from(selectTaxes.options).forEach(async (tax) => {
        const taxData = {
          titulo: tax.innerText.split(":")[0].trim(),
          porcentaje: parseFloat(tax.value),
          producto: { id: productRes.productId },
        };
        try {
          await window.prismaFunctions.addTax(taxData);
        } catch (error) {
          window.prismaFunctions.showMSG(
            "error",
            "Prisma",
            "Error al agregar precio:" + error
          );
        }
      });
      if (productData.stock > 0) {
        const stockData = {
          producto: { id: productRes.productId },
          detalle: "Stock inicial al dar de alta el producto.",
          operacion: "Ingreso",
          cantidad: productData.stock,
          stockResultante: productData.stock,
        };

        try {
          const stockRes = await window.prismaFunctions.addStock(stockData);
          if (!stockRes.success) {
            window.prismaFunctions.showMSG(
              "error",
              "Prisma",
              "Error al agregar el stock: " + stockRes.message
            );
            return;
          }
        } catch (error) {
          window.prismaFunctions.showMSG(
            "error",
            "Prisma",
            "Error al agregar stock:" + error
          );
          return;
        }
      }
      window.prismaFunctions.showMSG("info", "Prisma", productRes.message);
      document.getElementById("productForm").reset();
      productImage.src = "../assets/sin_imagen.png";
      selectPrices.innerHTML = "";
      selectTaxes.innerHTML = "";
    } else {
      window.prismaFunctions.showMSG("error", "Prisma", productRes.message);
    }
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error);
  }
};
function addPrice() {
  const title = document.getElementById("priceTitle").value.trim();
  const valueNumber = Number(document.getElementById("priceValue").value);
  const value = Number(
    document.getElementById("priceValue").value
  ).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (title && value) {
    const option = document.createElement("option");
    option.textContent = `${title} : $${value}`;
    option.value = valueNumber;
    option.style.fontSize = "0.7em";
    option.style.overflowX = "hidden";
    option.style.padding = "0";
    document.getElementById("productPrices").appendChild(option);

    document.getElementById("priceTitle").value = "";
    document.getElementById("priceValue").value = "";
  }
}
function addTax() {
  const title = document.getElementById("taxTitle").value.trim();
  const value = document.getElementById("taxValue").value.trim();

  if (title && value) {
    const option = document.createElement("option");
    option.textContent = `${title} : ${value}`;
    option.value = value;
    document.getElementById("productTaxes").appendChild(option);

    document.getElementById("taxTitle").value = "";
    document.getElementById("taxValue").value = "";
  }
}
productImage.addEventListener("click", () => {
  document.getElementById("productImageInput").click();
});
productImageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    document.getElementById("productImage").src = file.path;
  }
});
productControlStock.addEventListener("change", () => {
  if (!productControlStock.checked) {
    initialStock.disabled = true;
    initialStock.value = 0;
    minStock.disabled = true;
    minStock.value = 0;
  } else {
    initialStock.disabled = false;
    minStock.disabled = false;
  }
});
btnAddSupplier.addEventListener("click", () => {
  window.prismaFunctions.openWindow({
    windowName: "newProvider",
    width: 800,
    height: 600,
    frame: true,
    modal: false,
    data: null,
  });
});
window.addEventListener("DOMContentLoaded", () => {
  loadCategories();
  loadProviders();
});
window.addEventListener("focus", () => {
  loadProviders();
});
