const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}-${mes}-${anio}`;
};

const getProvidersPayables = async () => {
  try {
    const res = await window.prismaFunctions.getProviders();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return [];
    }

    const providers = res.providers;

    const providersPayables = providers
      .map((provider) => {
        let ultPago = "";
        const totalPurchases = provider.purchase.reduce(
          (acc, purchase) => acc + purchase.total,
          0
        );
        const totalPayments = provider.payment.reduce(
          (acc, payment) => acc + payment.monto,
          0
        );
        const saldo = totalPurchases - totalPayments;
        if (provider.payment.length > 0) {
          ultPago = provider.payment[provider.payment.length - 1].fecha;
        } else {
          ultPago = "No hay pagos";
        }

        return { ...provider, saldo, ultPago };
      })
      .filter((provider) => provider.saldo > 0);

    return providersPayables;
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
const renderProvidersTable = async () => {
  const providers = await getProvidersPayables();
  console.log(providers);

  const tableBody = document.getElementById("providersTableBody");
  tableBody.innerHTML = ""; // Limpiar tabla antes de renderizar

  providers.forEach((provider) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${provider.codigo}</td>
            <td>${provider.razon_social}</td>
            <td>$ ${provider.saldo.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
    })}</td>
            <td>${provider.ultPago == "No hay pagos" ? "No hay pagos" : formatearFecha(provider.ultPago)}</td>
        `;
    tableBody.appendChild(row);
  });
};
document.addEventListener("DOMContentLoaded", () => {
  const fechaEmision = document.getElementById("fechaEmision");
  const fechaActual = new Date().toISOString().split("T")[0];
  fechaEmision.innerHTML = `<strong>Emitido el:</strong> ${formatearFecha(fechaActual)}`;
  renderProvidersTable();
})
