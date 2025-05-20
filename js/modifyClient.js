let idClient = 0;
let allClients = [];

const loadClients = async () => {
  try {
    const res = await window.prismaFunctions.getClients();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    allClients = res.clients;
    renderClients(allClients);
  } catch (error) {
      window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const renderClients = (arrClients) => {
  const listClients = document.getElementById("listClients");
  listClients.innerHTML = "";
  if (arrClients.length === 0) {
    listClients.innerHTML = `
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
    listClients.appendChild(row);
    row.addEventListener("click", () => {
      loadToForm(client);
      document.getElementById("modalClients").style.display = "none";
    });
  });
};
const loadToForm = (client) => {
  idClient = client.id;
  document.getElementById("companyCode").value = client.codigo;
  document.getElementById("companyName").value = client.razon_social;
  document.getElementById("cuit").value = client.cuit;
  document.getElementById("address").value = client.direccion;
  document.getElementById("phone").value = client.telefono;
  document.getElementById("email").value = client.email;
  document.getElementById("regimen").value = client.regimen;
};
const updateClient = async () => {
  const clientData = {
    codigo: document.getElementById("companyCode").value,
    razon_social: document.getElementById("companyName").value,
    cuit: document.getElementById("cuit").value,
    direccion: document.getElementById("address").value,
    telefono: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    regimen: document.getElementById("regimen").value,
  };

  if (!clientData.codigo.trim() || !clientData.razon_social.trim()) {
    window.prismaFunctions.showMSG(
      "info",
      "Prisma",
      "Los campos Codigo y Razon Social son obligatorios."
    );
    return;
  }
  try {
    const res = await window.prismaFunctions.editClient(
      idClient,
      clientData
    );
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }else {
      window.prismaFunctions.showMSG(
        "success",
        "Prisma",
        "Cliente actualizado correctamente."
      );
    }
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const searchClient = async () => {
  const searchInput = document.getElementById("inputModalClients").value;
  const clientsFiltered = allClients.filter((client) =>
    client.razon_social.toLowerCase().includes(searchInput.toLowerCase())
  );
  renderClients(clientsFiltered);
};
loadClients();
