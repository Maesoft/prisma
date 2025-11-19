const fecha = document.getElementById("fecha");
const nroComp = document.getElementById("nroComp");
const categoria = document.getElementById("categoria");
const btnAddCat = document.getElementById("btnAddCat");
const caja = document.getElementById("caja");
const importe = document.getElementById("importe");
const descripcion = document.getElementById("descripcion");
const btnAceptar = document.getElementById("btnAceptar");
const btnCancel = document.getElementById("btnCancel");

document.addEventListener("DOMContentLoaded", () => {
  fechaActual();
  ultimoComprobante();
  cargarCajas();
  cargarCategorias();
});

const fechaActual = () => {
  const hoy = new Date();
  const dia = String(hoy.getDate()).padStart(2, "0");
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const anio = hoy.getFullYear();
  fecha.value = `${anio}-${mes}-${dia}`;
};
const ultimoComprobante = async () => {
    const res = await window.prismaFunctions.getExpenses()
    const ultimo = res.expenses?.pop()
    ultimo ? nroComp.value = ultimo.nroComprobante + 1 : nroComp.value = 1
    nroComp.value = nroComp.value.toString().padStart(6, '0')
}
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
            option.textContent = cat.nombre;
            categoria.appendChild(option);
        });
};
