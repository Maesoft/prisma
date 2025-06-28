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
const subtotalFactura = document.getElementById("subtotal");
const impuestosFactura = document.getElementById("impuestos");
const totalFactura = document.getElementById("total");
const observacion = document.getElementById("observacion");

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
  console.log(datosComprobante);
  
  switch (datosComprobante.tipo_comprobante) {
    case "VEN":
      tipoComprobante.textContent = "VENTA";
      break;
    case "FA":
      tipoComprobante.textContent = "Factura A";
      break;
    case "FB":
      tipoComprobante.textContent = "Factura B";
      break;
    case "FC":
      tipoComprobante.textContent = "Factura C";
      break;

    default:
      break;
  }
  logoEmpresa.src = datosEmpresa?.logo || "";
  nombreEmpresa.textContent = datosEmpresa?.nombre || "Nombre no disponible";
  cuitEmpresa.textContent = datosEmpresa?.cuit || "CUIT no disponible";
  domicilioEmpresa.textContent =
    datosEmpresa?.domicilio || "Domicilio no disponible";
  telefonoEmpresa.textContent =
    datosEmpresa?.telefono || "Teléfono no disponible";

  fechaComprobante.textContent =
    formatearFecha(datosComprobante?.fecha) || "Fecha no disponible";
  numeroComprobante.textContent =
    datosComprobante?.numero_comprobante || "N° no disponible";

  nombreCliente.textContent =
    datosComprobante?.client?.razon_social || "Cliente no disponible";
  cuitCliente.textContent =
    datosComprobante?.client?.cuit || "CUIT no disponible";
  telefonoCliente.textContent =
    datosComprobante?.client?.telefono || "Teléfono no disponible";
  domicilioCliente.textContent =
    datosComprobante?.client?.direccion || "Domicilio no disponible";

  subtotalFactura.textContent = `$ ${(typeof datosComprobante?.subtotal ===
  "number"
    ? datosComprobante.subtotal
    : 0
  ).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  impuestosFactura.innerHTML = datosComprobante.impuestos ? datosComprobante.impuestos : "$ 0,00";

  totalFactura.textContent = `$ ${(typeof datosComprobante?.total === "number"
    ? datosComprobante.total
    : 0
  ).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  if (Array.isArray(datosComprobante?.details)) {
  datosComprobante.details.forEach((detail) => {  
    const row = document.createElement("tr");
    const cantidad = detail?.cantidad ?? "—";
    const producto = detail?.producto ?? "Producto no disponible";
    const precioUnitario = typeof detail?.precio_unitario === "number"
      ? detail.precio_unitario.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0,00";

    const subtotal = typeof detail?.subtotal === "number"
      ? detail.subtotal.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "0,00";

    row.innerHTML = `
      <td>${cantidad}</td>
      <td>${producto}</td>
      <td>${precioUnitario}</td>
      <td>${subtotal}</td>
    `;
    
    detalleFactura.appendChild(row);
  });
  observacion.textContent = datosComprobante?.observacion;
} else {
  console.warn("No hay detalles de factura válidos para mostrar.");
}

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
