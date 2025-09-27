const inputClient = document.getElementById("inputClient");
const inputProduct = document.getElementById("inputProduct");
const modalClient = document.getElementById("modalClients");
const fechaActual = new Date().toISOString().split("T")[0];

let fechaInicio;
let fechaFin;

const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
};
const loadSales = async () => {
  try {
    const res = await window.prismaFunctions.getSales();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    return res.sales;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const loadClients = async () => {
  try {
    const res = await window.prismaFunctions.getClients();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    return res.clients;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const loadProducts = async () => {
  try {
    const res = await window.prismaFunctions.getProducts();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    return res.products;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const renderClientsModal = async () => {
  const clients = await loadClients();
  const clientList = document.getElementById("listClients");
  clientList.innerHTML = "";
  clients.forEach((client) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${client.codigo}</td>
      <td>${client.razon_social}</td>
      <td>${client.cuit}</td>
      <td>${client.regimen}</td>
    `;
    row.addEventListener("click", () => {
      inputClient.value += `${client.razon_social}; `;
      inputClient.focus();
      closeModal();
    });
    clientList.appendChild(row);
  });
};
const selectProducts = () => {
  const inputValue = inputProduct.value.trim();
  if (!inputValue) return [];
  const products = inputValue
    .split(";")
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .filter((p) => p);
  return products;
};
const selectClients = () => {
  const inputValue = inputClient.value.trim();
  if (!inputValue) return [];
  const clients = inputValue
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
  return clients;
};
const makeReport = async () => {
  const sales = await loadSales();
  
  const clients = selectClients()
    ?.map((c) => c.trim())
    .filter((c) => c);
  const products = selectProducts()
  
  fechaInicio = document.getElementById("fechaInicio").value
    ? new Date(document.getElementById("fechaInicio").value)
    : null;
  fechaFin = document.getElementById("fechaFin").value
    ? new Date(document.getElementById("fechaFin").value)
    : null;

  const ventasFiltradas = sales.filter((venta) => {
    const fechaVenta = new Date(venta.fecha);
    const nombreCliente = venta.client?.razon_social;
    const nombreProducto = venta.details?.producto;    
    const coincideCliente =
      clients?.length === 0 || clients?.includes(nombreCliente);
    const coincideProducto =
      products?.length === 0 || products?.includes(nombreProducto);
    const coincideFecha =
      (!fechaInicio || fechaVenta >= fechaInicio) &&
      (!fechaFin || fechaVenta <= fechaFin);

    return coincideCliente && coincideFecha && coincideProducto;
  });

  printReport(ventasFiltradas);
};
const printReport = async (report) => {
  if (fechaInicio) fechaInicio.setDate(fechaInicio.getDate() + 1);
  if (fechaFin) fechaFin.setDate(fechaFin.getDate() + 1);
  const totalVentas = report.reduce((acc, venta) => acc + venta.total, 0);

  const html = `
  <table class="table table-striped">
            <colgroup>
                <col style="width: 10%">
                <col style="width: 20%">
                <col style="width: 25%">
                <col style="width: 30%">
                <col style="width: 15%">
            </colgroup>
            <thead class="text-center">
                <tr>
                    <th class="text-start">Fecha</th>
                    <th class="text-start">Comprobante</th>
                    <th class="text-start">Cliente</th>
                    <th class="text-start">Observación</th>
                    <th class="text-end">Total</th>
                </tr>
            </thead>
            <tbody>
                ${report
                  .map(
                    (sale) => `
                <tr>
                    <td>${formatearFecha(sale.fecha)}</td>
                    <td>${sale.tipo_comprobante + sale.numero_comprobante}</td>
                    <td>${sale.client?.razon_social || "Cliente Eliminado"}</td>
                    <td>${sale.observacion}</td>
                    <td class="text-end">$${sale.total.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}</td>
                </tr>`
                  )
                  .join("")}
            </tbody>
        </table>
        <div class="text-end mt-3">
            <h5 class="text-end total-print">$ ${totalVentas.toLocaleString(
              "es-AR",
              { minimumFractionDigits: 2 }
            )}</h5>
        </div>`;

  await window.prismaFunctions.openWindow({
    windowName: "printReport",
    width: 1100,
    height: 800,
    frame: true,
    modal: false,
    data: {
      html,
      title: "Reporte de Ventas",
      fechaEmision: formatearFecha(fechaActual),
      fechaInicio: fechaInicio
        ? fechaInicio.toLocaleDateString("es-AR")
        : "Sin fecha",
      fechaFin: fechaFin ? fechaFin.toLocaleDateString("es-AR") : "Sin fecha",
    },
  });
};
const closeModal = () => {
  modalClient.style.display = "none";
};
inputClient.addEventListener("keydown", (e) => {
  if (e.key === "F3") {
    renderClientsModal();
    modalClient.style.display = "block";
  }
});
