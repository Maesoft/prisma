const dateNow = new Date().toISOString().split("T")[0];

const orderNumber = document.querySelector("#orderNumber");
const orderDate = document.querySelector("#paymentDate");
const orderSupply = document.querySelector("#customerName");
const invoiceList = document.querySelector("#invoiceList");
const invoiceApply = document.querySelector("#invoiceApply");
const labelNombreProveedor = document.querySelector("#labelProveedor");
const btnGenerate = document.querySelector("#btnGenerate");
const paymentMethodSelect = document.querySelector("#paymentMethod");
const amount = document.getElementById("amount");

orderDate.value = dateNow;

let providers = [];
let idProvider = null;

const loadProviders = async () => {
  try {
    const res = await window.prismaFunctions.getProviders();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Error", res.message);
      return;
    }
    providers = res.providers;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Error", error.message);
  }
};

const renderProviders = (arrProviders) => {
  const listProviders = document.getElementById("listProviders");
  listProviders.innerHTML = "";

  if (arrProviders.length === 0) {
    listProviders.innerHTML = `<tr><td colspan="4">No se encontraron proveedores.</td></tr>`;
    return;
  }

  arrProviders.forEach((provider) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${provider.codigo}</td>
      <td>${provider.razon_social}</td>
      <td>${provider.cuit}</td>
      <td>${provider.regimen}</td>`;
    row.addEventListener("click", () => {
      orderSupply.value = provider.codigo;
      labelNombreProveedor.textContent = provider.razon_social;
      const modalProviders = bootstrap.Modal.getInstance(document.getElementById("modalProviders"));
      modalProviders.hide();
    });
    listProviders.appendChild(row);
  });
};

const getLastPayment = async () => {
  const resPayments = await window.prismaFunctions.getPayments();
  
  if (!resPayments.payments || resPayments.payments.length === 0) {
    orderNumber.value = "00000001";
    return;
  }
  const lastOrder = resPayments.payments.at(-1);
  const nextNumber = (Number(lastOrder.nro_comprobante) + 1).toString().padStart(8, "0");
  orderNumber.value = nextNumber;
};

const getPayMethods = async () => {
  const resMethods = await window.prismaFunctions.getCashes();
  const paymentMethods = resMethods.cashes;
  paymentMethodSelect.innerHTML = "";

  if (!paymentMethods || paymentMethods.length === 0) return;

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

const selectProvider = async () => {
  await loadProviders();
  const selected = providers.find((p) => p.codigo == orderSupply.value);

  if (!selected) {
    orderSupply.value = "";
    orderSupply.focus();
    labelNombreProveedor.textContent = "Proveedor no encontrado.";
  } else {
    idProvider = selected.id;
    labelNombreProveedor.textContent = selected.razon_social;
    await getInvoices(idProvider);
    amount.focus();
  }
};

const getInvoices = async (idProvider) => {
  invoiceList.innerHTML = "";
  const res = await window.prismaFunctions.getPurchases();

  if (res.success) {
    res.purchases.forEach((inv) => {
      if (inv.provider.id === idProvider) {
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
};

const validateFields = () => {
  if (!orderSupply.value) {
    window.prismaFunctions.showMSG("error", "Error", "Seleccione un proveedor.");
    return false;
  }
  if (!amount.value) {
    window.prismaFunctions.showMSG("error", "Error", "Ingrese un monto.");
    return false;
  }
  if (!paymentMethodSelect.value) {
    window.prismaFunctions.showMSG("error", "Error", "Seleccione un método de pago.");
    return false;
  }
  if (!orderDate.value) {
    window.prismaFunctions.showMSG("error", "Error", "Seleccione una fecha.");
    return false;
  }
  return true;
};

const resetForm = () => {
  orderSupply.value = "";
  amount.value = "";
  invoiceList.innerHTML = "";
  invoiceApply.innerHTML = "";
  labelNombreProveedor.textContent = "Seleccione un proveedor.";
  getLastPayment();
};

const newPayment = async () => {
  if (!validateFields()) return;

  const selectedInvoices = Array.from(invoiceApply.options).map((opt) => ({ id: Number(opt.value) }));

  const paymentData = {
    fecha: orderDate.value,
    nro_comprobante: orderNumber.value,
    monto: amount.value.replace(/\./g, "").replace(",", "."),
    facturas: selectedInvoices,
    proveedor: { id: idProvider },
    caja: { id: Number(paymentMethodSelect.value) },
  };

  const res = await window.prismaFunctions.addPayment(paymentData);

  if (res.success) {
    window.prismaFunctions.showMSG("info", "Éxito", "Pago registrado.");
    resetForm();
  } else {
    window.prismaFunctions.showMSG("error", "Error", res.message);
  }
};

// Event listeners
invoiceList.addEventListener("dblclick", () => moveSelected(invoiceList, invoiceApply));
invoiceApply.addEventListener("dblclick", () => moveSelected(invoiceApply, invoiceList));

orderSupply.addEventListener("focusout", selectProvider);

orderSupply.addEventListener("keyup", async (e) => {
  if (e.key === "F3") {
    const providerSearchModal = new bootstrap.Modal(document.getElementById("modalProviders"));
    providerSearchModal.show();
    await loadProviders();
    renderProviders(providers);
    setTimeout(() => inputModalProviders.focus(), 200);
  }
  if (e.key === "Enter") selectProvider();
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

btnGenerate.addEventListener("click", newPayment);

document.addEventListener("DOMContentLoaded", async () => {
  await getLastPayment();
  await getPayMethods();
  orderSupply.focus();
});
