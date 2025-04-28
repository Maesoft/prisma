const inputCodigo = document.getElementById("codigoCaja");
const inputNombre = document.getElementById("nombreCaja");

const newCash = async () => {
    if (!inputCodigo.value || !inputNombre.value) {
        window.prismaFunctions.showMSG(
            "error",
            "Error",
            "Por favor, complete todos los campos.",
            ["Aceptar"],
            0
        );
        return;
        
    }
    const cashData = {
        codigo: inputCodigo.value,
        nombre: inputNombre.value,
    };
    const response = await window.prismaFunctions.addCash(cashData);
    console.log(response);
    
    if (response) {
        window.prismaFunctions.showMSG(
            "success",
            "Éxito",
            "Caja creada con éxito.",
            ["Aceptar"],
            0
        );
        inputCodigo.value = "";
        inputNombre.value = "";
    } else {
        window.prismaFunctions.showMSG(
            "error",
            "Error",
            "Error al crear la caja.",
            ["Aceptar"],
            0
        );
    }
}