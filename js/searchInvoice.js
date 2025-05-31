const loadInvoices = async () => {
  try {
    const res = await window.prismaFunctions.getSales();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    return res.sales;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
    return;
  }
};
const renderInvoices = async () => {
  const listInvoices = document.getElementById("listInvoices");
  const invoices = await loadInvoices();
  console.log(invoices);

  invoices.forEach((invoice) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>${invoice.fecha}</td>
    <td>${invoice.client.razon_social}</td>
    <td>${invoice.tipo_comprobante + invoice.numero_comprobante}</td>
    <td>$ ${invoice.total.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
    })}</td>
    `;
    row.addEventListener("click", printInvoice(invoice));
    listInvoices.appendChild(row);
  });
};
const printInvoice = (invoice) => {
    
}
renderInvoices();
