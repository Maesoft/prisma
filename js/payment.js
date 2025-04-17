const dateNow = new Date().toISOString().split("T")[0];
const orderNumber = document.querySelector("#orderNumber");
const orderDate = document.querySelector("#paymentDate");
const orderSupply = document.querySelector("#customerName");
orderDate.value = dateNow;

const getLastPayment = async () => {
  const resPayments = await window.prismaFunctions.getPayments();
  if (!resPayments.payments || resInvoices.payments.length < 1) {
    orderNumber.value = "00000001";
    return;
  }
  const lastOrder = resInvoices.sales.pop();
  orderNumber = Number(lastOrder.nro_comprobante).padStart(8, "0");
};
document.addEventListener("DOMContentLoaded", async () => {
  await getLastPayment();
  orderSupply.focus();
});
