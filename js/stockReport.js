const fechaActual = new Date().toISOString().split("T")[0];
const reportTable = document.querySelector("tbody");
const total = document.querySelector("#totalStock");
const fechaEmision = document.querySelector(".fechaEmision");
let products = [];
const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}/${mes}/${anio}`;
};
const loadProducts = async () => {
  try {
    const res = await window.prismaFunctions.getProducts();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }

    const allProducts = res.products;
    allProducts.forEach((product) => {
      if (product.controla_stock) {
        products.push(product)
      }
    })
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};
const makeReport = async () => {
  await loadProducts();
  const totalStock = products.reduce(
    (acumulador, productoActual) =>
      acumulador + productoActual.costo * productoActual.stock,
    0
  );

  fechaEmision.innerHTML = 'Emitido el ' + formatearFecha(fechaActual)
  reportTable.innerHTML = "";

  reportTable.innerHTML = `
    ${products
      .map((product) => {
        const ultMovimiento = product.stockMovements?.[product.stockMovements.length - 1];

        return `<tr>
          <td>${product.codigo}</td>
          <td>${product.nombre}</td>
          <td class="text-center">${product.stock}</td>
          <td class="text-center">${product.costo}</td>
          <td class="text-center">${(product.costo * product.stock).toFixed(2)}</td>
          <td class="text-center">${ultMovimiento?.fecha.toLocaleDateString("es-AR") || 'Ninguno.'}</td>
        </tr>`;
      })
      .join("")}
  `;
  total.innerHTML = `Valor Inventario: $ ${totalStock.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
  })}`;
  setTimeout(() => {
    window.document.close();
    window.print();
    window.onafterprint = () => window.close();
  }, 1000);
};

makeReport();
