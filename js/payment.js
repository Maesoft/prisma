const dateNow = new Date().toISOString().split("T")[0];
const orderNumber = document.querySelector("#orderNumber");
const orderDate = document.querySelector("#paymentDate");
const orderSupply = document.querySelector("#customerName");
const invoiceList = document.querySelector("#invoiceList");
const labelNombreProveedor = document.querySelector("#labelProveedor");
const amount = document.getElementById("amount");
orderDate.value = dateNow;

const loadProviders = async () => {
  try {
    const res = await window.prismaFunctions.getProviders();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Error", res.message);
      return;
    }
    providers = res.providers;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Error", error);
  }
};
const renderProviders = (arrProviders) => {
  const listProviders = document.getElementById("listProviders");
  listProviders.innerHTML = "";
  if (arrProviders.length === 0) {
      listProviders.innerHTML = `
    <tr>
      <td colspan="4">No se encontraron proveedores.</td>
    </tr>`;
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
          idProvider = provider.id;
          orderSupply.value = provider.codigo;
          labelNombreProveedor.textContent = provider.razon_social;
          const modalProviders = bootstrap.Modal.getInstance(
              document.getElementById("modalProviders")
          );
          modalProviders.hide();
      });
      listProviders.appendChild(row);
  });
};
const getLastPayment = async () => {
  const resPayments = await window.prismaFunctions.getPayments();

  if (!resPayments.payments || resPayments.payments.length === 0) {
    orderNumber.value = "00000001"
    return;
  }

  const lastOrder = resPayments.payments.pop();
  orderNumber = Number(lastOrder.nro_comprobante).padStart(8, "0");
};
const getPayMethods = async () => {
  const resMethods = await window.prismaFunctions.getCashes();
  const paymentMethods = resMethods.cashes;
  const paymentMethodSelect = document.querySelector("#paymentMethod");
  if (!paymentMethods || paymentMethods.length === 0) {
    return;
  }

  paymentMethods.forEach((method) => {
    if (method.activa) {
      const option = document.createElement("option");
      option.value = method.id;
      option.textContent = method.nombre;
      paymentMethodSelect.appendChild(option);
    }
  })
  if (paymentMethodSelect.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No hay cajas activas."
    paymentMethodSelect.style.fontSize = "0.9em";
    paymentMethodSelect.setAttribute("disabled", "true");
    paymentMethodSelect.appendChild(option);
  }
};
const selectProvider = async () => {
  await loadProviders();
  const codeToSearch = providers.find(
    (provider) => provider.codigo == orderSupply.value
  );
  if (!codeToSearch) {
    orderSupply.value = "";
    orderSupply.focus();
    labelNombreProveedor.textContent = "Proveedor no encotrado.";
  } else {
    idProvider = codeToSearch.id;
    labelNombreProveedor.textContent = codeToSearch.razon_social;
    amount.focus();
  }
}
const getInvoices = async () => {
  const res = await window.prismaFunctions.getPurchases()
  if(res.success) {
    const invoices = res.purchases
    invoices.forEach((inv)=>{
      const row = document.createElement("option")
      row.value=inv.id;
      row.textContent=inv.tipo_comprobante + inv.numero_comprobante
      invoiceList.appendChild(row)
    })
  }
}
orderSupply.addEventListener("focusout", async () => {
  selectProvider()
});
orderSupply.addEventListener("keyup", async (e) => {
  if (e.key === "F3") {
    const providerSearchModal = new bootstrap.Modal(
      document.getElementById("modalProviders")
    );
    providerSearchModal.show();
    await loadProviders();
    renderProviders(providers);
    setTimeout(() => inputModalProviders.focus(), 200);
  }
  if (e.key === "Enter") {
    selectProvider()
  }
})
document.addEventListener("DOMContentLoaded", async () => {
  await getLastPayment();
  await getPayMethods();
  await getInvoices();
  orderSupply.focus();

});
amount.addEventListener("input", () => {
  amount.value = amount.value.replace(/\./g, ',');
});
amount.addEventListener("blur", () => {
  let raw = amount.value.replace(/\./g, '').replace(',', '.');
  const number = parseFloat(raw);
  if (!isNaN(number)) {
    amount.value = number.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
});