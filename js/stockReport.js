const fechaActual = new Date().toISOString().split("T")[0];
let fechaInicio;
let fechaFin;
let products = [];
const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
};
const loadProducts = async () => {
  try {
    const res = await window.prismaFunctions.getProducts();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    products = res.products;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const makeReport = async () => {
  await loadProducts();
  fechaInicio = document.getElementById("fechaInicio").value
    ? new Date(document.getElementById("fechaInicio").value)
    : null;
  fechaFin = document.getElementById("fechaFin").value
    ? new Date(document.getElementById("fechaFin").value)
    : null;
  const productosFiltrados = products.filter((product) => {
    const fechaVenta = new Date(venta.fecha);
    return (
      (!fechaInicio || fechaVenta >= fechaInicio) &&
      (!fechaFin || fechaVenta <= fechaFin)
    );
  });
  printReport(productosFiltrados);
};
const printReport = (report) => {
  const totalStock = report.reduce((acumulador, productoActual) => acumulador + productoActual.precios[0].precio, 0);
  if(fechaInicio)fechaInicio.setDate(fechaInicio.getDate() + 1);
  if(fechaFin)fechaFin.setDate(fechaFin.getDate() + 1);
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

    <style>
        @page {
          size: A4 landscape; /* A4 en orientación horizontal */
          margin: 10mm; /* Márgenes opcionales */
        }
        @media print {
          .text-end {
             text-align: right !important;
          }
          .text-start {
             text-align: left !important;
          }
          .text-center {
             text-align: center !important;
          }
      </style>

</head>
<body>

<div class="container">
    <div class="d-flex justify-content-between mt-2 mb-2">
    <h2 class="text-center">Reporte de Ventas</h2>
    <p class="text-center mt-1">Emitido el ${formatearFecha(fechaActual)}</p>
      <p class="text-center">
        Desde: ${fechaInicio ? fechaInicio.toLocaleDateString("es-AR") : "Sin especificar"} <br> 
        Hasta: ${fechaFin ? fechaFin.toLocaleDateString("es-AR") : "Sin especificar"}
      </p>
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
                <th class="text-end">Total</th>
            </tr>
        </thead>
        <tbody>
            ${report.map(sale => `
            <tr>
                <td>${formatearFecha(sale.fecha)}</td>
                <td>${sale.tipo_comprobante + sale.numero_comprobante}</td>
                <td>${sale.client.razon_social}</td>
                <td>${sale.observacion}</td>
                <td class="text-end">$${sale.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
            </tr>
            `).join('')}
        </tbody>
        </table>
        <div class="text-center">
            <h5>Total: $ ${totalVentas.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</h5>
        </div>
</div>
</body>
</html>`);

  ventana.document.close();
  ventana.print();
  ventana.onafterprint = () => ventana.close();
};
