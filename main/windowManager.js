const { BrowserWindow } = require('electron');
const path = require('path');

class WindowManager {
  constructor() {
    this.mainWindow = null;
    this.windows = {};
  }

  createMainWindow() {
    this.mainWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      icon: path.join(__dirname, '../assets/winico.png'),     
      webPreferences: {
        preload: path.join(__dirname, '../preload/preload.js')
      }
    });
    this.mainWindow.maximize()
    this.mainWindow.loadFile(path.join(__dirname, '../windows/main.html'));
    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  createWindow(name, width, height, frame, modal) {
    if (this.windows[name]) {
      this.windows[name].show();
      return this.windows[name]; 
    }
  
    this.windows[name] = new BrowserWindow({
      parent: this.mainWindow,
      width,
      height,
      frame,
      modal,
      icon: path.join(__dirname, '../assets/winico.png'),
      resizable: false,
      maximizable: false,
      minimizable: true,
      closable: true,
      titleBarStyle: 'default',
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: true,
      webPreferences: {
        preload: path.join(__dirname, '../preload/preload.js')
      }
    });
  
    // this.windows[name].webContents.openDevTools();
  
    this.windows[name].setMenu(null);
    this.windows[name].loadFile(path.join(__dirname, `../windows/${name}.html`));
  
    this.windows[name].on('closed', () => {
      delete this.windows[name];
    });
  
    return this.windows[name]; 
  }
}

module.exports = new WindowManager();
