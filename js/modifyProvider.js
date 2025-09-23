let idProvider = 0;
let allProviders = [];

const loadProviders = async () => {
  try {
    const res = await window.prismaFunctions.getProviders();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    allProviders = res.providers;
    renderProviders(allProviders);
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
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
    listProviders.appendChild(row);
    row.addEventListener("click", () => {
      loadToForm(provider);
      document.getElementById("modalProviders").style.display = "none";
    });
  });
};
const loadToForm = (provider) => {
  idProvider = provider.id;
  document.getElementById("companyCode").value = provider.codigo;
  document.getElementById("companyName").value = provider.razon_social;
  document.getElementById("cuit").value = provider.cuit;
  document.getElementById("address").value = provider.direccion;
  document.getElementById("phone").value = provider.telefono;
  document.getElementById("email").value = provider.email;
  document.getElementById("regimen").value = provider.regimen;
};
const updateProvider = async () => {
  const providerData = {
    codigo: document.getElementById("companyCode").value,
    razon_social: document.getElementById("companyName").value,
    cuit: document.getElementById("cuit").value,
    direccion: document.getElementById("address").value,
    telefono: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    regimen: document.getElementById("regimen").value,
  };

  if (!providerData.codigo.trim() || !providerData.razon_social.trim()) {
    window.prismaFunctions.showMSG(
      "info",
      "Prisma",
      "Los campos Codigo y Razon Social son obligatorios."
    );
    return;
  }
  try {
    const res = await window.prismaFunctions.editProvider(
      idProvider,
      providerData
    );
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const searchProvider = async () => {
  const searchInput = document.getElementById("inputModalProviders").value;
  const providersFiltered = allProviders.filter((provider) =>
    provider.razon_social.toLowerCase().includes(searchInput.toLowerCase()) ||
    provider.codigo.toLowerCase().includes(searchInput.toLowerCase()) ||
    provider.cuit.toLowerCase().includes(searchInput.toLowerCase())
  );
  renderProviders(providersFiltered);
};
loadProviders();
