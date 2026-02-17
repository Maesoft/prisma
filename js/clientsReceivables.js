const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}-${mes}-${anio}`;
};
const calcularDiasMora = (fechaBase) => {
  if (!fechaBase) return 0;

  const hoy = new Date();
  const fecha = new Date(fechaBase);

  const diffTime = hoy - fecha;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};
const getClientsReceivables = async () => {
  try {
    const res = await window.prismaFunctions.getClients();

    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return [];
    }

    const clients = res.clients;
    console.log(clients);
    
    const clientsReceivables = clients
      .map((client) => {
        const totalSales = client.sales.reduce(
          (acc, sale) => acc + sale.total,
          0
        );

        const totalReceipts = client.receipt.reduce(
          (acc, receipt) => acc + receipt.monto,
          0
        );

        const saldo = totalSales - totalReceipts;

        // Fecha base para mora
        let fechaBase = null;

        if (client.receipt.length > 0) {
          fechaBase =
            client.receipt[client.receipt.length - 1].fecha;
        } else if (client.sales.length > 0) {
          fechaBase = client.sales[0].fecha;
        }

        const diasMora = calcularDiasMora(fechaBase);

        return {
          ...client,
          saldo,
          diasMora,
        };
      })
      .filter((client) => client.saldo > 0)
      .sort((a, b) => b.diasMora - a.diasMora);

    return clientsReceivables;
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      "Error al obtener clientes"
    );
    return [];
  }
};
const renderClientsTable = async () => {
  const clients = await getClientsReceivables();
  const tableBody = document.getElementById("clientsTableBody");

  tableBody.innerHTML = "";

  let totalGeneral = 0;

  clients.forEach((client) => {
    totalGeneral += client.saldo;

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${client.codigo || ""}</td>
        <td>${client.razon_social || ""}</td>
        <td>${client.domicilio || ""}</td>
        <td>${client.telefono || ""}</td>
        <td class="text-end">$ ${client.saldo.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
        })}</td>
        <td class="text-center">${client.diasMora}</td>
        <td class="obs-cell"></td>
        <td class="entrega-cell"></td>
      `;

    tableBody.appendChild(row);
  });

  // Actualizar resumen inferior
  document.getElementById("totalCobrar").innerText =
    "$ " +
    totalGeneral.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
    });
};
document.addEventListener("DOMContentLoaded", () => {
  const fechaEmision = document.getElementById("fechaEmision");
  const fechaActual = new Date().toISOString().split("T")[0];

  fechaEmision.innerHTML = `<strong>Emitido el:</strong> ${formatearFecha(
    fechaActual
  )}`;

  renderClientsTable();
});
