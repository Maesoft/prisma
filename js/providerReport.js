const inputCodigoProveedor = document.getElementById("inputCodigoProveedor");
const inputDocument = document.getElementById("inputDocument");
const labelNombreProveedor = document.getElementById("nombreProveedor");
const fechaActual = new Date().toISOString().split("T")[0];

let fechaInicio;
let fechaFin;
let providers = [];

const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
};
const loadProviders = async () => {
  try {
    const res = await window.prismaFunctions.getProviders();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    providers = res.providers;
    console.log(providers);
    
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
    ? new Date(document.getElementById("fechaInicio").value)
    : null;
  fechaFin = document.getElementById("fechaFin").value
    ? new Date(document.getElementById("fechaFin").value)
    : null;

  const movimientos = [];

  providers.forEach((provider) => {
    // Procesar compras
    if (Array.isArray(provider.purchase)) {
      provider.purchase.forEach((compra) => {
        const fechaCompra = new Date(compra.fecha);
        if (
          (!fechaInicio || fechaCompra >= fechaInicio) &&
          (!fechaFin || fechaCompra <= fechaFin)
        ) {          
          if (inputCodigoProveedor.value == provider.codigo) {
            movimientos.push({
              fecha: formatearFecha(compra.fecha),
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
        const fechaPago = new Date(pago.fecha);
        if (
          (!fechaInicio || fechaPago >= fechaInicio) &&
          (!fechaFin || fechaPago <= fechaFin)
        ) {
          if (inputCodigoProveedor.value == provider.codigo) {
            movimientos.push({
              fecha: formatearFecha(pago.fecha),
              tipo_comprobante: "OP",
              numero_comprobante: pago.nro_comprobante,
              observacion: pago.observacion,
              total: Number(pago.monto)
            });
          }
        }
      });
    }
  });
  const datosFiltrados = movimientos.sort((a, b) => {
    const [diaA, mesA, anioA] = a.fecha.split('/');
    const [diaB, mesB, anioB] = b.fecha.split('/');
    const dateA = new Date(`${anioA}-${mesA}-${diaA}`);
    const dateB = new Date(`${anioB}-${mesB}-${diaB}`);
    return dateA - dateB;
  });
    printReport(datosFiltrados);
};
const printReport = async (report) => {
  const tiposDebe = ['FA', 'FB', 'FC', 'F', 'T', 'TA', 'TB', 'TC', 'NDA', 'NDB', 'NDC', 'VEN'];
  const tiposHaber = ['OP', 'NCA', 'NCB', 'NCC'];

  if (fechaInicio) fechaInicio.setDate(fechaInicio.getDate() + 1);
  if (fechaFin) fechaFin.setDate(fechaFin.getDate() + 1);

  let saldo = 0;

  let rowsHtml = '';
  report.forEach(rep => {
    const debe = tiposDebe.includes(rep.tipo_comprobante) ? rep.total : 0;
    const haber = tiposHaber.includes(rep.tipo_comprobante) ? rep.total : 0;
    saldo += debe - haber;

    rowsHtml += `
      <tr>
        <td>${rep.fecha}</td>
        <td>${rep.tipo_comprobante}${rep.numero_comprobante}</td>
        <td>${debe ? debe.toFixed(2) : ''}</td>
        <td>${haber ? haber.toFixed(2) : ''}</td>
        <td class="text-end">${saldo.toFixed(2)}</td>
      </tr>
    `;
  });

  const html = `
    <html>
    <head>
      <style>
        body { font-family: sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 8px; }
        th { background-color: #f4f4f4; }
        td.text-end { text-align: right; }
      </style>
    </head>
    <body>
      <h4><strong>Razón Social:</strong> ${providers.find(pr => pr.codigo == inputCodigoProveedor.value).razon_social || 'N/A'}</h4>
      <table class="table table-striped" id="informe">
        <thead class="text-center">
          <tr>
            <th class="text-start">Fecha</th>
            <th class="text-start">Comprobante</th>
            <th class="text-start">Debe</th>
            <th class="text-start">Haber</th>
            <th class="text-end">Saldo</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      <div class="text-end"><strong>Total: </strong> $ ${(saldo).toLocaleString("es-AR", { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      })}</div>
    </body>
    </html>
  `;

  await window.prismaFunctions.openWindow({
    windowName: "printReport",
    width: 1100,
    height: 800,
    frame: true,
    modal: false,
    data: {
      html,
      title: "Resumen de cuenta",
      fechaEmision: formatearFecha(fechaActual),
      fechaInicio: fechaInicio ? fechaInicio.toLocaleDateString("es-AR") : "Sin fecha",
      fechaFin: fechaFin ? fechaFin.toLocaleDateString("es-AR") : "Sin fecha",
    }
  });
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
    // idProvider = codeToSearch.id;
    labelNombreProveedor.textContent = codeToSearch.razon_social;
    inputDocument.focus()
  }
}