const searchModalClient = document.getElementById("searchModalClient");
const fechaVenta = document.getElementById("fechaVenta");
const fechaActual = new Date().toISOString().split("T")[0];
const inputCodigoCliente = document.getElementById("codigoCliente");
const labelNombreCliente = document.getElementById("nombreCliente");
const codigoProducto = document.getElementById("codigoProducto");

let clients = [];
let products = [];

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
      const clientSearchModal = bootstrap.Modal.getInstance(
        document.getElementById("clientSearchModal")
      );
      clientSearchModal.hide();
    });
    listClient.appendChild(row);
  });
};

inputCodigoCliente.addEventListener("keyup", async (event) => {
  if (event.key === "F3") {
    const clientSearchModal = new bootstrap.Modal(
      document.getElementById("clientSearchModal")
    );
    clientSearchModal.show();
    await loadClients();
    renderClients(clients);
    setTimeout(() => searchModalClient.focus(), 200);
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

searchModalClient.addEventListener("input", (e) => {
  const criterio = e.target.value;
  const filteredClients = clients.filter((client) =>
    client.razon_social.toLowerCase().includes(criterio.toLowerCase())
  );
  renderClients(filteredClients);
});
