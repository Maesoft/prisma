const inputCodigo = document.getElementById("codigoCaja");
const inputNombre = document.getElementById("nombreCaja");

const newCash = async () => {
    if (!inputCodigo.value || !inputNombre.value) {
        window.prismaFunctions.showMSG("error","Prisma","Por favor, complete todos los campos.");
        return;
    }
    const cashExists = await window.prismaFunctions.getCashes();
    if (!cashExists.success) {
        window.prismaFunctions.showMSG("error","Prisma", cashExists.message)
        return        
    }    
    if(cashExists?.cashes.find(cash => cash.codigo.toLowerCase() === inputCodigo.value.toLowerCase())) {
        window.prismaFunctions.showMSG("error","Prisma","Ya existe una caja con ese código.");
        return;
    }
    if (cashExists?.cashes.find(cash => cash.nombre.toLowerCase() === inputNombre.value.toLowerCase())) {
        window.prismaFunctions.showMSG("error", "Prisma", "Ya existe una caja con ese nombre.");
        return;        
    }
    const cashData = {
        code: inputCodigo.value,
        name: inputNombre.value,
    };
    const response = await window.prismaFunctions.addCash(cashData);
    if (response.success) {
        window.prismaFunctions.showMSG("info", "Prisma", response.message);
        window.close();
    }
    else {
        window.prismaFunctions.showMSG("error", "Prisma", response.message);
    }
}
