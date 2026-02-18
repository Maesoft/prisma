const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}-${mes}-${anio}`;
};

const calcularDiasVencidos = (fechaBase) => {
  if (!fechaBase) return 0;

  const hoy = new Date();
  const fecha = new Date(fechaBase);

  const diffTime = hoy - fecha;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

const getProvidersPayables = async (minDiasVencidos = 0) => {
  try {
    const res = await window.prismaFunctions.getProviders();

    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return [];
    }

    const providers = res.providers;

    const providersPayables = providers
      .map((provider) => {
        const totalPurchases = provider.purchase.reduce(
          (acc, purchase) => acc + purchase.total,
          0,
        );

        const totalPayments = provider.payment.reduce(
          (acc, payment) => acc + payment.monto,
          0,
        );

        const saldo = totalPurchases - totalPayments;

        let fechaBase = null;

        // 🔹 MISMA LÓGICA QUE CLIENTES
        if (provider.payment.length > 0) {
          fechaBase = provider.payment[provider.payment.length - 1].fecha;
        } else if (provider.purchase.length > 0) {
          // Tomar la compra más antigua si nunca pagó
          fechaBase = provider.purchase[0].fecha;
        }

        const diasVencidos = calcularDiasVencidos(fechaBase);

        return {
          ...provider,
          saldo,
          diasVencidos,
        };
      })
      .filter(
        (provider) =>
          provider.saldo > 0 && provider.diasVencidos >= minDiasVencidos,
      )
      .sort((a, b) => b.diasVencidos - a.diasVencidos);

    return providersPayables;
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      "Error al obtener proveedores",
    );
    return [];
  }
};

const renderProvidersTable = async (minDiasVencidos = 0) => {
  const providers = await getProvidersPayables(minDiasVencidos);

  const tableBody = document.getElementById("providersTableBody");
  tableBody.innerHTML = "";

  let totalGeneral = 0;

  providers.forEach((provider) => {
    totalGeneral += provider.saldo;

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${provider.codigo || ""}</td>
        <td>${provider.razon_social || ""}</td>
        <td class="text-end">$ ${provider.saldo.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
        })}</td>
        <td class="text-center">${provider.diasVencidos}</td>
        <td class="obs-cell"></td>
        <td class="entrega-cell"></td>
      `;

    tableBody.appendChild(row);
  });

  const totalElement = document.getElementById("totalPagar");
  if (totalElement) {
    totalElement.innerText =
      "$ " +
      totalGeneral.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
      });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const fechaEmision = document.getElementById("fechaEmision");
  const fechaActual = new Date().toISOString().split("T")[0];

  if (fechaEmision) {
    fechaEmision.innerHTML = `<strong>Emitido el:</strong> ${formatearFecha(
      fechaActual,
    )}`;
  }

  const modalElement = document.getElementById("filtroVencidosModal");
  const modal = new bootstrap.Modal(modalElement);

  // 🔹 Igual que clientes → se abre automáticamente
  modal.show();

  const input = document.getElementById("inputDiasVencidos");
  input.focus();

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      document.getElementById("btnAplicarFiltroVencidos").click();
    }
  });

  document
    .getElementById("btnAplicarFiltroVencidos")
    .addEventListener("click", () => {
      const dias = parseInt(input.value);

      if (isNaN(dias) || dias < 0) {
        alert("Ingrese un número válido mayor o igual a 0");
        input.focus();
        return;
      }

      renderProvidersTable(dias);
      modal.hide();
    });
});
