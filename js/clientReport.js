const inputCodigoCliente = document.getElementById("inputCodigoCliente");
const inputDocument = document.getElementById("inputDocument");
const labelNombreCliente = document.getElementById("nombreCliente");
const fechaActual = new Date().toISOString().split("T")[0];

let fechaInicio;
let fechaFin;
let clients = [];

const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
};
const loadClients = async () => {
  try {
    const res = await window.prismaFunctions.getClients();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    clients = res.clients;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const renderClients = (arrClients) => {
  const listClient = document.getElementById("listClient");
  listClient.innerHTML = "";
  if (arrClients.length === 0) {
    listClient.innerHTML = `
    <tr>
      <td colspan="4">No se encontraron clientes.</td>
    </tr>`;
    return;
  }
  arrClients.forEach((client) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${client.codigo}</td>
      <td>${client.razon_social}</td>
      <td>${client.cuit}</td>
      <td>${client.regimen}</td>`;
    row.addEventListener("click", () => {
      inputCodigoCliente.value = client.codigo;
      labelNombreCliente.textContent = client.razon_social;
      const modalClients = bootstrap.Modal.getInstance(
        document.getElementById("modalClients")
      );
      modalClients.hide();
    });
    listClient.appendChild(row);
  });
};
const makeReport = async () => {
  if (!inputCodigoCliente.value) {
    window.prismaFunctions.showMSG(
      "error",
      "Error",
      "Verifique si ingresó un cliente existente"
    );
    return;
  }
  await loadClients();

  fechaInicio = document.getElementById("fechaInicio").value
    ? new Date(document.getElementById("fechaInicio").value)
    : null;
  fechaFin = document.getElementById("fechaFin").value
    ? new Date(document.getElementById("fechaFin").value)
    : null;

  const movimientos = [];
  
  clients.forEach((client) => {
    // Procesar ventas
    if (Array.isArray(client.sales)) {
      client.sales.forEach((venta) => {   
        const fechaVenta = new Date(venta.fecha);     
        if (
          (!fechaInicio || fechaVenta >= fechaInicio) &&
          (!fechaFin || fechaVenta <= fechaFin)
        ) {
          if (inputCodigoCliente.value == client.codigo) {
            movimientos.push({
              fecha: formatearFecha(venta.fecha),
              tipo_comprobante: venta.tipo_comprobante,
              numero_comprobante: venta.numero_comprobante,
              observacion: venta.observacion,
              total: Number(venta.total)
            });
          }
        }
      });
    }
    // Procesar pagos
    if (Array.isArray(client.payment)) {
      client.payment.forEach((pago) => {
        const fecha = new Date(pago.fecha);
        if (
          (!fechaInicio || fecha >= fechaInicio) &&
          (!fechaFin || fecha <= fechaFin)
        ) {
          if (inputCodigoCliente == client.codigo) {
            movimientos.push({
              fecha: formatearFecha(pago.fecha),
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
      <h4><strong>Razón Social:</strong> ${clients.find(pr => pr.codigo == inputCodigoCliente.value).razon_social || 'N/A'}</h4>
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
inputCodigoCliente.addEventListener("focusout", async (event) => {
  seleccionarCliente()
});
inputCodigoCliente.addEventListener("keyup", async (event) => {
  if (event.key === "F3") {
    const clientSearchModal = new bootstrap.Modal(
      document.getElementById("modalClients")
    );
    clientSearchModal.show();
    await loadClients();
    renderClients(clients);
    setTimeout(() => inputModalClients.focus(), 200);
  }
  if (event.key === "Enter") {
    seleccionarCliente()
  }
});
const seleccionarCliente = async () => {
  await loadClients();
  const codeToSearch = clients.find(
    (client) => client.codigo == inputCodigoCliente.value
  );
  if (!codeToSearch) {
    inputCodigoCliente.value = "";
    inputCodigoCliente.focus();
    labelNombreCliente.textContent = "Cliente no encotrado.";
  } else {
    // idclient = codeToSearch.id;
    labelNombreCliente.textContent = codeToSearch.razon_social;
    inputDocument.focus()
  }
}