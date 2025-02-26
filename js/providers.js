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
  if (!providerData.codigo.trim() || !providerData.razon_social.trim()){
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
