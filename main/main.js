const { app, ipcMain, Menu } = require('electron');
const { Provider } = require('../entities/Provider')
const { AppDataSource } = require ('./data-source');
const WindowManager = require('./windowManager');
const { menuTemplate } = require('../js/menu');

//Manejo de la App
app.on('ready', async () => {
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


//Funciones que interactuan con la BD
ipcMain.handle('add-provider', async (event, providerData)=> {
  try {
    const providerRepository = AppDataSource.getRepository(Provider)
    const newProvider = providerRepository.create(providerData); 
    await providerRepository.save(newProvider);
    return { success: true, message: 'Proveedor guardado exitosamente' };
  } catch (error) {
    console.error(error);
    return { success: false, message: error };
  }
})