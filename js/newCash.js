const inputCodigo = document.getElementById("codigoCaja");
const inputNombre = document.getElementById("nombreCaja");

const newCash = async () => {
    if (!inputCodigo.value || !inputNombre.value) {
        window.prismaFunctions.showMSG("error","Prisma","Por favor, complete todos los campos.");
        return;
    }
    const cashData = {
        codigo: inputCodigo.value,
        nombre: inputNombre.value,
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
