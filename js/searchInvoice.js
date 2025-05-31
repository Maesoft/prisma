const inputSearch = document.getElementById("inputModalInvoices");
let invoices = [];

const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}-${mes}-${anio}`;
};
const loadInvoices = async () => {
  try {
    const res = await window.prismaFunctions.getSales();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    invoices = res.sales;

    renderInvoices(invoices);
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
    return;
  }
};
const renderInvoices = async (arrInvoices) => {
  const listInvoices = document.getElementById("listInvoices");
  listInvoices.innerHTML = "";
  arrInvoices.forEach((invoice) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${formatearFecha(invoice.fecha)}</td>
    <td>${invoice.client.razon_social}</td>
    <td>${invoice.tipo_comprobante + invoice.numero_comprobante}</td>
    <td>$ ${invoice.total.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
    })}</td>
    `;
    row.addEventListener("click", () => printInvoice(invoice));
    listInvoices.appendChild(row);
  });
};
const printInvoice = (invoice) => {
  window.prismaFunctions.openWindow({
    windowName: "printInvoice",
    width: 1100,
    height: 800,
    frame: true,
    modal: false,
    data: invoice,
  });
};

document.addEventListener("DOMContentLoaded", loadInvoices);

inputSearch.addEventListener("input", (e) => {
  const query = e.target.value;
  const filtered = invoices.filter(
    (inv) =>
      inv.client.razon_social.toLowerCase().includes(query.toLowerCase()) ||
      inv.fecha.includes(formatearFecha(query)) ||
      inv.numero_comprobante.toLowerCase().includes(query.toLowerCase())
  );
  renderInvoices(filtered);
});
