const { app, ipcMain, Menu } = require('electron');
const { AppDataSource } = require('./data-source');
const WindowManager = require('./windowManager');
const { menuTemplate } = require('../js/menu');
const { Product } = require('../entities/Product');
const { Stock } = require('../entities/Stock');
const { Provider } = require('../entities/Provider');
const { Category } = require('../entities/Category');
const { Client } = require('../entities/Client');

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
ipcMain.handle('add-provider', async (event, providerData) => {
  try {
    const providerRepository = AppDataSource.getRepository(Provider)
    const newProvider = providerRepository.create(providerData);
    await providerRepository.save(newProvider);
    return {
      success: true,
      message: 'Proveedor guardado exitosamente.'
    };
  } catch (error) {
    return {
      success: false,
      message: error
    };
  }
})
ipcMain.handle('add-client', async (event, clientData) => {
  try {
    const clientRepository = AppDataSource.getRepository(Client)
    const newClient = clientRepository.create(clientData);
    await clientRepository.save(newClient);
    return {
      success: true,
      message: 'Cliente guardado exitosamente.'
    };
  } catch (error) {
    return {
      success: false,
      message: error
    };
  }
})
ipcMain.handle('get-categories', async () => {
  try {
    const categoriesRepository = AppDataSource.getRepository(Category);
    const categories = await categoriesRepository.find();
    return {
      success: true,
      categories
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener categorías.'
    };
  }
});
ipcMain.handle('add-category', async (event, categoryData) => {
  try {
    const categoriesRepository = AppDataSource.getRepository(Category)
    const newCategory = categoriesRepository.create(categoryData)
    await categoriesRepository.save(newCategory);
    return {
      success: true,
      message: 'Categoria guardada exitosamente.'
    };

  } catch (error) {
    return {
      success: false,
      message: error
    };
  }
});
ipcMain.handle('add-product', async (event, productData) => {
  try {
    const productRepository = AppDataSource.getRepository(Product)
    const newProduct = productRepository.create(productData);
    await productRepository.save(newProduct);
    return { success: true, message: 'Producto guardado exitosamente' };
  } catch (error) {
    console.error(error);
    return { success: false, message: error };
  }
})
