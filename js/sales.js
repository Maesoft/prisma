const inputModalClients = document.getElementById("inputModalClients");
const inputCodigoCliente = document.getElementById("inputCodigoCliente");
const labelNombreCliente = document.getElementById("nombreCliente");
const inputCodigoProducto = document.getElementById("codigoProducto");
const inputModalProduct = document.getElementById("inputModalProducts");
const tipoComprobante = document.getElementById("tipoComprobante");
const tablaProductos = document.getElementById("tablaProductos");
const ptoVta = document.getElementById("ptoVta");
const nroComp = document.getElementById("nroComp");
const observacion = document.getElementById("observacion");
const fechaVenta = document.getElementById("fechaVenta");
const fechaActual = new Date().toISOString().split("T")[0];
const codigoProducto = document.getElementById("codigoProducto");
const btnCobrar = document.getElementById("btnCobrar");
const subtotalDisplay = document.getElementById("subtotal-display");
const totalDisplay = document.getElementById("total-display");
const impuestosDisplay = document.getElementById("impuestos-display");

let total = 0;
let idClient = 0;
let clients = [];
let products = [];
let productsSales = [];
let saleDetail = [];

fechaVenta.value = fechaActual;
inputCodigoCliente.focus();

const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}-${mes}-${anio}`;
};
const loadClients = async () => {
  try {
    const res = await window.prismaFunctions.getClients();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Error", res.message);
      return;
    }
    clients = res.clients;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Error", error);
  }
};
const renderClients = (arrClients) => {
  const listClient = document.getElementById("listClient");
  listClient.innerHTML = "";
  if (arrClients.length === 0) {
    listClient.innerHTML = `
      <tr>
        <td colspan="4">No se encontraron clientes.</td>
      </tr>`;
    return;
  }
  arrClients.forEach((client) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${client.codigo}</td>
        <td>${client.razon_social}</td>
        <td>${client.cuit}</td>
        <td>${client.regimen}</td>`;
    row.addEventListener("click", () => {
      idClient = client.id;
      inputCodigoCliente.value = client.codigo;
      labelNombreCliente.textContent = client.razon_social;
      const modalClients = bootstrap.Modal.getInstance(
        document.getElementById("modalClients")
      );
      modalClients.hide();
    });
    listClient.appendChild(row);
  });
};
const loadProducts = async () => {
  try {
    const res = await window.prismaFunctions.getProducts();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Error", res.message);
      return;
    }
    products = res.products;
    console.log(products);
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
      addProductToSale(product);
      const modalProducts = bootstrap.Modal.getInstance(
        document.getElementById("modalProducts")
      );
      calculateTotal();
      modalProducts.hide();
    });
    listProducts.appendChild(row);
  });
};
const renderProductSales = () => {
  // Antes de limpiar, guardar las cantidades y precios actuales del DOM
  document.querySelectorAll("#tablaProductos tr").forEach((row) => {
    const codigo = row.querySelector(".codigo")?.textContent;
    const cantidadInput = row.querySelector(".cantidad-input");
    const precioInput = row.querySelector(".precio-select, .precio-input");

    const producto = productsSales.find((p) => p.codigo === codigo);
    if (producto) {
      producto.cantidad = parseFloat(cantidadInput?.value) || 1;
      producto.precio_unitario = parseFloat(precioInput?.value) || 0;
    }
  });

  tablaProductos.innerHTML = "";

  productsSales.forEach((product, index) => {
    const row = createProductRow(product, index);
    tablaProductos.appendChild(row);
  });

  attachEventListeners();
  calculateTotal();
};
const createProductRow = (product, index) => {
  const row = document.createElement("tr");
  row.style.height = "12px";
  row.style.border = "1px solid #d3d3d3";
  row.style.borderRadius = "6px";

  const precios = Array.isArray(product.precios) ? product.precios : [];
  const selectedPrice = product.precio_unitario ?? precios[0]?.precio ?? 0;

  const precioInputOrSelect =
    precios.length > 0
      ? `
        <select 
          class="precio-select form-control text-center" 
          data-index="${index}" 
          style="font-size: 0.7rem; height: 16px; padding: 0px 4px; line-height: 1; border: 1px solid #ccc; margin: auto; width: auto; min-width: 60px;"
        >
          ${getSortedPriceOptions(precios, selectedPrice)}
        </select>
      `
      : `
        <input 
          type="number" 
          value="${selectedPrice}" 
          min="0" 
          step="1"
          class="precio-input form-control text-center" 
          style="font-size: 0.7rem; height: 16px; padding: 0px 4px; line-height: 1; border: 1px solid #ccc; margin: auto; width: auto; min-width: 60px;"
          data-index="${index}" 
          onkeyup="updateSubTotal(event)"
          size="6"
        />
      `;

  row.innerHTML = `
    <td class="codigo text-center small p-1" style="font-size: 0.7rem; line-height: 1;">${product.codigo}</td>
    <td class="small p-1" style="font-size: 0.7rem; line-height: 1; padding-left: 4px;">${product.nombre}</td>
    <td class="text-center p-1" style="width: auto;">
      <input 
        type="number" 
        value="${product.cantidad}" 
        min="1" 
        max="${product.stock}" 
        data-index="${index}" 
        class="cantidad-input form-control text-center"
        style="font-size: 0.7rem; height: 16px; padding: 0px 2px; line-height: 1; border: 1px solid #ccc; margin: auto; width: auto; min-width: 100px;"
        size="3"
      />
    </td>
    <td class="text-center p-1" style="width: auto;">
      ${precioInputOrSelect}
    </td>
    <td class="total-cell text-end small fw-semibold p-1" style="font-size: 0.7rem; line-height: 1.5; padding-right: 4px;"></td>
    <td class="text-center p-1" style="width: 40px;">
      <button 
        class="btn btn-dark btn-sm p-0 btn-remove d-flex align-items-center justify-content-center" 
        style="width: 16px; height: 16px; font-size: 0.6rem; line-height: 1; margin: 0;" 
        data-index="${index}"
      >
        ✖
      </button>
    </td>
  `;

  // Lógica de subtotal para select o input
  const priceElement =
    row.querySelector(".precio-select") || row.querySelector(".precio-input");
  if (priceElement) {
    updateSubTotal({ target: priceElement });
  }

  return row;
};
const getSortedPriceOptions = (precios, selectedPrice = 0) => {
  const sorted = [...precios].sort((a, b) => {
    const strA = String(a.titulo);
    const strB = String(b.titulo);

    const isANumber = /^\d/.test(strA);
    const isBNumber = /^\d/.test(strB);

    if (isANumber && !isBNumber) return 1;
    if (!isANumber && isBNumber) return -1;

    return strA.localeCompare(strB, "es", { numeric: true });
  });

  return sorted
    .map(
      (price) => `
      <option value="${price.precio}" ${
        price.precio == selectedPrice ? "selected" : ""
      }>
        ${price.titulo} - $ ${price.precio.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
      </option>
    `
    )
    .join("");
};
const attachEventListeners = () => {
  document.querySelectorAll(".cantidad-input").forEach((input) => {
    input.addEventListener("input", updateSubTotal);
  });

  document.querySelectorAll(".precio-select").forEach((select) => {
    select.addEventListener("change", updateSubTotal);
    select.addEventListener("contextmenu", replaceSelect);
  });

  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", deleteItem);
  });
};
const replaceSelect = (event) => {
  const select = event.currentTarget;
  const input = document.createElement("input");
  input.type = "number";
  input.step = "1";
  input.className = "precio-input form-control text-center";
  input.value = select.value;
  input.style.cssText = `font-size: 0.7rem; height: 16px; padding: 0px 4px; line-height: 1; border: 1px solid #ccc; margin: 0; width: auto; min-width: 60px;`;
    
          
  // Reemplazar el select por el input
  select.parentNode.replaceChild(input, select);
  input.focus();
  input.select();
  input.addEventListener("keyup", (e) => {
      updateSubTotal({ target: e.currentTarget });
  });
};
const deleteItem = (event) => {
  const target = event.target;
  const row = target.closest("tr");
  const rowIndex = Array.from(tablaProductos.rows).indexOf(row);

  if (rowIndex === -1) return;

  const productToRemove = productsSales[rowIndex];
  if (productToRemove) {
    productsSales = productsSales.filter(
      (product, index) => index !== rowIndex
    );
  }

  const saleDetailIndex = saleDetail.findIndex(
    (detail) => detail.producto === productToRemove.nombre
  );
  if (saleDetailIndex !== -1) {
    saleDetail.splice(saleDetailIndex, 1);
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
  const precioSelect = row.querySelector(".precio-select, .precio-input");
  const totalCell = row.querySelector(".total-cell");

  if (!cantidadInput || !precioSelect || !totalCell) {
    console.error(
      "No se encontraron los elementos necesarios en la fila:",
      row
    );
    return;
  }

  const cantidad = parseFloat(cantidadInput.value) || 0;
  const precio = parseFloat(precioSelect.value) || 0;
  const subtotal = cantidad * precio;

  totalCell.textContent = subtotal.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Actualizar la cantidad en el array productsSales
  const index = parseInt(cantidadInput.dataset.index);
  if (productsSales[index]) {
    productsSales[index].cantidad = cantidad;
    productsSales[index].precio_unitario = precio;
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

  if (subtotalDisplay) {
    subtotalDisplay.textContent = ` $ ${subtotal.toLocaleString("es-AR", {
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
const calculateImpuestos = () => {
  const impuestosAgrupados = [];

  productsSales.forEach((product, index) => {
    const cantidad = product.cantidad || 0;
    const precioUnitario = parseFloat(
      document.querySelectorAll(".precio-select , .precio-input")[index]?.value || 0
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
      div.className = "text-end";
      div.innerHTML = `<strong>${nombre}:</strong> $ ${valor.toLocaleString(
        "es-AR",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}`;
      impuestosDisplay.appendChild(div);
    });
  }
  return Object.values(impuestosAgrupados).reduce((acc, val) => acc + val, 0);
};
const addProductToSale = (product) => {
  const existingProduct = productsSales.find(
    (p) => p.codigo === product.codigo
  );
  const price = product.precios?.[0]?.precio || product.precio || 0;

  if (product.controla_stock) {
    if (product.stock <= 0) {
      return window.prismaFunctions.showMSG(
        "info",
        "Prisma",
        `El producto ${product.nombre} no tiene stock suficiente.`
      );
    }

    if (existingProduct) {
      if (existingProduct.cantidad >= existingProduct.stock) {
        return window.prismaFunctions.showMSG(
          "info",
          "Prisma",
          `Hay solo ${product.stock} unidades de el producto ${product.nombre}.`
        );
      }
      existingProduct.cantidad += 1;
    } else {
      addNewProduct(product, price);
    }
  } else {
    // Producto sin control de stock
    if (existingProduct) {
      existingProduct.cantidad += 1;
    } else {
      addNewProduct(product, price);
    }
  }
  renderProductSales();
};
const addNewProduct = (product, price) => {
  productsSales.push({
    id: product.id,
    codigo: product.codigo,
    nombre: product.nombre,
    controla_stock: product.controla_stock,
    stock: product.controla_stock ? product.stock : null,
    cantidad: 1,
    precios: product.precios,
    impuestos: product.impuestos,
    total: price,
    precio_unitario: price,
  });
};
const collect = async () => {
  if (!isValidSaleData()) return;
  if (!hasSufficientStock()) return;

  const saleData = buildSaleData();

  const isBudget =
    tipoComprobante.selectedOptions[0].innerText === "Presupuesto";

  const detalle = buildSaleDetail();

  if (isBudget) {
    await handleBudgetSale(detalle);
  } else {
    await handleRealSale(saleData, detalle);
  }
};
const isValidSaleData = () => {
  if (!inputCodigoCliente.value || total === 0 || !fechaVenta.value) {
    window.prismaFunctions.showMSG(
      "error",
      "Error",
      "Verifique si ingresó un cliente, productos y una fecha válida."
    );
    return false;
  }
  return true;
};
const hasSufficientStock = () => {
  for (const product of productsSales) {
    if (product.controla_stock && product.stock < product.cantidad) {
      window.prismaFunctions.showMSG(
        "info",
        "Stock Faltante",
        `El producto ${product.nombre} no tiene suficiente stock.`
      );
      return false;
    }
  }
  return true;
};
const buildSaleData = () => ({
  fecha: fechaVenta.value,
  tipo_comprobante: tipoComprobante.value,
  numero_comprobante: `${ptoVta.value}-${nroComp.value}`,
  client: idClient,
  total: total,
  observacion: observacion.value,
});
const buildSaleDetail = () => {
  const detalle = [];
  for (let i = 0; i < tablaProductos.rows.length; i++) {
    const row = tablaProductos.rows[i];
    const precioUnitarioSelect = row.cells[3].querySelector("select, input");
    const cantidadInput = row.cells[2].querySelector("input");

    detalle.push({
      producto: row.cells[1].innerText,
      cantidad: String(cantidadInput.value).replace(",", "."),
      precio_unitario: parseFloat(precioUnitarioSelect.value),
      subtotal: parseFloat(
        row.cells[4].innerText.replace(/\./g, "").replace(",", ".")
      ),
    });
  }
  return detalle;
};
const handleBudgetSale = async (detalle) => {
  saleDetail.length = 0;
  saleDetail.push(...detalle);
  await printSale();
  cleanFields();
};
const handleRealSale = async (saleData, detalle) => {
  try {
    const saleResponse = await window.prismaFunctions.addSale(saleData);
    const saleId = saleResponse.saleId;

    if (!saleId) throw new Error("No se pudo obtener el ID de la venta.");

    const detalleConVenta = detalle.map((item) => ({
      ...item,
      sale: saleId,
    }));

    saleDetail.length = 0;
    saleDetail.push(...detalleConVenta);

    await window.prismaFunctions.addDetailSale(detalleConVenta);
    await updateStock();
    await updateTax(saleId);
    await printSale(saleId);
    cleanFields();
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const cleanFields = () => {
  productsSales = [];
  saleDetail = [];
  ptoVta.value = "";
  nroComp.value = "";
  observacion.value = "";
  inputCodigoCliente.value = "";
  labelNombreCliente.textContent = "";
  total = 0;
  idClient = 0;
  tablaProductos.innerHTML = "";
  impuestosDisplay.innerHTML = "";
  subtotalDisplay.textContent = "0.00";
  totalDisplay.textContent = "0.00";
  getLastInvoice();
};
const printSale = async (saleId) => {
  const resInvoices = await window.prismaFunctions.getSales();
  if (!resInvoices.success) {
    window.prismaFunctions.showMSG("error", "Prisma", "Ocurrio un error al guardar la factura. Cierre el programa y vuelva a intentarlo. Verifique si la factura se guardó en Ventas > Facturas.");
    return;
  }
  const invoiceToPrint = resInvoices.sales.find(
    (invoice) => invoice.id === saleId )

 invoiceToPrint.subtotal = invoiceToPrint.details.reduce(
    (acc, item) => acc + item.subtotal,
    0
  );
  console.log(invoiceToPrint);
  
  if (Array.isArray(invoiceToPrint.impuestos)) {
    const htmlImpuestos = invoiceToPrint.impuestos.map((imp) => {
      return `
      <div class="d-flex justify-content-between">
          <strong>${imp.nombre} ${imp.porcentaje}%:</strong>
          <span>$ ${imp.monto.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
          })}</span>
      </div>
      `;
      
    });

    invoiceToPrint.impuestos = htmlImpuestos.join("");
  }
  if (tipoComprobante.selectedOptions[0].innerText.includes("Ticket")) {

    window.prismaFunctions.openWindow({
      windowName: "printTicket",
      width: 200,
      height: 550,
      frame: true,
      modal: false,
      data: invoiceToPrint,
    });
  } else {
    window.prismaFunctions.openWindow({
      windowName: "printInvoice",
      width: 450,
      height: 700,
      frame: true,
      modal: false,
      data: invoiceToPrint,
    });
  }
};
const updateStock = async () => {
  for (const product of productsSales) {
    if (!product.controla_stock) continue;

    const cantidad = parseFloat(product.cantidad);
    const nuevoStock = product.stock - cantidad;

    const productData = { stock: nuevoStock };

    const stockData = {
      producto: { id: product.id },
      detalle: `Venta - ${tipoComprobante.value}${ptoVta.value}-${nroComp.value}`,
      operacion: "Egreso",
      cantidad: -cantidad,
      stockResultante: nuevoStock,
    };

    await window.prismaFunctions.editProduct(product.id, productData);
    await window.prismaFunctions.addStock(stockData);
  }
};

const updateTax = async (saleId) => {
  const divs = impuestosDisplay.querySelectorAll("div");

  for (const div of divs) {
    const text = div.textContent.trim(); // "Iva 21%: $ 33.600,00"
    const match = text.match(/^(.+?)\s(\d+(?:[.,]\d+)?)%:\s\$?\s?([\d.,]+)/);

    if (match) {
      const nombre = match[1].trim();
      const porcentaje = parseFloat(match[2]);
      const monto = parseFloat(match[3].replace(/\./g, "").replace(",", "."));

      const taxData = [{ nombre, porcentaje, monto, sale: saleId }];
      try {
       
        const res = await window.prismaFunctions.addTaxSale(taxData);

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
const getLastInvoice = async () => {
  const resInvoices = await window.prismaFunctions.getSales();

  if (!resInvoices.sales || resInvoices.sales.length < 1) {
    ptoVta.value = "0000";
    nroComp.value = "00000001";
    return;
  }
  const lastInvoice = resInvoices.sales.pop();
  tipoComprobante.value = lastInvoice.tipo_comprobante;
  const [ptoVtaPart, nroCompPart] = lastInvoice.numero_comprobante.split("-");

  const formattedPtoVta = ptoVtaPart.padStart(4, "0");
  const formattedNroComp = (parseInt(nroCompPart) + 1)
    .toString()
    .padStart(8, "0");
  ptoVta.value = formattedPtoVta;
  nroComp.value = formattedNroComp;
};
inputCodigoCliente.addEventListener("keyup", async (event) => {
  if (event.key === "F3") {
    const clientSearchModal = new bootstrap.Modal(
      document.getElementById("modalClients")
    );
    clientSearchModal.show();
    await loadClients();
    renderClients(clients);
    setTimeout(() => inputModalClients.focus(), 200);
  }
  if (event.key === "Enter") {
    await loadClients();
    const codeToSearch = clients.find(
      (client) => client.codigo == inputCodigoCliente.value
    );
    if (!codeToSearch) {
      inputCodigoCliente.value = "";
      inputCodigoCliente.focus();
      labelNombreCliente.textContent = "Cliente no encotrado.";
    } else {
      idClient = codeToSearch.id;
      labelNombreCliente.textContent = codeToSearch.razon_social;
      codigoProducto.focus();
    }
  }
});
inputCodigoCliente.addEventListener("focusout", async () => {
  await loadClients();
  const codeToSearch = clients.find(
    (client) => client.codigo == inputCodigoCliente.value
  );
  if (!codeToSearch) {
    inputCodigoCliente.value = "";
    labelNombreCliente.textContent = "Cliente no encotrado.";
  } else {
    idClient = codeToSearch.id;
    labelNombreCliente.textContent = codeToSearch.razon_social;
    codigoProducto.focus();
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
    addProductToSale(codeToSearch);
    inputCodigoProducto.value = "";
    inputCodigoProducto.focus();
    calculateTotal();
  }
});
inputModalClients.addEventListener("input", (e) => {
  const criterio = e.target.value;
  const filteredClients = clients.filter((client) =>
    client.razon_social.toLowerCase().includes(criterio.toLowerCase())
  );
  renderClients(filteredClients);
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
});
btnCobrar.addEventListener("click", collect);
document.addEventListener("DOMContentLoaded", getLastInvoice);
