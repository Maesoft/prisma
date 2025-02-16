const productImage = document.getElementById("productImage");
const productImageInput = document.getElementById("productImageInput");
const selectPrices = document.getElementById("productPrices")

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
const addCategory = async () => {
  const newCategoryName = document
    .getElementById("newCategoryName")
    .value.trim();
  if (!newCategoryName) {
    window.prismaFunctions.showMSG("info","Prisma", "Por favor, ingrese un nombre para la categoría.");
    return;
  }
  const res = await window.prismaFunctions.addCategory({
    name: newCategoryName,
  });
  if (res.success) {
    window.prismaFunctions.showMSG("info","Prisma", res.message);
    document.getElementById("productCategory").innerHTML = "";
    document.getElementById("newCategoryName").value = "";
    const modalElement = document.getElementById("categoryModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
    await loadCategories();
  } else {
    window.prismaFunctions.showMSG("error","Prisma", res.message);
  }
};
const showModal = () => {
  const modal = document.getElementById("categoryModal");
  modal.classList.toggle("show");
  modal.style.display = modal.classList.contains("show") ? "block" : "none";
};
const newProduct = async () => {
  let objPrices={}
  const productData = {
    codigo: document.getElementById("productCode").value.trim(),
    nombre: document.getElementById("productName").value.trim(),
    descripcion: document.getElementById("productDescription").value.trim(),
    categoria: document.getElementById("productCategory").value,
    imagen: document.getElementById("productImage").src,
    stock: parseInt(document.getElementById("initialStock").value, 10) || 0,
  };

  Array.from(selectPrices.options).forEach((price,index)=>{
    objPrices[index] = price.innerHTML;
  })
  console.log(objPrices)
  // if (productData.codigo === "" || productData.nombre === "") {
  //    window.prismaFunctions.showMSG("info","Prisma", "El producto debe tener asignado un código y un nombre.");
  //   return;
  // }

  // try {
  //   const productRes = await window.prismaFunctions.addProduct(productData);
  //   if (productRes.success) {
  //     if (productData.stock > 0) {
  //       const stockData = {
  //         producto: { id: productRes.productId },
  //         detalle: "Stock inicial al dar de alta el producto.",
  //         operacion: "Ingreso",
  //         cantidad: productData.stock,
  //         stockResultante: productData.stock,
  //       };

  //       try {
  //         const stockRes = await window.prismaFunctions.addStock(stockData);
  //         if (!stockRes.success) {
  //           window.prismaFunctions.showMSG("error","Prisma", "Error al agregar el stock: " + stockRes.message);
  //           return;
  //         }
  //       } catch (error) {
  //         window.prismaFunctions.showMSG("error","Prisma", "Error al agregar stock:" + error);
  //         return;
  //       }
  //     }
  //     window.prismaFunctions.showMSG("info","Prisma", productRes.message);
  //     document.getElementById("productForm").reset();
  //     productImage.src="../assets/sin_imagen.png"
  //   } else {
  //     window.prismaFunctions.showMSG("error","Prisma", "Error al agregar el producto: " + productRes.message);
  //   }
  // } catch (error) {
  //   window.prismaFunctions.showMSG("error","Prisma", "Error al agregar el producto:"+ error);
  // }
};
function addPrice() {
  const title = document.getElementById("priceTitle").value.trim();
  const value = document.getElementById("priceValue").value.trim();

  if (title && value) {
      const option = document.createElement("option");
      option.textContent = `${title} : ${value}`;
      option.value = value;
      document.getElementById("productPrices").appendChild(option);

      // Cerrar modal y limpiar inputs
      document.getElementById("priceTitle").value = "";
      document.getElementById("priceValue").value = "";
      new bootstrap.Modal(document.getElementById("priceModal")).hide();
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

      // Cerrar modal y limpiar inputs
      document.getElementById("taxTitle").value = "";
      document.getElementById("taxValue").value = "";
      new bootstrap.Modal(document.getElementById("taxModal")).hide();
  }
}
productImage.addEventListener("click", () => {
  document.getElementById("productImageInput").click();
});
productImageInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById("productImage").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});
window.addEventListener("DOMContentLoaded", loadCategories);
