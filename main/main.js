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
    return { success: true, message: 'Producto guardado exitosamente', productId: newProduct.id, };
  } catch (error) {
    console.error(error);
    return { success: false, message: error };
  }
})
ipcMain.handle('edit-product', async (event, id, productData) => {
  try {
    const productRepository = AppDataSource.getRepository(Product)

    const editProduct = await productRepository.findOneBy({ id });
  
    editProduct.codigo = productData.codigo
    editProduct.nombre = productData.nombre;
    editProduct.descripcion = productData.descripcion;
    editProduct.imagen = productData.imagen;
    editProduct.stock = productData.stock;
    editProduct.costo = productData.costo;
    editProduct.precio1 = productData.precio1;
    editProduct.precio2 = productData.precio2;

    await productRepository.save(editProduct);

    return { success: true, message: 'Producto editado exitosamente', productId: editProduct.id, };
  } catch (error) {
    console.error(error);
    return { success: false, message: error };
  }
})
ipcMain.handle('get-products', async () => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find({relations:["categoria"]});
    return { success: true, products };
  } catch (error) {
    return { success: false, message: error };
  }
});
ipcMain.handle('add-stock', async (event, stockData) => {
  try {
    const stockRepository = AppDataSource.getRepository(Stock);
    const newStock = stockRepository.create(stockData);
    await stockRepository.save(newStock)
    return { success: true, message: 'Stock actualizado correctamente.' }
  } catch (error) {
    console.error(error);
    return { success: false, message: error };
  }
})
ipcMain.handle('get-clients', async ()=>{
  try {
    const clientRepository = AppDataSource.getRepository(Client);
    const clients = await clientRepository.find();
    return { success: true, clients };
  } catch (error) {
    return { success: false, message: error };
  }
})