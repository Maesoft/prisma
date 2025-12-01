const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}-${mes}-${anio}`;
};

const getClientsReceivables = async () => {
  try {
    const res = await window.prismaFunctions.getClients();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return [];
    }

    const clients = res.clients;

    const clientsReceivables = clients
      .map((client) => {
        let ultCobro = "";
        const totalSales = client.sales.reduce(
          (acc, sales) => acc + sales.total,
          0
        );
        const totalReceipts = client.receipt.reduce(
          (acc, receipt) => acc + receipt.monto,
          0
        );
        const saldo = totalSales - totalReceipts;
        if (client.receipt.length > 0) {
          ultCobro = client.receipt[client.receipt.length - 1].fecha;
        } else {
          ultCobro = "No hay cobros";
        }

        return { ...client, saldo, ultCobro };
      })
      .filter((client) => client.saldo > 0);

    return clientsReceivables;
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      "Error al obtener proveedores"
    );
    return [];
  }
};
const renderClientsTable = async () => {
  const clients = await getClientsReceivables();

  const tableBody = document.getElementById("clientsTableBody");
  tableBody.innerHTML = ""; // Limpiar tabla antes de renderizar

  clients.forEach((client) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${client.codigo}</td>
            <td>${client.razon_social}</td>
            <td>$ ${client.saldo.toLocaleString("es-AR", {
              minimumFractionDigits: 2,
            })}</td>
            <td>${
              client.ultCobro == "No hay cobros"
                ? "No hay cobros"
                : formatearFecha(client.ultCobro)
            }</td>
        `;
    tableBody.appendChild(row);
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
