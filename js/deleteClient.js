const clientsTableBody = document.getElementById("listClients")
const input = document.getElementById("searchInput")
let clients = [];

const loadClients = async () => {
  try {
    const response = await window.prismaFunctions.getClients()
    if (!response.success) {
      window.prismaFunctions.showMSG(
        "error",
        "Prisma",
        response.message,
        ["Aceptar"],
        0
      );
      return;
    }
    clients = response.clients;
    renderClients(clients);
  } catch (error) {
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      "Error al cargar los clientes",
      ["Aceptar"],
      0
    );
    console.error("Error al obtener los clientes:", error);
  }
};
const renderClients = (clientsList) => {
    clientsTableBody.innerHTML = "";
  if (clientsList.length === 0) {
    clientsTableBody.innerHTML = `
        <tr>
          <td colspan="4">No se encontraron clientes.</td>
        </tr>`;
    return;
  }
  clientsList.forEach((client) => {
    const row = document.createElement("tr");
    row.setAttribute("data-id", client.id);
    row.innerHTML = `
          <td>${client.codigo}</td>
          <td>${client.razon_social}</td>
          <td>${client.cuit}</td>
          <td>${client.regimen}</td>`;
    row.addEventListener("click", async () => {
      const resMSG = await window.prismaFunctions.showMSG(
        "question",
        "Prisma",
        `¿Esta seguro que desea eliminar el cliente ${client.razon_social}? Tambien se eliminaran todos sus movimientos.`,
        ["Si", "No"],
        0
      );
      if (resMSG == 0) deleteClients(client);
    });
    clientsTableBody.appendChild(row);
  });
};
const deleteClients = async (client) => {
  try {
    const res = await window.prismaFunctions.deleteClient(client.id);
    if (!res.success) {
      window.prismaFunctions.showMSG(
        "error",
        "Prisma",
        res.message,
        ["Aceptar"],
        0
      );
      return;
    }
    window.prismaFunctions.showMSG(
      "info",
      "Prisma",
      res.message,
      ["Aceptar"],
      0
    );
    loadClients()
  } catch (error) {
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      error.message,
      ["Aceptar"],
      0
    );
  }
};
input.addEventListener("input",()=>{
  const filteredClients = clients.filter((client) =>
    client.razon_social.toLowerCase().includes(input.value.toLowerCase()) ||
    client.cuit.toLowerCase().includes(input.value.toLowerCase()) ||
    client.codigo.toLowerCase().includes(input.value.toLowerCase())
  );
  renderClients(filteredClients);
})
loadClients();
