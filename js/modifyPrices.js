const labelProductosAfectados = document.getElementById("productosAfectados");
const selectFilter = document.getElementById("selectFilter");
const selectCategory = document.getElementById("selectCategory");
const selectSupplier = document.getElementById("selectSupplier");
const redondearCheckbox = document.getElementById("redondear");

let productosAfectados = [];

const allProducts = async () => {
  try {
    const res = await window.prismaFunctions.getProducts();
    if (!res.success) return [];
    return res.products;
  } catch (error) {
    console.error("Error cargando productos:", error);
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      "Error al cargar los productos, cierre el programa y vuelva a abrirlo."
    );
    return [];
  }
};
const loadCategories = async () => {
  try {
    const res = await window.prismaFunctions.getCategories();
    if (!res.success) return [];
    const categorias = res.categories;
    // Añadir las categorías al select
    selectCategory.innerHTML =
      '<option value="">Seleccionar categoría</option>';
    categorias.forEach((categoria) => {
      const option = document.createElement("option");
      option.value = categoria.id;
      option.textContent = categoria.name;
      selectCategory.appendChild(option);
    });
  } catch (error) {
    console.error("Error cargando categorías:", error);
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      "Error al cargar las categorías, cierre el programa y vuelva a abrirlo."
    );
    return [];
  }
};
const loadSuppliers = async () => {
  try {
    const res = await window.prismaFunctions.getProviders();
    if (!res.success) return [];
    const suppliers = res.providers;
    // Añadir los proveedores al select
    selectSupplier.innerHTML =
      '<option value="">Seleccionar proveedor</option>';
    suppliers.forEach((supplier) => {
      const option = document.createElement("option");
      option.value = supplier.id;
      option.textContent = supplier.razon_social;
      selectSupplier.appendChild(option);
    });
  } catch (error) {
    console.error("Error cargando proveedores:", error);
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      "Error al cargar los proveedores, cierre el programa y vuelva a abrirlo."
    );
    return [];
  }
};
const filterBySupplier = async (supplierId) => {
  const productos = await allProducts();
  return productos.filter((product) => product.proveedor?.id === supplierId);
};
const filterByCategory = async (categoryId) => {
  const productos = await allProducts();
  return productos.filter((product) => product.categoria?.id === categoryId);
};
const actualizarPrecios = async (e) => {
  if (productosAfectados.length === 0) {
    window.prismaFunctions.showMSG(
      "warning",
      "Prisma",
      "No hay productos afectados por la modificación."
    );
    return;
  }

  const porcentaje = Number(document.getElementById("porcentaje").value);
  if (isNaN(porcentaje)) {
    window.prismaFunctions.showMSG(
      "warning",
      "Prisma",
      "Por favor, ingrese un porcentaje válido."
    );
    return;
  }
  const redondear = redondearCheckbox.checked;
  const productIds = productosAfectados.map((product) => product.id);
  try {
    const res = await window.prismaFunctions.modifyPrices(
      productIds,
      porcentaje,
      redondear
    );
    if (res.success) {
      window.prismaFunctions.showMSG(
        "info",
        "Prisma",
        res.message
      );
      labelProductosAfectados.textContent = (
        await allProducts()
      ).length.toString();
      productosAfectados = await allProducts();
    } else {
      window.prismaFunctions.showMSG(
        "error",
        "Prisma",
        "Error al actualizar los precios. Por favor, inténtelo de nuevo."
      );
    }
  } catch (error) {
    console.error("Error actualizando precios:", error);
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      "Error al actualizar los precios. Por favor, cierre el programa y vuelva a abrirlo."
    );
  }
};
document.addEventListener("DOMContentLoaded", async () => {
  labelProductosAfectados.textContent = (await allProducts()).length.toString();
  productosAfectados = await allProducts();
  await loadCategories();
  await loadSuppliers();
});
selectFilter.addEventListener("change", async (e) => {
  const filter = e.target.value;
  switch (filter) {
    case "categoria":
      selectCategory.classList.remove("d-none");
      selectSupplier.classList.add("d-none");
      break;
    case "proveedor":
      selectSupplier.classList.remove("d-none");
      selectCategory.classList.add("d-none");
      break;

    default:
      selectCategory.classList.add("d-none");
      selectSupplier.classList.add("d-none");
      break;
  }
});
selectCategory.addEventListener("change", async (e) => {
  const categoryId = Number(e.target.value);
  if (categoryId) {
    const productos = await filterByCategory(categoryId);
    labelProductosAfectados.textContent = productos.length.toString();
    productosAfectados = productos;
  } else {
    labelProductosAfectados.textContent = (
      await allProducts()
    ).length.toString();
    productosAfectados = await allProducts();
  }
});
selectSupplier.addEventListener("change", async (e) => {
  const supplierId = Number(e.target.value);
  if (supplierId) {
    const productos = await filterBySupplier(supplierId);
    labelProductosAfectados.textContent = productos.length.toString();
    productosAfectados = productos;
  } else {
    labelProductosAfectados.textContent = (
      await allProducts()
    ).length.toString();
    productosAfectados = await allProducts();
  }
});
