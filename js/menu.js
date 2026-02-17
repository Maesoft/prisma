const windowManager = require("../main/windowManager");

const menuTemplate = [
  {
    label: 'Archivo',
    submenu: [
      { label: 'Backup', click: () => { /* Función de backup */ } },
      { label: 'Mi Empresa', click: () => { windowManager.createWindow("option", 700, 585, false, true) } },
      { type: 'separator' },
      { label: 'Salir', role: 'quit' }
    ]
  },
  {
    label: 'Proveedores',
    submenu: [
      { label: 'Nuevo Proveedor', click: () => { windowManager.createWindow("newProvider", 800, 600, true, false) } },
      { label: 'Modificar Proveedor', click: () => { windowManager.createWindow("modifyProvider", 800, 600, true, false) } },
      { label: 'Eliminar Proveedor', click: () => { windowManager.createWindow("deleteProvider", 600, 500, false, true) } },
      { type: 'separator' },
      { label: 'Resumen de Cuenta', click: () => { windowManager.createWindow("reportAccountProvider", 700, 423, false, false) } },
      { label: 'Proveedores a Pagar', click: () => {  windowManager.createWindow("providersPayables", 1100, 600, true, false)} },
      { label: 'Listado de Proveedores', click: () => {  windowManager.createWindow("listProviders", 1100, 600, true, false)} }
    ]
  },
  {
    label: 'Clientes',
    submenu: [
      { label: 'Nuevo Cliente', click: () => { windowManager.createWindow("newClient", 800, 600, true, false) } },
      { label: 'Modificar Cliente', click: () => { windowManager.createWindow("modifyClient", 800, 600, true, false) } },
      { label: 'Eliminar Cliente', click: () => { windowManager.createWindow("deleteClient", 600, 500, false, true) } },
      { type: 'separator' },
      { label: 'Resumen de Cuenta', click: () => { windowManager.createWindow("reportAccountClient", 700, 423, false, false) } },
      { label: 'Clientes a Cobrar', click: () => { windowManager.createWindow("clientsReceivables", 1100, 600, true, false) } },
      { label: 'Listado de Clientes', click: () => { windowManager.createWindow("listClients", 1100, 600, true, false) }},
    ]
  },
  {
    label: 'Articulos',
    submenu: [
      { label: 'Nuevo Articulo', click: () => { windowManager.createWindow("newProduct", 800, 600, true, false) } },
      { label: 'Eliminar Articulo', click: () => { windowManager.createWindow("deleteProduct", 600, 500, false, true) } },
      { label: 'Modificar Articulo', click: () => { windowManager.createWindow("modifyProduct", 800, 600, true, false) } },
      { label: 'Ver Articulos', click: () => { windowManager.createWindow("viewProducts", 1100, 600, true, false) } },
      { type: 'separator' },
      { label: 'Modificador de Precios', click: () => {windowManager.createWindow("modifyPrices", 440, 470, true, false) } }
    ]
  },
  {
    label: 'Stock',
    submenu: [
      { label: 'Ingreso/Egreso de Stock', click: () => { windowManager.createWindow("stockEntry", 800, 500, true, true) } },
      { type: 'separator' },
      { label: 'Resumen de Stock', click: () => { windowManager.createWindow("stockReport", 1100, 600, true, false) } },
      { type: 'separator' },
      { label: 'Stock Minimo', click: () => { windowManager.createWindow("reportStockMin", 1100,600, true, false)} },
      { type: 'separator' },
      { label: 'Comparar Stock Fisico', click: () => { } },
      { label: 'Consultar Movimientos', click: () => { } },
    ]
  },
  {
    label: 'Compras',
    submenu: [
      { label: 'Ingresar Compra', click: () => { windowManager.createWindow("newPurchase", 800, 630, true, false) } },
      { label: 'Eliminar Compra', click: () => { } },
      { type: 'separator' },
      { label: 'Ingresar Gasto', click: () => { windowManager.createWindow("otherExpenses", 800, 420, true, false) } },
      { label: 'Eliminar Gasto', click: () => { } },
      { type: 'separator' },
      { label: 'Informe de Compras', click: () => { windowManager.createWindow("purchaseReport", 700, 520, false, false) } },
      { label: 'Facturas', click: () => { } }
    ]
  },
  {
    label: 'Ventas',
    submenu: [
      { label: 'Ingresar Venta', click: () => { windowManager.createWindow("newSale", 850, 680, true, false) } },
      { label: 'Eliminar Venta', click: () => {  } },
      { type: 'separator' },
      { label: 'Informe de Ventas', click: () => {windowManager.createWindow("saleReport", 700, 520, false, false) } },
      { label: 'Facturas', click: () => {windowManager.createWindow("searchInvoice", 640, 480, true, true) } },
    ]
  },
  {
    label: 'Caja',
    submenu: [
      { label: 'Orden de Pago', click: () => { windowManager.createWindow("newPayment", 850,680,true,false) } },
      { label: 'Recibo', click: () => { windowManager.createWindow("newReceipt", 640,550,true,false) } },
      { type: 'separator' },
      { label: 'Apertura de Caja', click: () => { windowManager.createWindow("openCash", 540, 360, true, false) } },
      { label: 'Cierre de Caja', click: () => { } },
      { type: 'separator' },
      { label: 'Nueva Caja', click: () => { windowManager.createWindow("newCash", 540, 360, true, false) } },
      { label: 'Eliminar Caja', click: () => { windowManager.createWindow("openCash", 540, 360, true, false) } },
      { type: 'separator' },
      { label: 'Resumen de Caja', click: () => { } },
      { label: 'Consulta de Saldo', click: () => { } },
    ]
  }
];

module.exports = {
  menuTemplate
}