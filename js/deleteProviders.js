const providersTableBody = document.getElementById("listProviders")
const input = document.getElementById("searchInput")
let providers = [];

const loadProviders = async () => {
  try {
    const response = await window.prismaFunctions.getProviders()
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
    providers = response.providers;
    renderProviders(providers);
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
  }
};
const renderProviders = (providersList) => {
    providersTableBody.innerHTML = "";
  if (providersList.length === 0) {
    providersTableBody.innerHTML = `
        <tr>
          <td colspan="4">No se encontraron proveedores.</td>
        </tr>`;
    return;
  }
  providersList.forEach((provider) => {
    const row = document.createElement("tr");
    row.setAttribute("data-id", provider.id);
    row.innerHTML = `
          <td>${provider.codigo}</td>
          <td>${provider.razon_social}</td>
          <td>${provider.cuit}</td>
          <td>${provider.regimen}</td>`;
    row.addEventListener("click", async () => {
      const resMSG = await window.prismaFunctions.showMSG(
        "question",
        "Prisma",
        `¿Esta seguro que desea eliminar el proveedor ${provider.razon_social}? Tambien se eliminaran todos sus movimientos.`,
        ["Si", "No"],
        0
      );
      if (resMSG == 0) deleteProviders(provider);
    });
    providersTableBody.appendChild(row);
  });
};
const deleteProviders = async (provider) => {
  try {
    const res = await window.prismaFunctions.deleteProvider(provider.id);
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
    loadProviders()
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
  const filteredProviders = providers.filter((provider) =>
    provider.razon_social.toLowerCase().includes(input.value.toLowerCase()) ||
    provider.codigo.toLowerCase().includes(input.value.toLowerCase()) ||
    provider.cuit.toLowerCase().includes(input.value.toLowerCase())
  );
  renderProviders(filteredProviders);
})
loadProviders();
