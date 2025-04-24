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
              fecha: pago.fecha,
              tipo_comprobante: pago.tipo_comprobante,
              numero_comprobante: pago.numero_comprobante,
              observacion: pago.observacion,
              total: Number(pago.total)
            });
          }
        }
      });
    }
  });
  const datosFiltrados = movimientos.sort((a, b) => a.fecha - b.fecha);
  printReport(datosFiltrados);
};
const printReport = async (report) => {
  console.log(report);
  
  const tiposDebe = ['FA', 'FB', 'FC', 'F', 'T', 'TA', 'TB', 'TC', 'NDA', 'NDB', 'NDC', 'VEN'];
  const tiposHaber = ['OP', 'NCA', 'NCB', 'NCC'];

  
  if (fechaInicio) fechaInicio.setDate(fechaInicio.getDate() + 1);
  if (fechaFin) fechaFin.setDate(fechaFin.getDate() + 1);
  const totalCompras = report.reduce((acc, compra) => acc + compra.total, 0);
  let saldo = 0;
  
  const html=`<table class="table table-striped" id="informe">
            <colgroup>
                <col style="width: 10%">
                <col style="width: 15%">
                <col style="width: 30%">
                <col style="width: 35%">
                <col style="width: 10%">
            </colgroup>
            <thead class="text-center">
                <tr>
                    <th class="text-start">Fecha</th>
                    <th class="text-start">Comprobante</th>
                    <th class="text-start">Debe</th>
                    <th class="text-start">Haber</th>
                    <th class="text-end">Saldo</th>
                </tr>
            </thead>
            <tbody>`
   const tbody = document.querySelector("#informe tbody");
   report.forEach(rep => {
    const tr = document.createElement("tr");
    const debe = tiposDebe.includes(rep.tipo_comprobante) ? rep.total : 0;
    const haber = tiposHaber.includes(rep.tipo_comprobante) ? rep.total : 0;
    saldo += debe - haber;

    tr.innerHTML = `
      <td>${rep.fecha}</td>
      <td>${rep.tipo_comprobante + rep.numero_comprobante}</td>
      <td>${debe ? debe.toFixed(2) : ''}</td>
      <td>${haber ? haber.toFixed(2) : ''}</td>
      <td>${saldo.toFixed(2)}</td>
    `;
    tbody.appendChild(tr);
  });

  await window.prismaFunctions.openWindow({
    windowName: "printReport",
    width: 1100,
    height: 800,
    frame: true,
    modal: false,
    data: {
      html,
      title: report.razon_social,
      fechaEmision: parseDateLocal(fechaActual),
      fechaInicio: fechaInicio ? fechaInicio.toLocaleDateString("es-AR") : "Sin fecha",
      fechaFin: fechaFin ? fechaFin.toLocaleDateString("es-AR") : "Sin fecha",
    }
  })
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