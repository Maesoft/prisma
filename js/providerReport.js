const fechaActual = new Date().toISOString().split("T")[0];
let fechaInicio;
let fechaFin;
let providers = [];
const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
};
const loadProviders = async () => {
  try {
    const res = await window.prismaFunctions.getProviders();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    providers = res.providers;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const makeReport = async () => {
  await loadProviders();
  fechaInicio = document.getElementById("fechaInicio").value
    ? new Date(document.getElementById("fechaInicio").value)
    : null;
  fechaFin = document.getElementById("fechaFin").value
    ? new Date(document.getElementById("fechaFin").value)
    : null;
  const facturasFiltradas = providers.filter((provider) => {
    const fechaCompra = new Date(provider.purchase.fecha);
    return (
      (!fechaInicio || fechaCompra >= fechaInicio) &&
      (!fechaFin || fechaCompra <= fechaFin)
    );
  });
  const pagosFiltrados = providers.filter((provider) => {
    const fechaPago = new Date(provider.payment.fecha);
    return (
      (!fechaInicio || fechaPago >= fechaInicio) &&
      (!fechaFin || fechaPago <= fechaFin)
    );
  });
  const pagosYfacturasFiltrados = [...facturasFiltradas, ...pagosFiltrados];
  const proveedoresFiltrados = pagosYfacturasFiltrados.sort(
    (a, b) => new Date(a.fecha) - new Date(b.fecha)
  );
  printReport(proveedoresFiltrados);
};
const printReport = (report) => {
    console.log("Report", report);
    
};
