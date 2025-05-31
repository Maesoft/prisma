const inputModalClients = document.getElementById("inputModalClients");
const inputCodigoCliente = document.getElementById("inputCodigoCliente");
const labelNombreCliente = document.getElementById("nombreCliente");
const inputCodigoProducto = document.getElementById("codigoProducto");
const inputModalProduct = document.getElementById("inputModalProducts");
const tipoComprobante = document.getElementById("tipoComprobante");
const tablaProductos = document.getElementById("tablaProductos");
const ptoVta = document.getElementById("ptoVta");
const nroComp = document.getElementById("nroComp");
const observacion = document.getElementById("observacion");
const fechaVenta = document.getElementById("fechaVenta");
const fechaActual = new Date().toISOString().split("T")[0];
const codigoProducto = document.getElementById("codigoProducto");
const btnCobrar = document.getElementById("btnCobrar");
const totalDisplay = document.getElementById("total");

let total = 0;
let idClient = 0;
let clients = [];
let products = [];
let productsSales = [];
let saleDetail = [];

fechaVenta.value = fechaActual;
inputCodigoCliente.focus();

const formatearFecha = (fechaISO) => {
  const [anio, mes, dia] = fechaISO.split("-");
  return `${dia}-${mes}-${anio}`;
};
const loadClients = async () => {
  try {
    const res = await window.prismaFunctions.getClients();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Error", res.message);
      return;
    }
    clients = res.clients;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Error", error);
  }
};
const renderClients = (arrClients) => {
  const listClient = document.getElementById("listClient");
  listClient.innerHTML = "";
  if (arrClients.length === 0) {
    listClient.innerHTML = `
      <tr>
        <td colspan="4">No se encontraron clientes.</td>
      </tr>`;
    return;
  }
  arrClients.forEach((client) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${client.codigo}</td>
        <td>${client.razon_social}</td>
        <td>${client.cuit}</td>
        <td>${client.regimen}</td>`;
    row.addEventListener("click", () => {
      idClient = client.id;
      inputCodigoCliente.value = client.codigo;
      labelNombreCliente.textContent = client.razon_social;
      const modalClients = bootstrap.Modal.getInstance(
        document.getElementById("modalClients")
      );
      modalClients.hide();
    });
    listClient.appendChild(row);
  });
};
const loadProducts = async () => {
  try {
    const res = await window.prismaFunctions.getProducts();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Error", res.message);
      return;
    }
    products = res.products;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Error", error);
  }
};
const renderProducts = (arrProducts) => {
  const listProducts = document.getElementById("listProducts");
  listProducts.innerHTML = "";
  if (arrProducts.length === 0) {
    listProducts.innerHTML = `
      <tr>
        <td colspan="4">No se encontraron productos.</td>
      </tr>`;
    return;
  }
  arrProducts.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${product.codigo}</td>
        <td>${product.nombre}</td>
        <td>${product.categoria.name}</td>
        <td>${product.stock}</td>`;
    row.addEventListener("click", () => {
      addProductToSale(product);
      const modalProducts = bootstrap.Modal.getInstance(
        document.getElementById("modalProducts")
      );
      calculateTotal();
      modalProducts.hide();
    });
    listProducts.appendChild(row);
  });
};
const renderProductSales = () => {
  tablaProductos.innerHTML = "";

  productsSales.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="codigo">${product.codigo}</td>
      <td>${product.nombre}</td>
      <td>
        <input 
          type="number" 
          value="${product.cantidad}" 
          min="1" 
          max="${product.stock}"
          data-index="${index}" 
          class="cantidad-input h-25 w-50"
        />
      </td>
      <td>
        <select class="precio-select" data-index="${index}">
          
        </select>
      </td>
      <td class="total-cell">
      
      </td>
      <td><button class="btn btn-remove" data-index="${index}">✖</button></td>
    `;

    tablaProductos.appendChild(row);
    const selectPrecio = row.querySelector(".precio-select");

    product.precios.sort((a, b) => {
      const strA = String(a.titulo); // Convertimos en string
      const strB = String(b.titulo);

      const isANumber = /^\d/.test(strA);
      const isBNumber = /^\d/.test(strB);

      if (isANumber && !isBNumber) return 1; // Números van después de letras
      if (!isANumber && isBNumber) return -1; // Letras van primero

      return strA.localeCompare(strB, "es", { numeric: true });
    });

    product.precios.forEach((price) => {
      const option = document.createElement("option");
      option.value = price.precio;
      option.textContent = `${price.titulo} - $ ${price.precio.toLocaleString(
        "es-AR",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}`;
      selectPrecio.appendChild(option);
    });

    updateSubTotal({ target: selectPrecio });
  });

  // Actualizar totales cuando cambie la cantidad o el precio seleccionado
  const cantidadInputs = document.querySelectorAll(".cantidad-input");
  const precioSelects = document.querySelectorAll(".precio-select");

  cantidadInputs.forEach((input) => {
    input.addEventListener("input", updateSubTotal);
  });

  precioSelects.forEach((select) => {
    select.addEventListener("change", updateSubTotal);
    select.addEventListener("contextmenu", replaceSelect);
  });
  // Escuchar eventos en boton eliminar
  const btnsDelete = document.querySelectorAll(".btn-remove");
  btnsDelete.forEach((btn) => {
    btn.addEventListener("click", deleteItem);
  });
};
const replaceSelect = (event) => {
  const select = event.currentTarget;
  const input = document.createElement("input");
  input.type = "number";
  input.step = "1";
  input.className = "precio-input";
  input.value = select.value;

  // Reemplazar el select por el input
  select.parentNode.replaceChild(input, select);
  input.focus();
  input.select();
  input.addEventListener("keyup", (e) => {
    if (e.key == "Enter") {
      const newSelect = document.createElement("select");
      newSelect.className = "precio-select";
      const option = document.createElement("option");
      option.value = input.value;
      option.textContent = parseFloat(input.value).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      newSelect.appendChild(option);

      // Reasignar los eventos necesarios
      newSelect.addEventListener("change", updateSubTotal);
      newSelect.addEventListener("contextmenu", replaceSelect);
      input.parentNode.replaceChild(newSelect, input);
      updateSubTotal({ target: newSelect });
    }
  });
};
const deleteItem = (event) => {
  const target = event.target;
  const row = target.closest("tr");
  const rowIndex = Array.from(tablaProductos.rows).indexOf(row);

  if (rowIndex === -1) return;

  const productToRemove = productsSales[rowIndex];
  if (productToRemove) {
    productsSales = productsSales.filter(
      (product, index) => index !== rowIndex
    );
  }

  const saleDetailIndex = saleDetail.findIndex(
    (detail) => detail.producto === productToRemove.nombre
  );
  if (saleDetailIndex !== -1) {
    saleDetail.splice(saleDetailIndex, 1);
  }

  row.remove();
  calculateTotal();
};
const updateSubTotal = (event) => {
  const target = event.target;
  const row = target.closest("tr"); //closest selecciona el elemento "tr" mas cercano al taget

  if (!row) {
    console.error("No se encontró la fila asociada.");
    return;
  }

  const cantidadInput = row.querySelector(".cantidad-input");
  const precioSelect = row.querySelector(".precio-select");
  const totalCell = row.querySelector(".total-cell");

  if (!cantidadInput || !precioSelect || !totalCell) {
    console.error(
      "No se encontraron los elementos necesarios en la fila:",
      row
    );
    return;
  }

  const cantidad = parseFloat(cantidadInput.value) || 0;
  const precio = parseFloat(precioSelect.value) || 0;
  const subtotal = cantidad * precio;

  totalCell.textContent = subtotal.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Actualizar la cantidad en el array productsSales
  const index = parseInt(cantidadInput.dataset.index);
  if (productsSales[index]) {
    productsSales[index].cantidad = cantidad;
  }

  calculateTotal();
};
const calculateTotal = () => {
  const totalCells = document.querySelectorAll(".total-cell");
  total = 0;

  totalCells.forEach((cell) => {
    const subtotal =
      parseFloat(cell.textContent.replace(/\./g, "").replace(",", ".")) || 0;
    total += subtotal;
  });

  if (totalDisplay) {
    totalDisplay.textContent = total.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
};
const addProductToSale = (product) => {
  const existingProduct = productsSales.find(
    (item) => item.codigo === product.codigo
  );
  if (product.controla_stock) {
    if (product.stock > 0) {
      if (existingProduct) {
        if (existingProduct.cantidad < existingProduct.stock) {
          existingProduct.cantidad += 1;
          existingProduct.total =
            existingProduct.cantidad * existingProduct.precios[0].precio;
        } else {
          window.prismaFunctions.showMSG(
            "warning",
            "Stock Insuficiente",
            `No puedes agregar más de ${product.stock} unidades de ${product.nombre}.`
          );
          return;
        }
      } else {
        productsSales.push({
          id: product.id,
          codigo: product.codigo,
          nombre: product.nombre,
          controla_stock: product.controla_stock,
          stock: product.stock,
          cantidad: 1,
          precios: product.precios,
          total: product.precios[0].precio,
        });
      }
    } else {
      window.prismaFunctions.showMSG(
        "info",
        "Stock Faltante",
        `El producto ${product.nombre} no tiene stock suficiente.`
      );
      return;
    }
  } else {
    // Si el producto no controla stock, se agrega sin restricciones
    if (existingProduct) {
      existingProduct.cantidad += 1;
      existingProduct.total =
        existingProduct.cantidad * existingProduct.precios[0].precio;
    } else {
      productsSales.push({
        id: product.id,
        codigo: product.codigo,
        nombre: product.nombre,
        controla_stock: product.controla_stock,
        stock: null,
        cantidad: 1,
        precios: product.precios,
        total: product.precio,
      });
    }
  }
  renderProductSales();
};
const collect = async () => {
  if (!inputCodigoCliente.value || total === 0 || !fechaVenta.value) {
    window.prismaFunctions.showMSG(
      "error",
      "Error",
      "Verifique si ingresó un cliente, productos y una fecha válida."
    );
    return;
  }
  for (const product of productsSales) {
    if (product.controla_stock && product.stock < product.cantidad) {
      window.prismaFunctions.showMSG(
        "info",
        "Stock Faltante",
        `El producto ${product.nombre} no tiene suficiente stock.`
      );
      return;
    }
  }
  const saleData = {
    fecha: fechaVenta.value,
    tipo_comprobante: tipoComprobante.value,
    numero_comprobante: `${ptoVta.value}-${nroComp.value}`,
    client: idClient,
    total: total,
    observacion: observacion.value,
  };

  if (tipoComprobante.selectedOptions[0].innerText == "Presupuesto") {
    for (let i = 0; i < tablaProductos.rows.length; i++) {
      const row = tablaProductos.rows[i];
      const precioUnitarioSelect = row.cells[3].querySelector("select");
      const cantidadInput = row.cells[2].querySelector("input");

      saleDetail.push({
        producto: row.cells[1].innerText,
        cantidad: parseInt(cantidadInput.value),
        precio_unitario: parseFloat(precioUnitarioSelect.value),
        subtotal: parseFloat(
          row.cells[4].innerText.replace(/\./g, "").replace(",", ".")
        ),
      });
    }
    await printSale();
    cleanFields();
  } else {
    try {
      const saleResponse = await window.prismaFunctions.addSale(saleData);
      const saleId = saleResponse.saleId;
      if (!saleId) {
        throw new Error("No se pudo obtener el ID de la venta.");
      }

      for (let i = 0; i < tablaProductos.rows.length; i++) {
        const row = tablaProductos.rows[i];
        const precioUnitarioSelect = row.cells[3].querySelector("select");
        const cantidadInput = row.cells[2].querySelector("input");

        saleDetail.push({
          producto: row.cells[1].innerText,
          cantidad: parseInt(cantidadInput.value),
          precio_unitario: parseFloat(precioUnitarioSelect.value),
          subtotal: parseFloat(
            row.cells[4].innerText.replace(/\./g, "").replace(",", ".")
          ),
          sale: saleId,
        });
      }
      await window.prismaFunctions.addDetailSale(saleDetail);
      updateStock();
      await printSale();
      cleanFields();
    } catch (error) {
      window.prismaFunctions.showMSG("error", "Prisma", error.message);
    }
  }
};
const cleanFields = () => {
  productsSales = [];
  saleDetail = [];
  ptoVta.value = "";
  nroComp.value = "";
  observacion.value = "";
  inputCodigoCliente.value = "";
  labelNombreCliente.textContent = "";
  total = 0;
  idClient = 0;
  tablaProductos.innerHTML = "";
  totalDisplay.textContent = "0.00";
  getLastInvoice();
};
const printSale = async () => {
  const resDatosEmpresa = await window.prismaFunctions.loadOption();
  if (!resDatosEmpresa.success) {
    await window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      "Debe cargar los datos de su empresa para poder imprimir comprobantes. Ir a Archivo->Opciones y cargar los datos solicitados."
    );
    return;
  }

  // Datos de la empresa y cliente
  const { nombre, cuit, domicilio, telefono, logo } = resDatosEmpresa.options;
  const clientSelect = clients.find((client) => client.id == idClient);

  // Aseguramos que el logo tenga el prefijo base64 si es necesario.
  const logoSrc = logo.startsWith("data:image/")
    ? logo
    : `data:image/png;base64,${logo}`;

  // Función para insertar los detalles de la factura
  const insertSaleDetailRows = (win, isTicket = false) => {
    const tabla = win.document.getElementById("detalle-factura");
    saleDetail.forEach((product) => {
      const row = win.document.createElement("tr");
      if (isTicket) {
        row.innerHTML = `
          <td>${product.cantidad}</td>
          <td>${product.producto}</td>
          <td>${product.subtotal.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</td>`;
      } else {
        row.innerHTML = `
          <td>${product.cantidad}</td>
          <td>${product.producto}</td>
          <td>${product.precio_unitario.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</td>
          <td>${product.subtotal.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}</td>`;
      }
      tabla.appendChild(row);
    });
  };

  // Función que abre una ventana, escribe el contenido y se encarga de la impresión
  const openAndPrint = (contenido, width, height, isTicket = false) => {
    const ventana = window.open("", "", `width=${width},height=${height}`);
    ventana.document.write(contenido);
    ventana.document.close();

    // Función de sondeo para esperar a que exista la tabla "detalle-factura"
    const waitForTable = () => {
      const tabla = ventana.document.getElementById("detalle-factura");
      if (tabla) {
        insertSaleDetailRows(ventana, isTicket);
        // Esperamos un poco más para asegurarnos de que todo se renderice bien
        setTimeout(() => {
          ventana.print();
          ventana.onafterprint = () => ventana.close();
        }, 300);
      } else {
        setTimeout(waitForTable, 100);
      }
    };
    waitForTable();
  };

  // Generación del HTML para Ticket o A4
  let htmlContent = "";
  if (tipoComprobante.selectedOptions[0].innerText.includes("Ticket")) {
    htmlContent = `
      <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ticket de Venta</title>
    <link rel="stylesheet" href="../css/bootstrap.min.css" />
    <script defer src="../js/bootstrap.min.js"></script>
    <style>
        @page { size: auto; margin: 0; }
        body { font-size: 12px; margin: 0; padding: 0; width: 58mm; }
        .container { width: 58mm; max-width: 100%; padding: 5px; text-align: center; }
        .border { padding: 5px; }
        p, h3 { margin: 2px 0; font-size: 10px; }
        hr { margin: 5px 0; }
        table { width: 100%; margin-bottom: 5px; }
        th, td { font-size: 10px; text-align: left; }
        img { display: block !important; max-width: 100% !important; height: auto !important; }
        @media print {
            body, .container { width: 58mm; margin: 0; padding: 0; }
            img { max-width: 100% !important; }
        }
    </style>
</head>
<body class="container">
    <div class="border">
        <img src="${logoSrc}" alt="Logo" width="40" class="mb-1">
        <h3 class="fw-bold">${nombre}</h3>
        <p>CUIT: ${cuit}</p>
        <p>${domicilio}</p>
        <p>Tel: ${telefono}</p>
        <hr>
        <p class="fw-bold">${
          tipoComprobante.options[tipoComprobante.selectedIndex].text
        }</p>
        <p>Fecha: ${formatearFecha(fechaVenta.value)}</p>
        <p>No. Comp: ${ptoVta.value}-${nroComp.value}</p>
        <hr>
        <p><strong>Cliente:</strong> ${clientSelect.razon_social}</p>
        <p><strong>CUIT:</strong> ${clientSelect.cuit}</p>
        <hr>
        <table>
            <thead>
                <tr>
                    <th style="width: 20%;">Cant</th>
                    <th style="width: 50%;">Desc</th>
                    <th style="width: 30%;">$</th>
                </tr>
            </thead>
            <tbody id="detalle-factura">
                <!-- Se insertarán los productos -->
            </tbody>
        </table>
        <hr>
        <p class="fs-6 fw-bold">Total: $ ${total.toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}</p>
        <hr>
        <p class="mb-1">${observacion.value}</p>
        <p class="fw-bold">¡Gracias por su compra!</p>
    </div>
</body>
</html>
`;
    openAndPrint(htmlContent, 200, 500, true);
  } else {
    htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Factura</title>
          <link rel="stylesheet" href="../css/bootstrap.min.css" />
          <script defer src="../js/bootstrap.min.js"></script>
          <style>
              /* Estilos básicos */
              .container { 
              margin-top: 20px;
              width: 100vw !important;
              max-width: 100% !important;
              }
          </style>
      </head>
      <body>
        <div class="container my-4">
          <img src="${logoSrc}" alt="Logo de la empresa" class="img-fluid" id="logo-empresa" style="width:50px">
          <div class="row border-bottom pb-3">
              <div class="col-4">
                <h3 class="mb-0 mt-0">${nombre}</h3>
                <p class="mb-0 mt-0">${cuit}</p>
                <p class="mb-0 mt-0">${domicilio}</p>
                <p class="mb-0 mt-0">${telefono}</p>
              </div>
              <div class="col-4 text-center">
                  <h1 class="display-6" id="tipo-comprobante">
                    ${
                      tipoComprobante.options[tipoComprobante.selectedIndex]
                        .text
                    }
                  </h1>
              </div>
              <div class="col-4 text-center">
                  <p><strong>Fecha:</strong> <span id="fecha-comprobante">${formatearFecha(
                    fechaVenta.value
                  )}</span></p>
                  <p class="mb-0"><strong>No. Comprobante:</strong></p>
                  <p class="mt-0">${ptoVta.value}-${nroComp.value}</p>
              </div>
          </div>
          <div class="row mt-4 border-bottom">
              <div class="col-6">
                  <p><strong>Razón Social: </strong>${
                    clientSelect.razon_social
                  }</p>
                  <p><strong>CUIT: </strong>${clientSelect.cuit}</p>
              </div>
              <div class="col-6">
                  <p><strong>Teléfono: </strong>${clientSelect.telefono}</p>
                  <p><strong>Domicilio: </strong>${clientSelect.direccion}</p>
              </div>
          </div>
          <div class="row mt-4">
              <div class="col-12">
                  <table class="table table-bordered">
                      <colgroup>
                          <col style="width: 5%">
                          <col style="width: 55%">
                          <col style="width: 20%">
                          <col style="width: 20%">
                      </colgroup>
                      <thead class="table-light">
                          <tr>
                              <th>Cantidad</th>
                              <th>Descripción</th>
                              <th>Precio Unitario</th>
                              <th>Subtotal</th>
                          </tr>
                      </thead>
                      <tbody id="detalle-factura">
                          <!-- Se insertarán los productos -->
                      </tbody>
                  </table>
              </div>
          </div>
          <div class="row mt-4">
              <div class="col-12 text-end">
                  <p class="fs-5"><strong>Total:</strong> <span>$ ${total.toLocaleString(
                    "es-AR",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}</span></p>
              </div>
          </div>
          <p>${observacion.value}</p>
        </div>
      </body>
      </html>
    `;
    openAndPrint(htmlContent, 800, 1100, false);
  }
};
const updateStock = () => {
  productsSales.forEach(async (product) => {

    if (product.controla_stock) {
      const productData = {
        stock: product.stock - product.cantidad,
      };
      const stockData = {
        producto: { id: product.id },
        detalle: `Venta - ${tipoComprobante.value + ptoVta.value}-${
          nroComp.value
        }`,
        operacion: "Egreso",
        cantidad: -product.cantidad,
        stockResultante: product.stock - product.cantidad,
      };

      await window.prismaFunctions.editProduct(product.id, productData);
      await window.prismaFunctions.addStock(stockData);
    }
  });
};
const getLastInvoice = async () => {
  const resInvoices = await window.prismaFunctions.getSales();

  if (!resInvoices.sales || resInvoices.sales.length < 1) {
    ptoVta.value = "0000";
    nroComp.value = "00000001";
    return;
  }
  const lastInvoice = resInvoices.sales.pop();
  tipoComprobante.value = lastInvoice.tipo_comprobante;
  const [ptoVtaPart, nroCompPart] = lastInvoice.numero_comprobante.split("-");

  const formattedPtoVta = ptoVtaPart.padStart(4, "0");
  const formattedNroComp = (parseInt(nroCompPart) + 1)
    .toString()
    .padStart(8, "0");
  ptoVta.value = formattedPtoVta;
  nroComp.value = formattedNroComp;
};
inputCodigoCliente.addEventListener("keyup", async (event) => {
  if (event.key === "F3") {
    const clientSearchModal = new bootstrap.Modal(
      document.getElementById("modalClients")
    );
    clientSearchModal.show();
    await loadClients();
    renderClients(clients);
    setTimeout(() => inputModalClients.focus(), 200);
  }
  if (event.key === "Enter") {
    await loadClients();
    const codeToSearch = clients.find(
      (client) => client.codigo == inputCodigoCliente.value
    );
    if (!codeToSearch) {
      inputCodigoCliente.value = "";
      inputCodigoCliente.focus();
      labelNombreCliente.textContent = "Cliente no encotrado.";
    } else {
      idClient = codeToSearch.id;
      labelNombreCliente.textContent = codeToSearch.razon_social;
      codigoProducto.focus();
    }
  }
});
inputCodigoCliente.addEventListener("focusout", async () => {
  await loadClients();
  const codeToSearch = clients.find(
    (client) => client.codigo == inputCodigoCliente.value
  );
  if (!codeToSearch) {
    inputCodigoCliente.value = "";
    inputCodigoCliente.focus();
    labelNombreCliente.textContent = "Cliente no encotrado.";
  } else {
    idClient = codeToSearch.id;
    labelNombreCliente.textContent = codeToSearch.razon_social;
    codigoProducto.focus();
  }
});
inputCodigoProducto.addEventListener("keyup", async (event) => {
  if (event.key === "F3") {
    const productsModal = new bootstrap.Modal(
      document.getElementById("modalProducts")
    );
    productsModal.show();
    await loadProducts();
    renderProducts(products);
    setTimeout(() => inputModalProduct.focus(), 200);
  }
  if (event.key === "Enter") {
    await loadProducts();
    const codeToSearch = products.find(
      (product) => product.codigo == inputCodigoProducto.value
    );
    if (!codeToSearch) {
      inputCodigoProducto.value = "";
      inputCodigoProducto.focus();
      return;
    }
    addProductToSale(codeToSearch);
    inputCodigoProducto.value = "";
    inputCodigoProducto.focus();
    calculateTotal();
  }
});
inputModalClients.addEventListener("input", (e) => {
  const criterio = e.target.value;
  const filteredClients = clients.filter((client) =>
    client.razon_social.toLowerCase().includes(criterio.toLowerCase())
  );
  renderClients(filteredClients);
});
inputModalProduct.addEventListener("input", (e) => {
  const criterio = e.target.value;
  const filteredProducts = products.filter((product) =>
    product.nombre.toLowerCase().includes(criterio.toLowerCase())
  );
  renderProducts(filteredProducts);
});
ptoVta.addEventListener("focusout", () => {
  if (ptoVta.value.length < 4) {
    ptoVta.value = ptoVta.value.padStart(4, "0");
  }
  nroComp.focus();
});
nroComp.addEventListener("focusout", () => {
  if (nroComp.value.length < 8) {
    nroComp.value = nroComp.value.padStart(8, "0");
  }
});
btnCobrar.addEventListener("click", collect);
document.addEventListener("DOMContentLoaded", getLastInvoice);
