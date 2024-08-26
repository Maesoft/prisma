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
      webPreferences: {
        preload: path.join(__dirname, '../preload/preload.js')
      }
    });
    
    this.mainWindow.loadFile(path.join(__dirname, '../windows/main/main.html'));

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  }

  createWindow(name, width, height) {
    if (this.windows[name]) {
      this.windows[name].show();
      return;
    }

    this.windows[name] = new BrowserWindow({
      parent: this.mainWindow, // Establecer la ventana principal como padre
      modal: true,
      width,
      height,
      contextIsolation: true,
      webPreferences: {
        preload: path.join(__dirname, '../preload/preload.js')
      }
    });
    
    this.windows[name].setMenu(null);
    this.windows[name].loadFile(path.join(__dirname, `../windows/${name}/${name}.html`));

    this.windows[name].on('closed', () => {
      delete this.windows[name];
    });
  }
}

module.exports = new WindowManager();
