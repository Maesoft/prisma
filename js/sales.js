const resClients = await window.prismaFunctions.getClients();
if (!resClients.success) {
    alert(resClients.message);
    return;
}
const clients = resClients.clients;

const resProducts = await window.prismaFunctions.getProducts();
if (!resProducts.success) {
    alert(resProducts.message);
    return;
}
const products=resProducts.products


document.addEventListener("DOMContentLoaded", function() {
    const fechaVenta = document.getElementById("fechaVenta");
    const fechaActual = new Date().toISOString().split("T")[0];
    fechaVenta.value = fechaActual;
});