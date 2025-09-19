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
const { Option } = require("../entities/Options");
const { Price } = require("../entities/Price");
const { DetailsSale } = require("../entities/DetailsSale");
const { DetailsPurchase } = require("../entities/DetailsPurchase");
const { Purchase } = require("../entities/Purchase");
const { Payment } = require("../entities/Payment");
const { CashManagement } = require("../entities/CashManagement");
const { Receipt } = require("../entities/Receipt");
const { Tax } = require("../entities/Tax");
const { TaxSales } = require("../entities/TaxSales");
const { TaxPurchases } = require("../entities/TaxPurchases");

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

//Funciones Genearales
ipcMain.handle("open-window", async (event, windowData) => {
  const { windowName, width, height, frame, modal, data } = windowData;
  try {
    const win = WindowManager.createWindow(
      windowName,
      width,
      height,
      frame,
      modal
    );

    if (win) {
      win.once("ready-to-show", () => {
        if (data) {
          win.webContents.send("reporte-datos", data);
        }
        win.show();
        win.focus();
      });
    }
  } catch (error) {
    console.error("Error al abrir la ventana:", error);
  }
});

//Funciones que interactuan con la BD
ipcMain.handle("add-cash", async (event, cashData) => {
  try {
    const cashRepository = AppDataSource.getRepository(CashManagement);
    const newCash = cashRepository.create(cashData);
    await cashRepository.save(newCash);
    return {
      success: true,
      message: "Caja creada exitosamente.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
});
ipcMain.handle("edit-cash", async (event, id, cashData) => {
  try {
    const cashRepository = AppDataSource.getRepository(CashManagement);

    const editCash = await cashRepository.findOneBy({ id });

    editCash.codigo = cashData.codigo;
    editCash.nombre = cashData.nombre;
    editCash.fecha_apertura = cashData.fecha_apertura;
    editCash.fecha_cierre = cashData.fecha_cierre;
    editCash.saldo_inicial = cashData.saldo_inicial;
    editCash.saldo_final = cashData.saldo_final;
    editCash.activa = cashData.activa;

    await cashRepository.save(editCash);
    return {
      success: true,
      message: "Caja editada exitosamente",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
});
ipcMain.handle("get-cashes", async () => {
  try {
    const cashRepository = AppDataSource.getRepository(CashManagement);
    const cashes = await cashRepository.find();
    return { success: true, cashes };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("delete-cash", async (event, id) => {
  try {
    const cashRepository = AppDataSource.getRepository(CashManagement);
    await cashRepository.delete(id);
    return { success: true, message: "Caja eliminada exitosamente" };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("get-payments", async () => {
  try {
    const paymentRepository = AppDataSource.getRepository(Payment);
    const payments = await paymentRepository.find({
      relations: ["proveedor", "facturas", "caja"],
      order: { fecha: "ASC" },
    });
    return { success: true, payments };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("get-receipts", async () => {
  try {
    const receiptRepository = AppDataSource.getRepository(Receipt);
    const receipts = await receiptRepository.find({
      relations: ["cliente", "facturas", "caja"],
      order: { fecha: "ASC" },
    });
    return { success: true, receipts };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("delete-payment", async (event, id) => {
  try {
    const paymentRepository = AppDataSource.getRepository(Payment);
    await paymentRepository.delete(id);
    return { success: true, message: "Pago eliminado exitosamente" };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("add-receipt", async (event, receiptData) => {
  try {
    const receiptRepository = AppDataSource.getRepository(Receipt);
    const newReceipt = receiptRepository.create(receiptData);
    await receiptRepository.save(newReceipt);
    return {
      success: true,
      message: "Cobro registrado exitosamente.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
});
ipcMain.handle("add-payment", async (event, paymentData) => {
  try {
    const paymentRepository = AppDataSource.getRepository(Payment);
    const newPayment = paymentRepository.create(paymentData);
    await paymentRepository.save(newPayment);
    return {
      success: true,
      message: "Pago registrado exitosamente.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
});
ipcMain.handle("add-purchase", async (event, purchaseData) => {
  try {
    const purchaseRepository = AppDataSource.getRepository(Purchase);
    const newPurchase = purchaseRepository.create(purchaseData);
    await purchaseRepository.save(newPurchase);
    return {
      success: true,
      message: "Se guardo el comprobante exitosamente",
      purchaseId: newPurchase.id,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("get-purchases", async () => {
  try {
    const purchaseRepository = AppDataSource.getRepository(Purchase);
    const purchases = await purchaseRepository.find({
      relations: ["provider", "details", "impuestos", "payment"],
      order: { fecha: "ASC" },
    });
    return { success: true, purchases };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("add-detail-purchase", async (event, detailData) => {
  try {
    const detailRepository = AppDataSource.getRepository(DetailsPurchase);
    const newDetail = detailRepository.create(detailData);
    await detailRepository.save(newDetail);
    return { success: true, message: "Detalle cargado exitosamente." };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
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
    const providers = await providerRepository.find({
      relations: ["payment", "purchase"],
      order: { codigo: "ASC" },
    });
    return { success: true, providers };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("edit-provider", async (event, id, providerData) => {
  try {
    const providerRepository = AppDataSource.getRepository(Provider);

    const editProvider = await providerRepository.findOneBy({ id });

    editProvider.codigo = providerData.codigo;
    editProvider.razon_social = providerData.razon_social;
    editProvider.cuit = providerData.cuit;
    editProvider.direccion = providerData.direccion;
    editProvider.telefono = providerData.telefono;
    editProvider.email = providerData.email;
    editProvider.regimen = providerData.regimen;

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
    if (error.message.includes("UNIQUE") && error.message.includes("codigo")) {
      return {
        success: false,
        message: "Ya existe un cliente con ese código.",
      };
    }
    if (error.message.includes("UNIQUE") && error.message.includes("razon_social")) {
      return {
        success: false,
        message: "Ya existe un cliente con esa razon social.",
      };
    }
    console.error(error);
    return { success: false, message: error.message };
  }
});
ipcMain.handle("delete-client", async (event, id) => {
  try {
    const clientRepository = AppDataSource.getRepository(Client);
    await clientRepository.delete(id);
    return { success: true, message: "Cliente eliminado exitosamente" };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("get-clients", async () => {
  try {
    const clientRepository = AppDataSource.getRepository(Client);
    const clients = await clientRepository.find({
      relations: ["receipt", "sales"],
      order: { codigo: "ASC" },
    });
    return { success: true, clients };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("edit-client", async (event, id, clientData) => {
  try {
    const clientRepository = AppDataSource.getRepository(Client);

    const editClient = await clientRepository.findOneBy({ id });

    editClient.codigo = clientData.codigo;
    editClient.razon_social = clientData.razon_social;
    editClient.cuit = clientData.cuit;
    editClient.direccion = clientData.direccion;
    editClient.telefono = clientData.telefono;
    editClient.email = clientData.email;
    editClient.regimen = clientData.regimen;

    await clientRepository.save(editClient);

    return {
      success: true,
      message: "Proveedor editado exitosamente",
      productId: editClient.id,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.message };
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
    if (error.message.includes("UNIQUE") && error.message.includes("codigo")) {
      return {
        success: false,
        message: "Ya existe un producto con ese código.",
      };
    }
    if (error.message.includes("UNIQUE") && error.message.includes("nombre")) {
      return {
        success: false,
        message: "Ya existe un producto con ese nombre.",
      };
    }
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
    editProduct.controla_stock = productData.controla_stock;
    editProduct.stock_minimo = productData.stock_minimo;
    editProduct.proveedor = productData.proveedor;
    

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
    const products = await productRepository.find({
      relations: ["categoria", "proveedor", "precios", "impuestos", "stockMovements"],
      order: { codigo: "ASC" },
    });
    return { success: true, products };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("add-tax", async (event, taxData) => {
  try {
    const taxRepository = AppDataSource.getRepository(Tax);
    const newTax = taxRepository.create(taxData);
    await taxRepository.save(newTax);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("add-tax-purchase", async (event, taxData) => {
  try {
    const taxPurchasesRepository = AppDataSource.getRepository(TaxPurchases);
    const newTaxPurchase = taxPurchasesRepository.create(taxData);
    await taxPurchasesRepository.save(newTaxPurchase);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("add-tax-sale", async (event, taxData) => {
  try {
    const taxSaleRepository = AppDataSource.getRepository(TaxSales);
    const newTaxSale = taxSaleRepository.create(taxData);
    await taxSaleRepository.save(newTaxSale);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("add-price", async (event, priceData) => {
  try {
    const priceRepository = AppDataSource.getRepository(Price);
    const newPrice = priceRepository.create(priceData);
    await priceRepository.save(newPrice);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("delete-tax", async (event, idProduct) => {
  try {
    const taxRepository = AppDataSource.getRepository(Tax);
    await taxRepository.delete({ producto: { id: idProduct } });
    return { success: true, message: "Impuesto eliminado exitosamente" };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("delete-price", async (event, idProduct) => {
  try {
    const priceRepository = AppDataSource.getRepository(Price);
    await priceRepository.delete({ producto: { id: idProduct } });
    return { success: true, message: "Precio eliminado exitosamente" };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("modify-prices-by-id", async (event, productIds, porcentaje, redondear) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const priceRepository = AppDataSource.getRepository(Price);
    const { In } = require("typeorm");


    if (!Array.isArray(productIds) || productIds.length === 0) {
      return { success: false, message: "No se proporcionaron productos." };
    }

    // Buscar productos por ID con sus precios
    const productos = await productRepository.find(
      {
      where: { id: In(productIds) },
      relations: ["precios"] 
      }
    );

    let preciosModificados = 0;

    for (const producto of productos) {
      for (const precio of producto.precios) {
        let nuevoPrecio = precio.precio + (precio.precio * porcentaje / 100);
        if (redondear) {
          nuevoPrecio = Math.round(nuevoPrecio);
        }
        precio.precio = Number(nuevoPrecio.toFixed(2));
        await priceRepository.save(precio);
        preciosModificados++;
      }
    }

    return {
      success: true,
      message: `Precios actualizados correctamente. (${preciosModificados} precios modificados)`,
    };
  } catch (error) {
    console.error("Error al modificar precios por ID:", error);
    return { success: false, message: "Error al modificar precios." };
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
    const sales = await salesRepository.find({
      relations: ["client", "details", "impuestos", "receipt"],
      order: { fecha: "ASC" },
    });
    return { success: true, sales };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
ipcMain.handle("add-detail-sale", async (event, detailData) => {
  try {
    const detailRepository = AppDataSource.getRepository(DetailsSale);
    const newDetail = detailRepository.create(detailData);
    await detailRepository.save(newDetail);
    return { success: true, message: "Detalle cargado exitosamente." };
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
