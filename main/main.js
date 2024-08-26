const { app, ipcMain, Menu } = require('electron');
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
  
})