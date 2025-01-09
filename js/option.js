const btnSave = document.getElementById("btnSave");
const logoEmpresa = document.getElementById("logoEmpresa");

const saveData = async () =>{
    const optionData ={
    nombre : document.getElementById("nombreEmpresa").value,
    cuit : document.getElementById("cuitEmpresa").value,
    domicilio : document.getElementById("domicilioEmpresa").value,
    telefono : document.getElementById("telefonoEmpresa").value,
    logo : logoEmpresa.src,
    regimen : document.getElementById("regimenFiscal").value,
    }
    
    const res = await window.prismaFunctions.saveOption(optionData)
    console.log(res);
    
    window.prismaFunctions.showMSG("info", "Prisma", res.message)
}
logoEmpresa.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        logoEmpresa.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

btnSave.addEventListener('click', saveData)