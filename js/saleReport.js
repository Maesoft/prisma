const fechaActual = new Date().toISOString().split("T")[0];
let fechaInicio;
let fechaFin;
let sales = [];

const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}-${mes}-${anio}`;
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

<<<<<<< HEAD
const generarInforme = async () => {
  await cargarVentas();
  const fechaInicio = document.getElementById("fechaInicio").value
    ? new Date(document.getElementById("fechaInicio").value)
    : null;
  const fechaFin = document.getElementById("fechaFin").value
    ? new Date(document.getElementById("fechaFin").value)
    : null;
  const ventasFiltradas = ventas.filter((venta) => {
    const fechaVenta = new Date(venta.fecha);

    return (
      (!fechaInicio || fechaVenta >= fechaInicio) &&
      (!fechaFin || fechaVenta <= fechaFin)
    );
  });
  
  const totalVentas = ventasFiltradas.reduce(
    (acc, venta) => acc + venta.total,
    0
  );

=======
    return (
      (!fechaInicio || fechaVenta >= fechaInicio) &&
      (!fechaFin || fechaVenta <= fechaFin)
    );
  });
  const totalVentas = ventasFiltradas.reduce(
    (acc, venta) => acc + venta.total,
    0
  );
  renderReport(ventasFiltradas)
};
const renderReport = (report) => {
  const ventana = window.open("", "", "width=1100,height=800");

  ventana.document.write(`
   <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reporte de Ventas</title>
    <link rel="stylesheet" href="../css/bootstrap.min.css" />
    <script defer src="../js/bootstrap.min.js"></script>
</head>
<body>

<div class="container">
    <div class="d-flex justify-content-between mt-2 mb-2">
      <p class="text-center">Desde: ${fechaInicio || "Sin especificar"} <br> Hasta: ${fechaFin || "Sin especificar"}</p>
      <h2 class="text-center">Reporte de Ventas</h2>
      <p class="text-center mt-1">Emitido el ${fechaActual}</p>
    </div>
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
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            ${report.map(sale => `
            <tr>
                <td>${formatearFecha(sale.fecha)}</td>
                <td>${sale.tipo_comprobante + sale.numero_comprobante}</td>
                <td>${sale.client.razon_social}</td>
                <td>${sale.observacion}</td>
                <td class="text-end">$${sale.total.toFixed(2)}</td>
            </tr>
            `).join('')}
        </tbody>
    </table>
</div>
</body>
</html>`);
ventana.document.close();
>>>>>>> 55741334a09827baa45b02d98623d565446230b8
};
