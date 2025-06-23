const lastClient = async () => {
  const res = await window.prismaFunctions.getClients();
  if (res.success) {
    const clients = res.clients;
    if (clients.length > 0) {
      const lastClient = clients.pop();
      const lastCode = Number(lastClient.codigo) + 1;
      document.getElementById("companyCode").value = lastCode.toString().padStart(3, "0");
    } else {
      document.getElementById("companyCode").value = "001";
    }
  }else {
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      res.message,
      ["Aceptar"],
      0
    );
  }
};
const newClient = async () => {
  const clientData = {
    codigo: document.getElementById("companyCode").value.trim(),
    razon_social: document.getElementById("companyName").value.trim(),
    cuit: document.getElementById("cuit").value.trim() || "",
    direccion: document.getElementById("address").value.trim(),
    telefono: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    regimen: document.getElementById("regimen").value.trim(),
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

document.addEventListener("DOMContentLoaded", lastClient);