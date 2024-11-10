const { contextBridge, ipcRenderer } = require('electron')


contextBridge.exposeInMainWorld('prismaFunctions', {
    addProvider: (providerData) => ipcRenderer.invoke('add-provider', providerData),
    addProduct: (productData) => ipcRenderer.invoke('add-product', productData),
    getCategories: ()=> ipcRenderer.invoke('get-categories')
})
