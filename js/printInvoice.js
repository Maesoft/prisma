const logoEmpresa = document.getElementById("logo-empresa");
const nombreEmpresa = document.getElementById("nombre-empresa");
const cuitEmpresa = document.getElementById("cuit-empresa");
const domicilioEmpresa = document.getElementById("domicilio-empresa");
const telefonoEmpresa = document.getElementById("telefono-empresa");
const tipoComprobante = document.getElementById("tipo-comprobante");
const fechaComprobante = document.getElementById("fecha-comprobante");
const numeroComprobante = document.getElementById("numero-comprobante");
const nombreCliente = document.getElementById("nombre-cliente");
const cuitCliente = document.getElementById("cuit-cliente");
const telefonoCliente = document.getElementById("telefono-cliente");
const domicilioCliente = document.getElementById("domicilio-cliente");
const detalleFactura = document.getElementById("detalle-factura");
const totalFactura = document.getElementById("total");
let datosEmpresa = null;
let datosComprobante = null;

const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}-${mes}-${anio}`;
};
const cargarDatosEmpresa = async () => {
  try {
    const res = await window.prismaFunctions.loadOption();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.messagge);
      return;
    }
    datosEmpresa = res.options;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message || error);
  }
};
const llenarCampos = () => {
  switch (datosComprobante.tipo_comprobante) {
    case "VEN":
      tipoComprobante.textContent="VENTA"
      break;
    case "FA":
      tipoComprobante.textContent="Factura A"
      break;
    case "FB":
      tipoComprobante.textContent="Factura B"
      break;
    case "FC":
      tipoComprobante.textContent="Factura C"
      break;
  
    default:
      break;
  }
  logoEmpresa.src = datosEmpresa.logo;
  nombreEmpresa.textContent = datosEmpresa.nombre;
  cuitEmpresa.textContent = datosEmpresa.cuit;
  domicilioEmpresa.textContent = datosEmpresa.domicilio;
  telefonoEmpresa.textContent = datosEmpresa.telefono;
  fechaComprobante.textContent = formatearFecha(datosComprobante.fecha);
  numeroComprobante.textContent = datosComprobante.numero_comprobante;
  nombreCliente.textContent = datosComprobante.client.razon_social;
  cuitCliente.textContent = datosComprobante.client.cuit;
  telefonoCliente.textContent = datosComprobante.client.telefono;
  domicilioCliente.textContent = datosComprobante.client.direccion;
  totalFactura.textContent = `$${datosComprobante.total.toLocaleString(
    "es-AR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
  datosComprobante.details.forEach((detail) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${detail.cantidad}</td>
    <td>${detail.producto}</td>
    <td>${detail.precio_unitario.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</td>
    <td>${detail.subtotal.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</td>`;
    detalleFactura.appendChild(row);
  });
};
window.prismaFunctions.onReporteDatos(async (data) => {
  if (!datosEmpresa) {
    await cargarDatosEmpresa();
  }
  datosComprobante = data;
  llenarCampos();
});

setTimeout(() => {
  window.print();
}, 1000);
