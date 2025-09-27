const inputModalProviders = document.getElementById("inputModalProviders");
const inputCodigoProveedor = document.getElementById("inputCodigoProveedor");
const labelNombreProveedor = document.getElementById("nombreProveedor");
const inputCodigoProducto = document.getElementById("codigoProducto");
const inputModalProduct = document.getElementById("inputModalProducts");
const tipoComprobante = document.getElementById("tipoComprobante");
const tablaProductos = document.getElementById("tablaProductos");
const ptoVta = document.getElementById("ptoVta");
const nroComp = document.getElementById("nroComp");
const observacion = document.getElementById("observacion");
const fechaCompra = document.getElementById("fechaCompra");
const fechaActual = new Date().toISOString().split("T")[0];
const codigoProducto = document.getElementById("codigoProducto");
const btnCobrar = document.getElementById("btnCobrar");
const subTotalDisplay = document.getElementById("subtotal-display");
const totalDisplay = document.getElementById("total-display");
const impuestosDisplay = document.getElementById("impuestos-display");

let total = 0;
let idProvider = 0;
let providers = [];
let products = [];
let productsPurchase = [];
let purchaseDetail = [];

fechaCompra.value = fechaActual;
inputCodigoProveedor.focus();

const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}-${mes}-${anio}`;
};
const loadProviders = async () => {
  try {
    const res = await window.prismaFunctions.getProviders();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Error", res.message);
      return;
    }
    providers = res.providers;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Error", error);
  }
};
const renderProviders = (arrProviders) => {
  const listProviders = document.getElementById("listProviders");
  listProviders.innerHTML = "";
  if (arrProviders.length === 0) {
    listProviders.innerHTML = `
      <tr>
        <td colspan="4">No se encontraron proveedores.</td>
      </tr>`;
    return;
  }
  arrProviders.forEach((provider) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${provider.codigo}</td>
        <td>${provider.razon_social}</td>
        <td>${provider.cuit}</td>
        <td>${provider.regimen}</td>`;
    row.addEventListener("click", () => {
      idProvider = provider.id;
      inputCodigoProveedor.value = provider.codigo;
      labelNombreProveedor.textContent = provider.razon_social;
      const modalProviders = bootstrap.Modal.getInstance(
        document.getElementById("modalProviders")
      );
      modalProviders.hide();
    });
    listProviders.appendChild(row);
  });
};
const loadProducts = async () => {
  try {
    const res = await window.prismaFunctions.getProducts();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Error", res.message);
      return;
    }

    products = res.products.map((product) => ({
      ...product,
      precios: product.precios?.sort((a, b) => a.precio - b.precio) || [],
    }));
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Error", error);
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
  arrProducts.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${product.codigo}</td>
        <td>${product.nombre}</td>
        <td>${product.categoria.name}</td>
        <td>${product.stock}</td>`;
    row.addEventListener("click", () => {
      addProductToPurchase(product);
      const modalProducts = bootstrap.Modal.getInstance(
        document.getElementById("modalProducts")
      );
      calculateTotal();
      modalProducts.hide();
    });
    listProducts.appendChild(row);
  });
};
const calculateImpuestos = () => {
  const impuestosAgrupados = [];

  productsPurchase.forEach((product, index) => {
    const cantidad = product.cantidad || 0;
    const precioUnitario = parseFloat(
      document.querySelectorAll(".precio-input")[index]?.value
    );
    const subtotal = cantidad * precioUnitario;
    if (Array.isArray(product.impuestos)) {
      product.impuestos.forEach((tax) => {

        const clave = `${tax.titulo} ${tax.porcentaje}%`;

        if (!impuestosAgrupados[clave]) {
          impuestosAgrupados[clave] = 0;
        }

        impuestosAgrupados[clave] += (subtotal * tax.porcentaje) / 100;
      });
    }
  });

  if (impuestosDisplay) {
    impuestosDisplay.innerHTML = "";
    Object.entries(impuestosAgrupados).forEach(([nombre, valor]) => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${nombre}:</strong> $ ${valor.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      impuestosDisplay.appendChild(div);
    });
  }
  return Object.values(impuestosAgrupados).reduce((acc, val) => acc + val, 0);
};
const renderProductPurchase = () => {
  tablaProductos.innerHTML = "";
  productsPurchase.forEach((product, index) => {
    const row = document.createElement("tr");
    row.style.height = "12px";
    row.style.border = "1px solid #d3d3d3";
    row.style.borderRadius = "6px";

    row.innerHTML = `
      <td class="codigo">${product.codigo}</td>
      <td>${product.nombre}</td>
      <td>
        <input 
          type="number" 
          value="${product.cantidad}" 
          min="1" 
          data-index="${index}" 
          class="cantidad-input form-control text-center"
          style="font-size: 0.7rem; height: 16px; padding: 0px 4px; line-height: 1; border: 1px solid #ccc; margin: auto; width: auto; min-width: 60px;"
        />
      </td>
      <td>
        <input class="precio-input form-control text-center"
        style="font-size: 0.7rem; height: 16px; padding: 0px 4px; line-height: 1; border: 1px solid #ccc; margin: auto; width: auto; min-width: 60px;"
        type="number" data-index="${index}" value="${product.precios?.[0]?.precio ?? 0
      }" min="0"/>
      </td>
      <td class="total-cell">
      ${((product.precios?.[0]?.precio ?? 0) * product.cantidad).toLocaleString(
        "es-AR",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}</td>
      <td><button 
        class="btn btn-dark btn-sm p-0 btn-remove d-flex align-items-center justify-content-center" 
        style="width: 16px; height: 16px; font-size: 0.6rem; line-height: 1; margin: 0;" 
        data-index="${index}"
      >
        ✖
      </button></td>
    `;

    tablaProductos.appendChild(row);
  });

  // Actualizar totales cuando cambie la cantidad o el precio seleccionado
  const cantidadInputs = document.querySelectorAll(".cantidad-input");
  const precioInputs = document.querySelectorAll(".precio-input");

  cantidadInputs.forEach((input) => {
    input.addEventListener("input", updateSubTotal);
  });

  precioInputs.forEach((input) => {
    input.addEventListener("change", updateSubTotal);
  });
  // Escuchar eventos en boton eliminar
  const btnsDelete = document.querySelectorAll(".btn-remove");
  btnsDelete.forEach((btn) => {
    btn.addEventListener("click", deleteItem);
  });
};
const deleteItem = (event) => {
  const target = event.target;
  const row = target.closest("tr");
  const rowIndex = Array.from(tablaProductos.rows).indexOf(row);

  if (rowIndex === -1) return;

  const productToRemove = productsPurchase[rowIndex];
  if (productToRemove) {
    productsPurchase = productsPurchase.filter(
      (product, index) => index !== rowIndex
    );
  }

  const purchaseDetailIndex = purchaseDetail.findIndex(
    (detail) => detail.producto === productToRemove.nombre
  );
  if (purchaseDetailIndex !== -1) {
    purchaseDetail.splice(purchaseDetailIndex, 1);
  }

  row.remove();
  calculateTotal();
};
const updateSubTotal = (event) => {
  const target = event.target;
  const row = target.closest("tr"); //closest selecciona el elemento "tr" mas cercano al taget

  if (!row) {
    console.error("No se encontró la fila asociada.");
    return;
  }

  const cantidadInput = row.querySelector(".cantidad-input");
  const precioInput = row.querySelector(".precio-input");
  const totalCell = row.querySelector(".total-cell");

  if (!cantidadInput || !precioInput || !totalCell) {
    console.error(
      "No se encontraron los elementos necesarios en la fila:",
      row
    );
    return;
  }

  const cantidad = parseFloat(cantidadInput.value) || 0;
  const precio = parseFloat(precioInput.value) || 0;
  const subtotal = cantidad * precio;

  totalCell.textContent = subtotal.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Actualizar la cantidad en el array productsPurchase
  const index = parseInt(cantidadInput.dataset.index);
  if (productsPurchase[index]) {
    productsPurchase[index].cantidad = cantidad;
  }

  calculateTotal();
};
const calculateTotal = () => {
  const totalCells = document.querySelectorAll(".total-cell");
  let subtotal = 0;

  totalCells.forEach((cell) => {
    const valor =
      parseFloat(cell.textContent.replace(/\./g, "").replace(",", ".")) || 0;
    subtotal += valor;
  });

  const impuestos = calculateImpuestos();

  if (subTotalDisplay) {
    subTotalDisplay.textContent = ` $ ${subtotal.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  total = subtotal + impuestos;

  if (totalDisplay) {
    totalDisplay.textContent = ` $ ${total.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
};
const addProductToPurchase = (product) => {
  const existingProduct = productsPurchase.find(
    (item) => item.codigo === product.codigo
  );

  if (existingProduct) {
    existingProduct.cantidad += 1;
    existingProduct.total =
      existingProduct.cantidad * existingProduct.precios[0].precio;
  } else {
    productsPurchase.push({
      id: product.id,
      codigo: product.codigo,
      nombre: product.nombre,
      controla_stock: product.controla_stock,
      stock: product.stock,
      cantidad: 1,
      impuestos: product.impuestos,
      precios: product.precios?.[0]?.precio ?? 0,
      total: product.precios?.[0]?.precio ?? 0,
    });
  }
  renderProductPurchase();
};
const collect = async () => {
  if (
    !inputCodigoProveedor.value ||
    total === 0 ||
    !fechaCompra.value ||
    !ptoVta.value ||
    !nroComp
  ) {
    window.prismaFunctions.showMSG(
      "error",
      "Error",
      "Verifique si ingresó un proveedor, productos, una fecha válida y numero de comprobante."
    );
    return;
  }

  const purchaseData = {
    fecha: fechaCompra.value,
    tipo_comprobante: tipoComprobante.value,
    numero_comprobante: `${ptoVta.value}-${nroComp.value}`,
    provider: idProvider,
    total: total,
    observacion: observacion.value,
  };

  try {
    const purchaseResponse = await window.prismaFunctions.addPurchase(
      purchaseData
    );
    const purchaseId = purchaseResponse.purchaseId;

    if (!purchaseId) {
      throw new Error("No se pudo obtener el ID de la venta.");
    }

    for (let i = 0; i < tablaProductos.rows.length; i++) {
      const row = tablaProductos.rows[i];
      const precioUnitarioInput = row.cells[3].querySelector("input");
      const cantidadInput = row.cells[2].querySelector("input");

      purchaseDetail.push({
        producto: row.cells[1].innerText,
        cantidad: parseInt(cantidadInput.value),
        precio_unitario: parseFloat(precioUnitarioInput.value),
        subtotal: parseFloat(
          row.cells[4].innerText.replace(/\./g, "").replace(",", ".")
        ),
        purchase: purchaseId,
      });
    }
    await window.prismaFunctions.addDetailPurchase(purchaseDetail);
    updateStock();
    updateTax(purchaseId);
    cleanFields();
    window.prismaFunctions.showMSG(
      "info",
      "Prisma",
      "Comprobante guardado correctamente."
    );
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const updateTax = async (purchaseId) => {
  const divs = impuestosDisplay.querySelectorAll("div");

  for (const div of divs) {
    const text = div.textContent.trim(); // "Iva 21%: $ 33.600,00"
    const match = text.match(/^(.+?)\s(\d+)%:\s\$?\s?([\d.,]+)/);

    if (match) {
      const nombre = match[1].trim();
      const porcentaje = parseFloat(match[2]);
      const monto = parseFloat(match[3].replace(/\./g, "").replace(",", "."));

      const taxData = { nombre, porcentaje, monto, purchase: purchaseId }
      try {
        const res = await window.prismaFunctions.addTaxPurchase(taxData);
        if (!res.success) {
          window.prismaFunctions.showMSG(
            "error",
            "Prisma",
            `Error al agregar impuesto: ${res.message}`
          );
          return;
        }
      } catch (error) {
        window.prismaFunctions.showMSG(
          "error",
          "Prisma",
          `Error inesperado: ${error.message || error}`
        );
      }
    }
  }
};
const cleanFields = () => {
  productsPurchase = [];
  purchaseDetail = [];
  ptoVta.value = "";
  nroComp.value = "";
  observacion.value = "";
  inputCodigoProveedor.value = "";
  labelNombreProveedor.textContent = "";
  total = 0;
  idProvider = 0;
  tablaProductos.innerHTML = "";
  subTotalDisplay.textContent = "0.00";
  totalDisplay.textContent = "0.00";
  impuestosDisplay.innerHTML = "";
};
const updateStock = () => {
  productsPurchase.forEach(async (product) => {
    if (product.controla_stock) {
      const productData = {
        stock: product.stock + product.cantidad,
      };
      const stockData = {
        producto: { id: product.id },
        detalle: `Compra - ${tipoComprobante.value + ptoVta.value}-${nroComp.value
          }`,
        operacion: "Ingreso",
        cantidad: +product.cantidad,
        stockResultante: product.stock + product.cantidad,
      };

      await window.prismaFunctions.editProduct(product.id, productData);
      await window.prismaFunctions.addStock(stockData);
    }
  });
};
inputCodigoProveedor.addEventListener("keyup", async (event) => {
  if (event.key === "F3") {
    const providerSearchModal = new bootstrap.Modal(
      document.getElementById("modalProviders")
    );
    providerSearchModal.show();
    await loadProviders();
    renderProviders(providers);
    setTimeout(() => inputModalProviders.focus(), 200);
  }
  if (event.key === "Enter") {
    await loadProviders();
    const codeToSearch = providers.find(
      (provider) => provider.codigo == inputCodigoProveedor.value
    );
    if (!codeToSearch) {
      inputCodigoProveedor.value = "";
      inputCodigoProveedor.focus();
      labelNombreProveedor.textContent = "Codigo incorrecto.";
    } else {
      idProvider = codeToSearch.id;
      labelNombreProveedor.textContent = codeToSearch.razon_social;
      ptoVta.focus();
    }
  }
});
inputCodigoProveedor.addEventListener("focusout", async (event) => {
  await loadProviders();
  const codeToSearch = providers.find(
    (provider) => provider.codigo == inputCodigoProveedor.value
  );
  if (!codeToSearch) {
    inputCodigoProveedor.value = "";
    labelNombreProveedor.textContent = "Codigo incorrecto.";
  } else {
    idProvider = codeToSearch.id;
    labelNombreProveedor.textContent = codeToSearch.razon_social;
    ptoVta.focus();
  }
});
inputCodigoProducto.addEventListener("keyup", async (event) => {
  if (event.key === "F3") {
    const productsModal = new bootstrap.Modal(
      document.getElementById("modalProducts")
    );
    productsModal.show();
    await loadProducts();
    renderProducts(products);
    setTimeout(() => inputModalProduct.focus(), 200);
  }
  if (event.key === "Enter") {
    await loadProducts();
    const codeToSearch = products.find(
      (product) => product.codigo == inputCodigoProducto.value
    );
    if (!codeToSearch) {
      inputCodigoProducto.value = "";
      inputCodigoProducto.focus();
      return;
    }
    addProductToPurchase(codeToSearch);

    inputCodigoProducto.value = "";
    inputCodigoProducto.focus();
    calculateTotal();
  }
});
inputModalProviders.addEventListener("input", (e) => {
  const criterio = e.target.value;
  const filteredProviders = providers.filter((provider) =>
    provider.razon_social.toLowerCase().includes(criterio.toLowerCase()) ||
    provider.codigo.toLowerCase().includes(criterio.toLowerCase()) ||
    provider.cuit.toLowerCase().includes(criterio.toLowerCase())
  );
  renderProviders(filteredProviders);
});
inputModalProduct.addEventListener("input", (e) => {
  const criterio = e.target.value;
  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(criterio.toLowerCase())
  );
  renderProducts(filteredProducts);
});
ptoVta.addEventListener("focusout", () => {
  if (ptoVta.value.length < 4) {
    ptoVta.value = ptoVta.value.padStart(4, "0");
  }
  nroComp.focus();
});
nroComp.addEventListener("focusout", () => {
  if (nroComp.value.length < 8) {
    nroComp.value = nroComp.value.padStart(8, "0");
  }
  fechaCompra.focus();
});
btnCobrar.addEventListener("click", collect);
