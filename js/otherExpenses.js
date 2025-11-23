const fecha = document.getElementById("fecha");
const nroComp = document.getElementById("nroComp");
const categoria = document.getElementById("categoria");
const btnAddCat = document.getElementById("btnAddCat");
const caja = document.getElementById("caja");
const importe = document.getElementById("importe");
const descripcion = document.getElementById("descripcion");
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
  console.log(expenseData);
  
  const res = await window.prismaFunctions.addExpense(expenseData);
  if (res.success) {
    window.prismaFunctions.showMSG("info", "Prisma", res.message);
    fechaActual();
    await ultimoComprobante();
    importe.value = "";
    descripcion.value = "";
  } else {
    window.prismaFunctions.showMSG("error", "Prisma", res.message);
  }
};
document.addEventListener("DOMContentLoaded", () => {
  fechaActual();
  ultimoComprobante();
  cargarCajas();
  cargarCategorias();
});
btnAceptar.addEventListener("click", saveExpense)
