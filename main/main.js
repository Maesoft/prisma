const { app, ipcMain, Menu } = require('electron');
const { getRepository } = require('typeorm');  
const {Provider}=require('../entity/Provider')
const WindowManager = require('./windowManager');
const { menuTemplate } = require('../windows/main/menu');


app.on('ready', () => {
  WindowManager.createMainWindow();

  const menu = Menu.buildFromTemplate(menuTemplate);

  Menu.setApplicationMenu(menu);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (WindowManager.mainWindow === null) {
    WindowManager.createMainWindow();
  }
});

ipcMain.handle('add-provider', async (event, providerData)=> {
  try {
    const providerRepository = getRepository(Provider);

    const newProvider = providerRepository.create(providerData);
    
    await providerRepository.save(newProvider);
    
    return { success: true, message: 'Proveedor guardado exitosamente' };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Error al guardar el proveedor' };
  }
})