const fecha = document.getElementById("fecha");
const nroComp = document.getElementById("nroComp");
const categoria = document.getElementById("categoria");
const btnAddCat = document.getElementById("btnAddCat");
const caja = document.getElementById("caja");
const importe = document.getElementById("importe");
const observaciones = document.getElementById("descripcion");
const btnAceptar = document.getElementById("btnAceptar");
const btnCancel = document.getElementById("btnCancel");

const fechaActual = () => {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, "0");
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const anio = hoy.getFullYear();
  fecha.value = `${anio}-${mes}-${dia}`;
};
const ultimoComprobante = async () => {
  const res = await window.prismaFunctions.getExpenses();
  const ultimo = res.expenses?.pop();
  ultimo ? (nroComp.textContent = Number(ultimo.numero_comprobante) + 1) : (nroComp.textContent = 1);
  nroComp.textContent = nroComp.textContent.toString().padStart(6, "0");
};
const cargarCajas = async () => {
  const res = await window.prismaFunctions.getCashes();
  const cajas = res.cashes;
  caja.innerHTML = "";
  cajas?.forEach((c) => {
    if (c.activa) {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = c.nombre;
      caja.appendChild(option);
    }
  });
};
const cargarCategorias = async () => {
  const res = await window.prismaFunctions.getExpensesCategories();
  const categorias = res.categories;
  categoria.innerHTML = "";
  categorias?.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    categoria.appendChild(option);
  });
};
const addCategory = async () => {
  const newCategoryName = document.getElementById("newCategoryName").value.trim();
  if (!newCategoryName) {
    window.prismaFunctions.showMSG(
      "info",
      "Prisma",
      "Por favor, ingrese un nombre para la categoría."
    );
    return;
  }
  const res = await window.prismaFunctions.addExpenseCategory({
    name: newCategoryName,
  });
  if (res.success) {
    window.prismaFunctions.showMSG("info", "Prisma", res.message);
    document.getElementById("categoria").innerHTML = "";
    document.getElementById("newCategoryName").value = "";
    const modalElement = document.getElementById("categoryModal");
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();
    await cargarCategorias();
  } else {
    window.prismaFunctions.showMSG("error", "Prisma", res.message);
  }
};
const saveExpense = async () => {
  const expenseData = {
    fecha: fecha.value,
    numero_comprobante: parseInt(nroComp.textContent, 10),
    categoria: parseInt(categoria.value, 10),
    total: parseFloat(importe.value) || 0,
    descripcion: descripcion.value.trim(),
  };

  const res = await window.prismaFunctions.addExpense(expenseData);
  if (res.success) {
    await newPayment(res.expenseId)
  } else {
    window.prismaFunctions.showMSG("error", "Prisma", res.message);
  }
};
const getLastPayment = async () => {
  const resPayments = await window.prismaFunctions.getPayments();
  if (!resPayments.payments || resPayments.payments.length === 0) return "00000001";
  const lastOrder = resPayments.payments.at(-1);
  const nextNumber = (Number(lastOrder.nro_comprobante) + 1).toString().padStart(8, "0");
  return nextNumber;
};
const getLastExpense = async () => {
  const resExpenses = await window.prismaFunctions.getExpenses();
  if (!resExpenses.expenses || resExpenses.expenses.length === 0) {
    window.prismaFunctions.showMSG("error", "Prisma", "Ocurrio un error al guardar el Gasto.")
  }
  const lastExpense = resExpenses.expenses.at(-1);
  return lastExpense.id;
}
const newPayment = async (expenseId) => {

  const ultCompPago = await getLastPayment();
  const ultGasto = await getLastExpense();

  const paymentData = {
    fecha: fecha.value,
    nro_comprobante: ultCompPago,
    monto: importe.value,
    gastos: expenseId,
    caja: {id: Number(caja.value)},
    observaciones: `Corresponde al Gasto #${ultGasto}`,
  }

  const res = await window.prismaFunctions.addPayment(paymentData);
  console.log(paymentData);
  console.log(res);
  // if(res.success){
  //   window.prismaFunctions.showMSG("info", "Prisma", res.message);
  //   fechaActual();
  //   await ultimoComprobante();
  //   importe.value = "";
  //   descripcion.value = "";
  // }

}
document.addEventListener("DOMContentLoaded", () => {
  fechaActual();
  ultimoComprobante();
  cargarCajas();
  cargarCategorias();
});
btnAceptar.addEventListener("click", saveExpense)
