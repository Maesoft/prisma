const dateNow = new Date().toISOString().split("T")[0];

const orderNumber = document.querySelector("#orderNumber");
const orderDate = document.querySelector("#paymentDate");
const inputClient = document.querySelector("#clientName");
const invoiceList = document.querySelector("#invoiceList");
const invoiceApply = document.querySelector("#invoiceApply");
const labelNombreCliente = document.querySelector("#labelCliente");
const btnGenerate = document.querySelector("#btnGenerate");
const paymentMethodSelect = document.querySelector("#paymentMethod");
const amount = document.getElementById("amount");
orderDate.value = dateNow;

let clients = [];
let idClient = null;

const loadClients = async () => {
  try {
    const res = await window.prismaFunctions.getClients();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Error", res.message);
      return;
    }
    clients = res.clients;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Error", error.message);
  }
};
const renderClients = (arrClients) => {
  const listClients = document.getElementById("listClients");
  listClients.innerHTML = "";

  if (arrClients.length === 0) {
    listClients.innerHTML = `<tr><td colspan="4">No se encontraron clientes.</td></tr>`;
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
      inputClient.value = client.codigo;
      labelNombreCliente.textContent = client.razon_social;
      const modalClients = bootstrap.Modal.getInstance(document.getElementById("modalClients"));
      modalClients.hide();
    });
    listClients.appendChild(row);
  });
};
const getLastReceipt = async () => {
  const resReceipts = await window.prismaFunctions.getReceipts();
  
  if (!resReceipts.receipts || resReceipts.receipts.length === 0) {
    orderNumber.value = "00000001";
    return;
  }
  const lastOrder = resReceipts.receipts.at(-1);
  const nextNumber = (Number(lastOrder.nro_comprobante) + 1).toString().padStart(8, "0");
  orderNumber.value = nextNumber;
};
const getPayMethods = async () => {
  const resMethods = await window.prismaFunctions.getCashes();
  const paymentMethods = resMethods.cashes;
  paymentMethodSelect.innerHTML = "";

  paymentMethods.forEach((method) => {
    if (method.activa) {
      const option = document.createElement("option");
      option.value = method.id;
      option.textContent = method.nombre;
      paymentMethodSelect.appendChild(option);
    }
  });

  if (paymentMethodSelect.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No hay cajas activas.";
    paymentMethodSelect.style.fontSize = "0.9em";
    paymentMethodSelect.setAttribute("disabled", "true");
    paymentMethodSelect.appendChild(option);
  }
};
const selectClient = async () => {
  await loadClients();
  const selected = clients.find((p) => p.codigo == inputClient.value);

  if (!selected) {
    inputClient.value = "";
    inputClient.focus();
    labelNombreCliente.textContent = "Cliente no encontrado.";
  } else {
    idClient = selected.id;
    labelNombreCliente.textContent = selected.razon_social;
    await getInvoices(idClient);
    amount.focus();
  }
}
const getInvoices = async (idClient) => {
  invoiceList.innerHTML = "";
  const res = await window.prismaFunctions.getSales();

  if (res.success) {
    res.sales.forEach((inv) => {
      if (inv.client.id === idClient) {
        const option = document.createElement("option");
        option.value = inv.id;
        option.textContent = inv.tipo_comprobante + inv.numero_comprobante;
        invoiceList.appendChild(option);
      }
    });
  }
};
const moveSelected = (from, to) => {
  Array.from(from.selectedOptions).forEach((opt) => {
    from.removeChild(opt);
    to.appendChild(opt);
  });
}
const validateFields = () => {
  const fecha = new Date(orderDate.value);
  if (isNaN(fecha.getTime())) {
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      "Fecha de pago no válida."
    );
    return false;
  }
  if (inputClient.value === "") {
    window.prismaFunctions.showMSG("error", "Prisma", "Cliente no válido.");
    return false;
  }
  if (amount.value === "") {
    window.prismaFunctions.showMSG("error", "Prisma", "Monto no válido.");
    return false;
  }
  if (isNaN(parseFloat(amount.value.replace(/\./g, "").replace(",", ".")))) {
    window.prismaFunctions.showMSG("error", "Prisma", "Monto no válido.");
    return false;
  }
  if (paymentMethod.value === "No hay cajas activas.") {
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      "No hay cajas activas. Diríjase a 'Caja > Apertura de Caja' para habilitar una caja antes de continuar."
    );
    return false;
  }
  return true;
};
const resetForm = () => {
  inputClient.value = "";
  amount.value = "";
  invoiceList.innerHTML = "";
  invoiceApply.innerHTML = "";
  labelNombreCliente.textContent = "Seleccione un cliente.";
  getLastReceipt();
};
const newReceipt = async () => {
  if (!validateFields()) return;

  const selectedInvoices = Array.from(invoiceApply.options).map((opt) => ({ id: Number(opt.value) }));

  const receiptData = {
    fecha: orderDate.value,
    nro_comprobante: orderNumber.value,
    monto: amount.value.replace(/\./g, "").replace(",", "."),
    facturas: selectedInvoices,
    cliente: { id: idClient },
    caja: { id: Number(paymentMethodSelect.value) },
  };

  const res = await window.prismaFunctions.addReceipt(receiptData);

  if (res.success) {
    window.prismaFunctions.showMSG("info", "Éxito", "Cobro registrado.");
    window.print();
    resetForm();
  } else {
    window.prismaFunctions.showMSG("error", "Error", res.message);
  }
};

// Event listeners
invoiceList.addEventListener("dblclick", () => moveSelected(invoiceList, invoiceApply));
invoiceApply.addEventListener("dblclick", () => moveSelected(invoiceApply, invoiceList));
inputClient.addEventListener("focusout", selectClient);
inputClient.addEventListener("keyup", async (e) => {
  if (e.key === "F3") {
    const clientSearchModal = new bootstrap.Modal(document.getElementById("modalClients"));
    clientSearchModal.show();
    await loadClients();
    renderClients(clients);
    setTimeout(() => inputModalClients.focus(), 200);
  }
  if (e.key === "Enter") selectClient();
});
amount.addEventListener("input", () => {
  amount.value = amount.value.replace(/[^0-9,]/g, "");
});
amount.addEventListener("blur", () => {
  const raw = amount.value.replace(/\./g, "").replace(",", ".");
  const number = parseFloat(raw);
  if (!isNaN(number)) {
    amount.value = number.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
});
btnGenerate.addEventListener("click", newReceipt);
document.addEventListener("DOMContentLoaded", async () => {
  await getLastReceipt();
  await getPayMethods();
  inputClient.focus();
});
