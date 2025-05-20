const labelNombreCaja = document.querySelector("#nombreCaja");
const inputCash = document.querySelector("#searchInput");
const inputMontoInicial = document.querySelector("#montoInicial");
const inputFechaHora = document.querySelector("#fechaHora");
const modal = document.querySelector("#cashSearchModal");
let cashId = null;

const getCashes = async () => {
  try {
    const res = await window.prismaFunctions.getCashes();
    if (res.success) {
      return res.cashes;
    } else {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
    }
  } catch (error) {
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      "Error al obtener las cajas."
    );
    console.error("Error al obtener las cajas:", error);
  }
};
const openCash = async () => {
  const cashData = {
    fecha_apertura: new Date(inputFechaHora.value),
    saldo_inicial: inputMontoInicial.value,
    activa: true,
  };
  const res = await window.prismaFunctions.editCash(cashId, cashData);
  if (res.success) {
  } else {
  }
};
const loadForm = (cash) => {
  cashId = cash.id;
  labelNombreCaja.innerText = cash.nombre;
  inputFechaHora.value = new Date().toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
  });
  modal.style.display = "none";
  modal.classList.remove("show", "d-flex", "justify-content-center");
  inputCash.focus();
};
const renderCashesModal = async () => {
  const cashes = await getCashes();
  const cashTable = document.querySelector("#cashTable tbody");
  cashTable.innerHTML = "";
  cashes.forEach((cash) => {
    if (cash.activa) {
      return;
    }
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${cash.codigo}</td>
            <td>${cash.nombre}</td>
            `;
    row.addEventListener("click", () => loadForm(cash));

    cashTable.appendChild(row);
  });
};
document.addEventListener("DOMContentLoaded", () => {
  renderCashesModal();
});
