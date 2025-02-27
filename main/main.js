const { app, ipcMain, dialog, Menu } = require("electron");
const { AppDataSource } = require("./data-source");
const WindowManager = require("./windowManager");
const { menuTemplate } = require("../js/menu");
const { Product } = require("../entities/Product");
const { Stock } = require("../entities/Stock");
const { Provider } = require("../entities/Provider");
const { Category } = require("../entities/Category");
const { Client } = require("../entities/Client");
const { Sale } = require("../entities/Sale");
const { Details } = require("../entities/Details");
const { Option } = require("../entities/Options");

//Manejo de la App
app.on("ready", async () => {
  WindowManager.createMainWindow();
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (WindowManager.mainWindow === null) {
    WindowManager.createMainWindow();
  }
});

//Funciones que interactuan con la BD
ipcMain.handle("add-provider", async (event, providerData) => {
  try {
    const providerRepository = AppDataSource.getRepository(Provider);
    const newProvider = providerRepository.create(providerData);
    await providerRepository.save(newProvider);
    return {
      success: true,
      message: "Proveedor guardado exitosamente.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
});
ipcMain.handle("get-providers", async () => {
  try {
    const providerRepository = AppDataSource.getRepository(Provider);
    const providers = await providerRepository.find();
    return { success: true, providers };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("edit-provider", async (event, id, providerData) => {
  try {
    const providerRepository = AppDataSource.getRepository(Provider);

    const editProvider = await providerRepository.findOneBy({ id });

    editProvider.codigo=providerData.codigo
    editProvider.razon_social=providerData.razon_social
    editProvider.cuit=providerData.cuit
    editProvider.direccion=providerData.direccion
    editProvider.telefono=providerData.telefono
    editProvider.email=providerData.email
    editProvider.regimen=providerData.regimen

    await providerRepository.save(editProvider);

    return {
      success: true,
      message: "Proveedor editado exitosamente",
      productId: editProvider.id,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
});
ipcMain.handle("delete-provider", async (event, id) => {
  try {
    const providerRepository = AppDataSource.getRepository(Provider);
    await providerRepository.delete(id);
    return { success: true, message: "Proveedor eliminado exitosamente" };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("add-client", async (event, clientData) => {
  try {
    const clientRepository = AppDataSource.getRepository(Client);
    const newClient = clientRepository.create(clientData);
    await clientRepository.save(newClient);
    return {
      success: true,
      message: "Cliente guardado exitosamente.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
});
ipcMain.handle("get-categories", async () => {
  try {
    const categoriesRepository = AppDataSource.getRepository(Category);
    const categories = await categoriesRepository.find();
    return {
      success: true,
      categories,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener categorías.",
    };
  }
});
ipcMain.handle("add-category", async (event, categoryData) => {
  try {
    const categoriesRepository = AppDataSource.getRepository(Category);
    const newCategory = categoriesRepository.create(categoryData);
    await categoriesRepository.save(newCategory);
    return {
      success: true,
      message: "Categoria guardada exitosamente.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
});
ipcMain.handle("add-product", async (event, productData) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const newProduct = productRepository.create(productData);
    await productRepository.save(newProduct);
    return {
      success: true,
      message: "Producto guardado exitosamente",
      productId: newProduct.id,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
});
ipcMain.handle("edit-product", async (event, id, productData) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);

    const editProduct = await productRepository.findOneBy({ id });

    editProduct.codigo = productData.codigo;
    editProduct.nombre = productData.nombre;
    editProduct.descripcion = productData.descripcion;
    editProduct.imagen = productData.imagen;
    editProduct.categoria = productData.categoria;
    editProduct.stock = productData.stock;
    editProduct.costo = productData.costo;
    editProduct.precio1 = productData.precio1;
    editProduct.precio2 = productData.precio2;

    await productRepository.save(editProduct);

    return {
      success: true,
      message: "Producto editado exitosamente",
      productId: editProduct.id,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
  }
});
ipcMain.handle("delete-product", async (event, id) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    await productRepository.delete(id);
    return { success: true, message: "Producto eliminado exitosamente" };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("get-products", async () => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const products = await productRepository.find({ relations: ["categoria"] });
    return { success: true, products };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("add-stock", async (event, stockData) => {
  try {
    const stockRepository = AppDataSource.getRepository(Stock);
    const newStock = stockRepository.create(stockData);
    await stockRepository.save(newStock);
    return { success: true, message: "Stock actualizado correctamente." };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("add-sale", async (event, saleData) => {
  try {
    const saleRepository = AppDataSource.getRepository(Sale);
    const newSale = saleRepository.create(saleData);
    await saleRepository.save(newSale);
    return {
      success: true,
      message: "Se guardo el comprobante exitosamente",
      saleId: newSale.id,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("get-sales", async () => {
  try {
    const salesRepository = AppDataSource.getRepository(Sale);
    const sales = await salesRepository.find();
    return { success: true, sales };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("add-detail", async (event, detailData) => {
  try {
    const detailRepository = AppDataSource.getRepository(Details);
    const newDetail = detailRepository.create(detailData);
    await detailRepository.save(newDetail);
    return { success: true, message: "Detalle cargado exitosamente." };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("get-clients", async () => {
  try {
    const clientRepository = AppDataSource.getRepository(Client);
    const clients = await clientRepository.find();
    return { success: true, clients };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle(
  "show-message",
  async (event, icono, titulo, mensaje, botones, defaultID) => {
    const res = await dialog.showMessageBox({
      type: icono,
      title: titulo,
      message: mensaje,
      buttons: botones,
      defaultId: defaultID,
    });
    return res.response;
  }
);
ipcMain.handle("save-option", async (event, optionData) => {
  try {
    const optionRepository = AppDataSource.getRepository(Option);

    // Buscar si ya existe un registro
    let existingOption = await optionRepository.findOneBy({});

    if (existingOption) {
      // Actualizar el registro existente
      await optionRepository.update(existingOption.id, optionData);
      return {
        success: true,
        message: "Se actualizaron los datos correctamente.",
      };
    } else {
      // Crear un nuevo registro
      const newOption = optionRepository.create(optionData);
      await optionRepository.save(newOption);
      return {
        success: true,
        message: "Se guardaron los datos correctamente.",
      };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("load-option", async () => {
  try {
    const optionRepository = AppDataSource.getRepository(Option);

    // Buscar el único registro (si existe)
    const options = await optionRepository.findOneBy({});

    if (!options) {
      return { success: false, message: "No hay datos disponibles." };
    }

    return { success: true, options };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
