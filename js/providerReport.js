const inputCodigoProveedor = document.getElementById("inputCodigoProveedor");
const inputDocument = document.getElementById("inputDocument");
const labelNombreProveedor = document.getElementById("nombreProveedor");
const fechaActual = new Date().toISOString().split("T")[0];
let fechaInicio;
let fechaFin;
let providers = [];

const parseDateLocal = (str) => {
  const [year, month, day] = str.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
};
const loadProviders = async () => {
  try {
    const res = await window.prismaFunctions.getProviders();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    providers = res.providers;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const renderProviders = (arrProviders) => {
  const listProviders = document.getElementById("listProviders");
  listProviders.innerHTML = "";
  if (arrProviders.length === 0) {
    listProviders.innerHTML = `
    <tr>
      <td colspan="4">No se encontraron proveedores.</td>
    </tr>`;
    return;
  }
  arrProviders.forEach((provider) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${provider.codigo}</td>
      <td>${provider.razon_social}</td>
      <td>${provider.cuit}</td>
      <td>${provider.regimen}</td>`;
    row.addEventListener("click", () => {
      inputCodigoProveedor.value = provider.codigo;
      labelNombreProveedor.textContent = provider.razon_social;
      const modalProviders = bootstrap.Modal.getInstance(
        document.getElementById("modalProviders")
      );
      modalProviders.hide();
    });
    listProviders.appendChild(row);
  });
};
const makeReport = async () => {
  if (!inputCodigoProveedor.value) {
    window.prismaFunctions.showMSG(
      "error",
      "Error",
      "Verifique si ingresó un proveedor existente"
    );
    return;
  }
  await loadProviders();

  fechaInicio = document.getElementById("fechaInicio").value
    ? parseDateLocal(document.getElementById("fechaInicio").value)
    : null;
  fechaFin = document.getElementById("fechaFin").value
    ? parseDateLocal(document.getElementById("fechaFin").value)
    : null;

  const movimientos = [];

  providers.forEach((provider) => {
    // Procesar compras
    if (Array.isArray(provider.purchase)) {
      provider.purchase.forEach((compra) => {
        if (
          (!fechaInicio || fecha >= fechaInicio) &&
          (!fechaFin || fecha <= fechaFin)
        ) {
          if (inputCodigoProveedor.value == provider.id) {
            movimientos.push({
              fecha: compra.fecha,
              tipo_comprobante: compra.tipo_comprobante,
              numero_comprobante: compra.numero_comprobante,
              observacion: compra.observacion,
              total: Number(compra.total)
            });
          }
        }
      });
    }
    // Procesar pagos
    if (Array.isArray(provider.payment)) {
      provider.payment.forEach((pago) => {
        const fecha = new Date(pago.fecha);
        if (
          (!fechaInicio || fecha >= fechaInicio) &&
          (!fechaFin || fecha <= fechaFin)
        ) {
          if (inputCodigoProveedor == provider.codigo) {
            movimientos.push({
              tipo: "payment",
              fecha,
              proveedor: provider.razon_social,
              cuit: provider.cuit,
              monto: Number(pago.monto),
              numero_comprobante: pago.nro_comprobante,
              metodo_pago: pago.methodPayment?.nombre || "Sin método",
            });
          }
        }
      });
    }
  });
  const datosFiltrados = movimientos.sort((a, b) => a.fecha - b.fecha);
  printReport(datosFiltrados);
};
const printReport = (report) => {
//Pensar un modo de generar reportes sin crear una nueva ventana... usando modal?


};
inputCodigoProveedor.addEventListener("focusout", async (event) => {
  seleccionarProveedor()
});
inputCodigoProveedor.addEventListener("keyup", async (event) => {
  if (event.key === "F3") {
    const providerSearchModal = new bootstrap.Modal(
      document.getElementById("modalProviders")
    );
    providerSearchModal.show();
    await loadProviders();
    renderProviders(providers);
    setTimeout(() => inputModalProviders.focus(), 200);
  }
  if (event.key === "Enter") {
    seleccionarProveedor()
  }
});
const seleccionarProveedor = async () => {
  await loadProviders();
  const codeToSearch = providers.find(
    (provider) => provider.codigo == inputCodigoProveedor.value
  );
  if (!codeToSearch) {
    inputCodigoProveedor.value = "";
    inputCodigoProveedor.focus();
    labelNombreProveedor.textContent = "Proveedor no encotrado.";
  } else {
    idProvider = codeToSearch.id;
    labelNombreProveedor.textContent = codeToSearch.razon_social;
    inputDocument.focus()
  }
}