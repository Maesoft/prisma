const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("prismaFunctions", {
  addProvider: (providerData) =>
    ipcRenderer.invoke("add-provider", providerData),
  getProviders: () => ipcRenderer.invoke("get-providers"),
  editProvider: (id, providerData) =>
    ipcRenderer.invoke("edit-provider", id, providerData),
  deleteProvider: (id) => ipcRenderer.invoke("delete-provider",id),
  addClient: (clientData) => ipcRenderer.invoke("add-client", clientData),
  getClients: () => ipcRenderer.invoke("get-clients"),
  addProduct: (productData) => ipcRenderer.invoke("add-product", productData),
  getProducts: () => ipcRenderer.invoke("get-products"),
  editProduct: (id, productData) =>
    ipcRenderer.invoke("edit-product", id, productData),
  deleteProduct: (id) => ipcRenderer.invoke("delete-product",id),
  addCategory: (categoryData) =>
    ipcRenderer.invoke("add-category", categoryData),
  getCategories: () => ipcRenderer.invoke("get-categories"),
  getSales: () => ipcRenderer.invoke("get-sales"),
  addStock: (stockData) => ipcRenderer.invoke("add-stock", stockData),
  addSale: (saleData) => ipcRenderer.invoke("add-sale", saleData),
  addDetail: (detailData) => ipcRenderer.invoke("add-detail", detailData),
  showMSG: (icon, title, message, buttons, defaultId) => ipcRenderer.invoke("show-message", icon, title, message, buttons, defaultId),
  saveOption: (optionData) => ipcRenderer.invoke("save-option", optionData),
  loadOption: () => ipcRenderer.invoke("load-option"),
});
