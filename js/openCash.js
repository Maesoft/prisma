const labelNombreCaja = document.querySelector("#nombreCaja");
const inputCash = document.querySelector("#searchInput");
const inputMontoInicial = document.querySelector("#montoInicial");
const inputFechaHora = document.querySelector("#fechaHora");
const modal = document.querySelector("#cashSearchModal");
let cashId = null;

const formatDateAndTime = () => {
  const now = new Date();

  const pad = (n) => n.toString().padStart(2, "0");

  const fecha = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )}`;
  const hora = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(
    now.getSeconds()
  )}`;

  return `${fecha} ${hora}`; // formato YYYY-MM-DD HH:mm:ss
};
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

  const cashSessionData = {
    cashBox: {id: cashId},
    openedAt: formatDateAndTime(),
    openingAmount: Number(inputMontoInicial.value),
    open: true,
  }

  const resCashSession = await window.prismaFunctions.addCashSession(cashSessionData)

  if(!resCashSession.success){
    window.prismaFunctions.showMSG("error","Prisma", resCashSession.message)
    return
  }

  const cashData = {
    active: true,
  };

  const resCash = await window.prismaFunctions.editCash(cashId, cashData);

  if (!resCash.success) {
    window.prismaFunctions.showMSG("error", "Prisma", `Error al abrir la caja: ${res.message}`);
    return
  } 

    window.prismaFunctions.showMSG(
      "info",
      "Prisma",
      `Caja abierta correctamente.`
    );
   cleanFields();
}
const loadForm = (cash) => {
  cashId = cash.id;
  labelNombreCaja.innerText = cash.name;
  inputFechaHora.value = formatDateAndTime();
  modal.style.display = "none";
  modal.classList.remove("show", "d-flex", "justify-content-center");
  inputCash.focus();
};
const cleanFields = () => {
    inputMontoInicial.value = "";
    inputFechaHora.value = "";
    labelNombreCaja.innerText = "";
    modal.style.display = "block";
    modal.classList.add("show", "d-flex", "justify-content-center");
    inputCash.focus();
    renderCashesModal();
}
const renderCashesModal = async () => {
  const cashes = await getCashes();
  const cashTable = document.querySelector("#cashTable tbody");
  cashTable.innerHTML = "";
  cashes.forEach((cash) => {
    if (cash.active) {
      return;
    }
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${cash.code}</td>
            <td>${cash.name}</td>
            `;
    row.addEventListener("click", () => loadForm(cash));
    cashTable.appendChild(row);
  });
};
document.addEventListener("DOMContentLoaded", () => {
  renderCashesModal();
  inputFechaHora.value = new Date().toISOString().slice(0, 16);
});
