const lastProvider = async () => {
  const res = await window.prismaFunctions.getProviders();
  if (res.success) {
    const providers = res.providers;
    if (providers.length > 0) {
      const lastProvider = providers.pop();
      const lastCode = Number(lastProvider.codigo) + 1;
      document.getElementById("companyCode").value = lastCode.toString().padStart(3, "0");
    } else {
      document.getElementById("companyCode").value = "001";
    }
  }
};

const newProvider = async () => {
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
  } else {
    const res = await window.prismaFunctions.addProvider(providerData);
    if (res.success) {
      window.prismaFunctions.showMSG("info", "Prisma", res.message);
      window.close();
    } else {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
    }
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await lastProvider();
});
