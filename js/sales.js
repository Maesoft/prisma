const inputModalClients = document.getElementById("inputModalClients");
const inputCodigoCliente = document.getElementById("inputCodigoCliente");
const labelNombreCliente = document.getElementById("nombreCliente");
const inputCodigoProducto = document.getElementById("codigoProducto");
const inputModalProduct = document.getElementById("inputModalProducts");
const fechaVenta = document.getElementById("fechaVenta");
const fechaActual = new Date().toISOString().split("T")[0];
const codigoProducto = document.getElementById("codigoProducto");

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
        <td colspan="4">No se encontraron clientes.</td>
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
          class="w-25"
        />
      </td>
      <td>
      <select>
      <option>${product.precio1.toFixed(2)}</option>
      <option>${product.precio2.toFixed(2)}</option> 
      </select>
      </td>
      <td>${(product.precio1 * product.cantidad).toFixed(2)}      
        <button class="btn" data-index="${index}">✖</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
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
  }
});

inputModalClients.addEventListener("input", (e) => {
  const criterio = e.target.value;
  const filteredClients = clients.filter((client) =>
    client.razon_social.toLowerCase().includes(criterio.toLowerCase())
  );
  renderClients(filteredClients);
});
