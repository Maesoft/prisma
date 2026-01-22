const installmentsTableBody = document.getElementById("installmentsTableBody");
const cuota = document.getElementById("cuota");
const interes = document.getElementById("interes");
const addInstallmentBtn = document.getElementById("addInstallmentBtn");

const loadInstallments = async () => {
  const res = await window.prismaFunctions.getInstallments();
  if (!res.success) return;

  const installments = res.installments;
  installmentsTableBody.innerHTML = "";
  installments.forEach((installment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${installment.cuotas}</td>
            <td>
            <span class="mx-1">%${installment.porcentaje}</span> 
              <button 
              class="btn btn-dark btn-sm p-0 btn-remove delete-installment-btn" 
              style="width: 20px; height: 20px; font-size: 0.6rem; line-height: 1; margin: 0;" 
              data-id="${installment.id}">✖
              </button>
            </td>
        `;
    installmentsTableBody.appendChild(row);
  });
};

const createInstallment = async () => {
  if (!validationFields()) return;
  const installmentData = {
    cuotas: Number(cuota.value),
    porcentaje: Number(interes.value),
  };

  const res = await window.prismaFunctions.addInstallment(installmentData);
  if (res.success) {
    cleanFields();
    loadInstallments();
  } else {
    window.prismaFunctions.showMSG("error", "Prisma", res.message);
  }
};

const cleanFields = () => {
  cuota.value = "";
  interes.value = "";
};

const validationFields = () => {
  if (cuota.value == "" || interes.value == "") {
    window.prismaFunctions.showMSG(
      "info",
      "Prisma",
      "Por favor, complete todos los campos.",
    );
    return false;
  }
  if (isNaN(cuota.value) || isNaN(interes.value)) {
    window.prismaFunctions.showMSG(
      "info",
      "Prisma",
      "Por favor, ingrese valores numéricos válidos.",
    );
    return false;
  }
  return true;
};

addInstallmentBtn.addEventListener("click", createInstallment);

installmentsTableBody.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-installment-btn")) {
    const resMSG = await window.prismaFunctions.showMSG(
      "question",
      "Prisma",
      `¿Esta seguro que desea eliminar la cuota?`,
      ["Si", "No"],
      0,
    );

    if (resMSG != 0) return;
    const id = event.target.dataset.id;
    const res = await window.prismaFunctions.deleteInstallment(id);
    if (res.success) {
      loadInstallments();
    } else {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
    }
  }
});

window.addEventListener("DOMContentLoaded", () => {
  loadInstallments();
});
