const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('prismaFunctions', {
    addProvider: (providerData) => ipcRenderer.invoke('add-provider', providerData),
    addClient: (clientData) => ipcRenderer.invoke('add-client', clientData),
    addProduct: (productData) => ipcRenderer.invoke('add-product', productData),
    addCategory: (categoryData) => ipcRenderer.invoke('add-category', categoryData),
    addStock: (stockData) => ipcRenderer.invoke('add-stock', stockData),
    getCategories: ()=> ipcRenderer.invoke('get-categories'),
})
