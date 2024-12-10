const searchInput = document.getElementById("searchInput");
const fechaVenta = document.getElementById("fechaVenta");
const fechaActual = new Date().toISOString().split("T")[0];
const inputCodigoCliente = document.getElementById("codigoCliente");

fechaVenta.value = fechaActual;

inputCodigoCliente.focus();

const loadClients = async () => {
  try {
    const res = await window.prismaFunctions.getClients();
    if (!res.success) {
      alert(res.message);
      return;
    }
    const clients = res.clients;
    renderClients(clients);
  } catch (error) {
    alert(error);
  }
};
const renderClients = (clients) => {
  const listClient = document.getElementById("listClient");
  listClient.innerHTML = "";
  clients.forEach((client) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${client.codigo}</td>
        <td>${client.razon_social}</td>
        <td>${client.cuit}</td>
        <td>${client.regimen}</td>`;
    row.addEventListener("click", () => {
      document.getElementById("codigoCliente").value = client.codigo;
      document.getElementById("nombreCliente").textContent = client.razon_social;
      const clientSearchModal = bootstrap.Modal.getInstance(
        document.getElementById("clientSearchModal")
      );
      clientSearchModal.hide();
    });
    listClient.appendChild(row);
  });
};
inputCodigoCliente.addEventListener("keyup", (event) => {
  if (event.key === "F3") {
    const clientSearchModal = new bootstrap.Modal(
      document.getElementById("clientSearchModal")
    );
    clientSearchModal.show();
    loadClients();
  }
});

searchInput.addEventListener("input", async (e) => {
  const criterio = e.target.value;
  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(criterio.toLowerCase())
  );
  renderProducts(filteredProducts);
});
