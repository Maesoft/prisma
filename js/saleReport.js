const fechaActual = new Date().toISOString().split("T")[0];
let fechaInicio;
let fechaFin;
let sales = [];
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
    sales = res.sales;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const makeReport = async () => {
  await loadSales();
  fechaInicio = document.getElementById("fechaInicio").value
    ? new Date(document.getElementById("fechaInicio").value)
    : null;
  fechaFin = document.getElementById("fechaFin").value
    ? new Date(document.getElementById("fechaFin").value)
    : null;
  const ventasFiltradas = sales.filter((venta) => {
    const fechaVenta = new Date(venta.fecha);
    return (
      (!fechaInicio || fechaVenta >= fechaInicio) &&
      (!fechaFin || fechaVenta <= fechaFin)
    );
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
                <col style="width: 15%">
                <col style="width: 30%">
                <col style="width: 35%">
                <col style="width: 10%">
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
                    <td>${sale.client.razon_social}</td>
                    <td>${sale.observacion}</td>
                    <td class="text-end">$${sale.total.toLocaleString("es-AR", {
                      minimumFractionDigits: 2,
                    })}</td>
                </tr>
                `
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
    fechaInicio: fechaInicio ? fechaInicio.toLocaleDateString("es-AR") : "Sin fecha",
    fechaFin: fechaFin ? fechaFin.toLocaleDateString("es-AR") : "Sin fecha",
    },

  });
};
