const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("prismaFunctions", {
  openWindow: (windowData) => ipcRenderer.invoke("open-window", windowData),
  onReporteDatos: (callback) =>
    ipcRenderer.on("reporte-datos", (event, data) => callback(data)),
  addProvider: (providerData) =>
    ipcRenderer.invoke("add-provider", providerData),
  getPayments: () => ipcRenderer.invoke("get-payments"),
  getPurchases: () => ipcRenderer.invoke("get-purchases"),
  getProviders: () => ipcRenderer.invoke("get-providers"),
  editProvider: (id, providerData) =>
    ipcRenderer.invoke("edit-provider", id, providerData),
  deleteProvider: (id) => ipcRenderer.invoke("delete-provider", id),
  deleteClient: (id) => ipcRenderer.invoke("delete-client", id),
  addClient: (clientData) => ipcRenderer.invoke("add-client", clientData),
  getClients: () => ipcRenderer.invoke("get-clients"),
  editClient: (id, clientData) =>
    ipcRenderer.invoke("edit-client", id, clientData),
  addProduct: (productData) => ipcRenderer.invoke("add-product", productData),
  getProducts: () => ipcRenderer.invoke("get-products"),
  editProduct: (id, productData) =>
    ipcRenderer.invoke("edit-product", id, productData),
  deleteProduct: (id) => ipcRenderer.invoke("delete-product", id),
  addCategory: (categoryData) =>
    ipcRenderer.invoke("add-category", categoryData),
  getCategories: () => ipcRenderer.invoke("get-categories"),
  getSales: () => ipcRenderer.invoke("get-sales"),
  addStock: (stockData) => ipcRenderer.invoke("add-stock", stockData),
  addSale: (saleData) => ipcRenderer.invoke("add-sale", saleData),
  addPurchase: (purchaseData) =>
    ipcRenderer.invoke("add-purchase", purchaseData),
  addDetailSale: (detailData) =>
    ipcRenderer.invoke("add-detail-sale", detailData),
  addDetailPurchase: (detailData) =>
    ipcRenderer.invoke("add-detail-purchase", detailData),
  showMSG: (icon, title, message, buttons, defaultId) =>
    ipcRenderer.invoke(
      "show-message",
      icon,
      title,
      message,
      buttons,
      defaultId
    ),
  saveOption: (optionData) => ipcRenderer.invoke("save-option", optionData),
  loadOption: () => ipcRenderer.invoke("load-option"),
});
