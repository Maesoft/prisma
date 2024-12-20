const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("prismaFunctions", {
  addProvider: (providerData) =>
    ipcRenderer.invoke("add-provider", providerData),
  addClient: (clientData) => ipcRenderer.invoke("add-client", clientData),
  getClients: () => ipcRenderer.invoke("get-clients"),
  addProduct: (productData) => ipcRenderer.invoke("add-product", productData),
  getProducts: () => ipcRenderer.invoke("get-products"),
  editProduct: (id, productData) =>
    ipcRenderer.invoke("edit-product", id, productData),
  addCategory: (categoryData) =>
    ipcRenderer.invoke("add-category", categoryData),
  getCategories: () => ipcRenderer.invoke("get-categories"),
  addStock: (stockData) => ipcRenderer.invoke("add-stock", stockData),
});
