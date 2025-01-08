const newClient = async () => {
  const clientData = {
    codigo: document.getElementById("companyCode").value.trim(),
    razon_social: document.getElementById("companyName").value.trim(),
    cuit: document.getElementById("cuit").value.trim(),
    direccion: document.getElementById("address").value,
    telefono: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    regimen: document.getElementById("regimen").value,
  };
  if (!clientData.codigo || !clientData.razon_social) {
    window.prismaFunctions.showMSG(
      "info",
      "Prisma",
      "Los campos Codigo y Razon Social son obligatorios."
    );
  } else {
    const res = await window.prismaFunctions.addClient(clientData);

    if (res.success) {
      window.prismaFunctions.showMSG("info", "Prisma", res.message);
      window.close();
    } else {
      window.prismaFunctions.showMSG("error", "Error", res.message);
    }
  }
};
