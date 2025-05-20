const btnSave = document.getElementById("btnSave");

const saveData = async () => {
  const optionData = {
    nombre: document.getElementById("nombreEmpresa").value,
    cuit: document.getElementById("cuitEmpresa").value,
    domicilio: document.getElementById("domicilioEmpresa").value,
    telefono: document.getElementById("telefonoEmpresa").value,
    logo: document.getElementById("logoEmpresa").fileName,
    regimen: document.getElementById("regimenFiscal").value,
  };

  const res = await window.prismaFunctions.saveOption(optionData);
  window.prismaFunctions.showMSG("info", "Prisma", res.message);
  window.close();
};
const loadData = async () => {
  try {
    const res = await window.prismaFunctions.loadOption();
    if (!res.success) {
      window.prismaFunctions.showMSG(
        "info",
        "Prisma",
        "Debe cargar los datos de su empresa para que estos aparezcan en el encabezado de los comprobantes.",
        ["Aceptar"],
        0
      );
      return;
    }

    const { nombre, cuit, domicilio, telefono, logo, regimen } = res.options;
    document.getElementById("nombreEmpresa").value = nombre;
    document.getElementById("cuitEmpresa").value = cuit;
    document.getElementById("domicilioEmpresa").value = domicilio;
    document.getElementById("telefonoEmpresa").value = telefono;
    document.getElementById("logoEmpresa").textContent = logo;
    document.getElementById("regimenFiscal").value = regimen;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
logoEmpresa.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      logoEmpresa.fileName = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

btnSave.addEventListener("click", saveData);
loadData();
