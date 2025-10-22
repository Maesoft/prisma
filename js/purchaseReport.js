const inputProvider = document.getElementById("inputProvider");
const inputProduct = document.getElementById("inputProduct");
const modalProviders = document.getElementById("modalProviders");
const fechaActual = new Date().toISOString().split("T")[0];

let fechaInicio;
let fechaFin;

const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
};
const loadPurchases = async () => {
  try {
    const res = await window.prismaFunctions.getPurchases();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    return res.purchases;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const loadProviders = async () => {
  try {
    const res = await window.prismaFunctions.getProviders();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    return res.providers;
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
const renderProvidersModal = async () => {
  const providers = await loadProviders();
  const providerList = document.getElementById("listproviders");
  providerList.innerHTML = "";
  providers.forEach((provider) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${provider.codigo}</td>
      <td>${provider.razon_social}</td>
      <td>${provider.cuit}</td>
      <td>${provider.regimen}</td>
    `;
    row.addEventListener("click", () => {
      inputProvider.value += `${provider.razon_social}; `;
      inputProvider.focus();
      closeModal();
    });
    providerList.appendChild(row);
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
const selectProviders = () => {
  const inputValue = inputProvider.value.trim();
  if (!inputValue) return [];
  const providers = inputValue
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
  return providers;
};
const makeReport = async () => {
  const purchases = await loadPurchases();
  
  const providers = selectProviders()
    ?.map((c) => c.trim())
    .filter((c) => c);
  const products = selectProducts()
  
  fechaInicio = document.getElementById("fechaInicio").value
    ? new Date(document.getElementById("fechaInicio").value)
    : null;
  fechaFin = document.getElementById("fechaFin").value
    ? new Date(document.getElementById("fechaFin").value)
    : null;

  const comprasFiltradas = purchases.filter((compras) => {
    const fechaVenta = new Date(compras.fecha);
    const nombreProveedor = compras.provider?.razon_social;
    const nombreProducto = compras.details?.producto;    
    const coincideProveedor =
      providers?.length === 0 || providers?.includes(nombreProveedor);
    const coincideProducto =
      products?.length === 0 || products?.includes(nombreProducto);
    const coincideFecha =
      (!fechaInicio || fechaVenta >= fechaInicio) &&
      (!fechaFin || fechaVenta <= fechaFin);

    return coincideProveedor && coincideFecha && coincideProducto;
  });

  printReport(comprasFiltradas);
};
const printReport = async (report) => {
  if (fechaInicio) fechaInicio.setDate(fechaInicio.getDate() + 1);
  if (fechaFin) fechaFin.setDate(fechaFin.getDate() + 1);
  const totalCompras = report.reduce((acc, compras) => acc + compras.total, 0);

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
                    <th class="text-start">Proveedor</th>
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
                    <td>${sale.provider?.razon_social || "Proveedor Eliminado"}</td>
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
            <h5 class="text-end total-print">$ ${totalCompras.toLocaleString(
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
      title: "Reporte de Compras",
      fechaEmision: formatearFecha(fechaActual),
      fechaInicio: fechaInicio
        ? fechaInicio.toLocaleDateString("es-AR")
        : "Sin fecha",
      fechaFin: fechaFin ? fechaFin.toLocaleDateString("es-AR") : "Sin fecha",
    },
  });
};
const closeModal = () => {
  modalProviders.style.display = "none";
};
inputProvider.addEventListener("keydown", (e) => {
  if (e.key === "F3") {
    renderProvidersModal();
    modalProviders.style.display = "block";
  }
});
