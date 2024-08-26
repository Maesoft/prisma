const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('prismaFunctions', {
    addProvider: (providerData) => ipcRenderer.invoke('add-provider', providerData),
    addClient: (clientData) => ipcRenderer.invoke('add-client', clientData)
})