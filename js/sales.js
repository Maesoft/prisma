const inputModalClients = document.getElementById("inputModalClients");
const inputCodigoCliente = document.getElementById("inputCodigoCliente");
const labelNombreCliente = document.getElementById("nombreCliente");
const inputCodigoProducto = document.getElementById("codigoProducto");
const inputModalProduct = document.getElementById("inputModalProducts");
const tipoComprobante = document.getElementById("tipoComprobante");
const ptoVta = document.getElementById("ptoVta");
const nroComp = document.getElementById("nroComp");
const observacion = document.getElementById("observacion");
const fechaVenta = document.getElementById("fechaVenta");
const fechaActual = new Date().toISOString().split("T")[0];
const codigoProducto = document.getElementById("codigoProducto");
const btnCobrar = document.getElementById("btnCobrar");

let total = 0;
let clients = [];
let products = [];
let productsSales = [];

fechaVenta.value = fechaActual;
inputCodigoCliente.focus();

const loadClients = async () => {
  try {
    const res = await window.prismaFunctions.getClients();
    if (!res.success) {
      alert(res.message);
      return;
    }
    clients = res.clients;
  } catch (error) {
    alert(error);
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
      alert(res.message);
      return;
    }
    products = res.products;
  } catch (error) {
    alert(error);
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
  const tableBody = document.getElementById("tablaProductos");
  tableBody.innerHTML = "";

  if (productsSales.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5">No hay productos en la venta.</td>
      </tr>`;
    return;
  }

  productsSales.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.codigo}</td>
      <td>${product.nombre}</td>
      <td>
        <input 
          type="number" 
          value="${product.cantidad}" 
          min="1" 
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

    tableBody.appendChild(row);
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

  const totalDisplay = document.getElementById("total");
  if (totalDisplay) {
    totalDisplay.textContent = total.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
};
const addProductToSale = (product) => {
  const existingProduct = productsSales.find(
    (item) => item.codigo === product.codigo
  );

  if (existingProduct) {
    existingProduct.cantidad += 1;
  } else {
    productsSales.push({
      codigo: product.codigo,
      nombre: product.nombre,
      cantidad: 1,
      costo: product.costo,
      precio1: product.precio1,
      precio2: product.precio2,
      total: product.precio,
    });
  }

  // Renderiza la tabla actualizada
  renderProductSales();
};
const Collect = () => {
  if (!inputCodigoCliente || !total || !fechaVenta.value) {
    alert("Verifique si ingreso un cliente, un producto y una fecha valida.");
    return;
  }
  const saleData = {
    fecha: fechaVenta.value,
    tipo_comprobante: tipoComprobante.value,
    numero_comprobante: ptoVta.value + "-" + nroComp.value,
    client: {id:inputCodigoCliente.value},
    total: total,
    observacion: observacion.textContent,
  };
  alert(JSON.stringify(saleData));
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
btnCobrar.addEventListener("click", Collect);
