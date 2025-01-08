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
const totalDisplay = document.getElementById("total");

let total = 0;
let idClient = 0;
let clients = [];
let products = [];
let productsSales = [];
let saleDetail = [];

fechaVenta.value = fechaActual;
inputCodigoCliente.focus();

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
  tablaProductos.innerHTML = "";

  productsSales.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="codigo">${product.codigo}</td>
      <td>${product.nombre}</td>
      <td>
        <input 
          type="number" 
          value="${product.cantidad}" 
          min="1" 
          max="${product.stock}"
          data-index="${index}" 
          class="cantidad-input h-25 w-50"
        />
      </td>
      <td>
        <select class="precio-select" data-index="${index}">
          <option value="${product.precio1}">
          ${product.precio1.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</option>
          <option value="${product.precio2}">
          ${product.precio2.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</option>
        </select>
      </td>
      <td class="total-cell">
      ${(product.precio1 * product.cantidad).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</td>
      <td><button class="btn btn-remove" data-index="${index}">✖</button></td>
    `;

    tablaProductos.appendChild(row);
  });

  // Actualizar totales cuando cambie la cantidad o el precio seleccionado
  const cantidadInputs = document.querySelectorAll(".cantidad-input");
  const precioSelects = document.querySelectorAll(".precio-select");

  cantidadInputs.forEach((input) => {
    input.addEventListener("input", updateSubTotal);
  });

  precioSelects.forEach((select) => {
    select.addEventListener("change", updateSubTotal);
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

  const productToRemove = productsSales[rowIndex];
  if (productToRemove) {
    productsSales = productsSales.filter((product, index) => index !== rowIndex);
  }

  const saleDetailIndex = saleDetail.findIndex((detail) => detail.producto === productToRemove.nombre);
  if (saleDetailIndex !== -1) {
    saleDetail.splice(saleDetailIndex, 1);
  }

  row.remove();
  calculateTotal();
};

const updateSubTotal = (event) => {
  const target = event.target; // Elemento que disparó el evento
  const row = target.closest("tr"); // Obtén la fila más cercana al elemento

  if (!row) {
    console.error("No se encontró la fila asociada.");
    return;
  }

  const cantidadInput = row.querySelector(".cantidad-input");
  const precioSelect = row.querySelector(".precio-select");
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
  }

  calculateTotal();
};
const calculateTotal = () => {
  const totalCells = document.querySelectorAll(".total-cell");
  total = 0;

  totalCells.forEach((cell) => {
    const subtotal =
      parseFloat(cell.textContent.replace(/\./g, "").replace(",", ".")) || 0;
    total += subtotal;
  });

  if (totalDisplay) {
    totalDisplay.textContent = total.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
};
const addProductToSale = (product) => {
  if (product.stock > 0) {
    const existingProduct = productsSales.find(
      (item) => item.codigo === product.codigo
    );
    if (existingProduct) {
      if (product.stock > product.cantidad) existingProduct.cantidad += 1;
    } else {
      productsSales.push({
        id: product.id,
        codigo: product.codigo,
        nombre: product.nombre,
        stock: product.stock,
        cantidad: 1,
        costo: product.costo,
        precio1: product.precio1,
        precio2: product.precio2,
        total: product.precio,
      });
    }
    renderProductSales();
  } else {
    window.prismaFunctions.showMSG(
      "info",
      "Stock Faltante",
      `El producto ${product.nombre} no tiene stock suficiente.`
    );
  }
};
const collect = async () => {
  if (!inputCodigoCliente.value || total === 0 || !fechaVenta.value) {
    window.prismaFunctions.showMSG(
      "error",
      "Error",
      "Verifique si ingresó un cliente, productos y una fecha válida."
    );
    return;
  }
  for (const product of productsSales) {
    if (product.stock < product.cantidad) {
      window.prismaFunctions.showMSG(
        "info",
        "Stock Faltante",
        `El producto ${product.nombre} no tiene suficiente stock.`
      );
      return;
    }
  }
  const saleData = {
    fecha: fechaVenta.value,
    tipo_comprobante: tipoComprobante.value,
    numero_comprobante: `${ptoVta.value}-${nroComp.value}`,
    client: idClient,
    total: total,
    observacion: observacion.value,
  };

  try {
    const saleResponse = await window.prismaFunctions.addSale(saleData);
    const saleId = saleResponse.saleId;

    if (!saleId) {
      throw new Error("No se pudo obtener el ID de la venta.");
    }

    for (let i = 0; i < tablaProductos.rows.length; i++) {
      const row = tablaProductos.rows[i];
      const precioUnitarioSelect = row.cells[3].querySelector("select");
      const cantidadInput = row.cells[2].querySelector("input");

      saleDetail.push({
        producto: row.cells[1].innerText,
        cantidad: parseInt(cantidadInput.value),
        precio_unitario: parseFloat(precioUnitarioSelect.value),
        subtotal: parseFloat(
          row.cells[4].innerText.replace(/\./g, "").replace(",", ".")
        ),
        sale: saleId,
      });
    }
    await window.prismaFunctions.addDetail(saleDetail);
    updateStock();
    cleanFields();
    printSale();
  } catch (error) {
    console.error("Error al registrar la venta y sus detalles:", error);
    alert("Ocurrió un error al registrar la venta. Intente nuevamente.");
  }
};
const cleanFields = () => {
  productsSales = [];
  saleDetail = [];
  ptoVta.value = "";
  nroComp.value = "";
  inputCodigoCliente.value = "";
  labelNombreCliente.textContent = "";
  total = 0;
  idClient = 0;
  tablaProductos.innerHTML = "";
  totalDisplay.textContent = "0.00";
  getLastInvoice();
};
const printSale = () => {
  
window.print()
};
const updateStock = () => {
  productsSales.forEach(async (product) => {
    const productData = {
      stock: product.stock - product.cantidad,
    };
    const stockData = {
      producto: { id: product.id },
      detalle: `Venta - ${tipoComprobante.value + ptoVta.value}-${
        nroComp.value
      }`,
      operacion: "Egreso",
      cantidad: -product.cantidad,
      stockResultante: product.stock - product.cantidad,
    };

    await window.prismaFunctions.editProduct(product.id, productData);
    await window.prismaFunctions.addStock(stockData);
  });
};
const getLastInvoice = async () => {
  const resInvoices = await window.prismaFunctions.getSales();

  if (!resInvoices.sales || resInvoices.sales.length < 1) {
    ptoVta.value = "0000";
    nroComp.value = "00000001";
    return;
  }
  const lastInvoice = resInvoices.sales.pop();

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
btnCobrar.addEventListener("click", collect);
document.addEventListener("DOMContentLoaded", getLastInvoice);
