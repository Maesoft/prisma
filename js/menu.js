const windowManager = require("../main/windowManager");

const menuTemplate = [
  {
    label: 'Archivo',
    submenu: [
      { label: 'Backup', click: () => { /* Función de backup */ } },
      { label: 'Opciones', click: () => { windowManager.createWindow("option", 700, 585, false, true) } },
      { type: 'separator' },
      { label: 'Salir', role: 'quit' }
    ]
  },
  {
    label: 'Proveedores',
    submenu: [
      { label: 'Nuevo Proveedor', click: () => { windowManager.createWindow("newProvider", 800, 600, true, false) } },
      { label: 'Modificar Proveedor', click: () => { windowManager.createWindow("modifyProvider", 800, 600, true, false) } },
      { label: 'Eliminar Proveedor', click: () => { windowManager.createWindow("deleteProvider", 600, 400, false, true) } },
      { type: 'separator' },
      { label: 'Resumen de Cuenta', click: () => { windowManager.createWindow("providerReport", 700, 423, false, false) } },
      { label: 'Lista de Proveedores', click: () => { /* Función para lista de proveedores */ } }
    ]
  },
  {
    label: 'Clientes',
    submenu: [
      { label: 'Nuevo Cliente', click: () => { windowManager.createWindow("newClient", 800, 600, true, false) } },
      { label: 'Modificar Cliente', click: () => { windowManager.createWindow("modifyClient", 800, 600, true, false) } },
      { label: 'Eliminar Cliente', click: () => { windowManager.createWindow("deleteClient", 600, 400, false, true) } },
      { type: 'separator' },
      { label: 'Resumen de cuenta', click: () => {  windowManager.createWindow("clientReport", 700, 423, false, false) } },
      { label: 'Lista de Clientes', click: () => { /* Función para lista de clientes */ } }
    ]
  },
  {
    label: 'Articulos',
    submenu: [
      { label: 'Nuevo Articulo', click: () => { windowManager.createWindow("newProduct", 800, 600, true, false) } },
      { label: 'Eliminar Articulo', click: () => { windowManager.createWindow("deleteProduct", 600, 400, false, true) } },
      { label: 'Modificar Articulo', click: () => { windowManager.createWindow("modifyProduct", 800, 600, true, false) } },
      { label: 'Ver Articulos', click: () => { /* Función para lista de precios */ } },
      { type: 'separator' },
      { label: 'Lista de Precios', click: () => { /* Función para lista de precios */ } }
    ]
  },
  {
    label: 'Stock',
    submenu: [
      { label: 'Ingreso/Egreso de Stock', click: () => { windowManager.createWindow("stockEntry", 800, 450, true, true) } },
      { type: 'separator' },
      { label: 'Resumen de Stock', click: () => { windowManager.createWindow("stockReport", 1100,800,true, false) } },
      { type: 'separator' },
      { label: 'Stock Minimo', click: () => { } },
      { type: 'separator' },
      { label: 'Comparar Stock Fisico', click: () => { } },
      { label: 'Consultar Movimientos', click: () => { } },
    ]
  },
  {
    label: 'Compras',
    submenu: [
      { label: 'Ingresar Compra', click: () => { windowManager.createWindow("newPurchase", 800, 600, true, false) } },
      { label: 'Eliminar Compra', click: () => { } },
      { type: 'separator' },
      { label: 'Resumen de Compras', click: () => { } },
      { label: 'Facturas', click: () => { } }
    ]
  },
  {
    label: 'Ventas',
    submenu: [
      { label: 'Ingresar Venta', click: () => { windowManager.createWindow("newSale", 820, 600, true, false) } },
      { label: 'Eliminar Venta', click: () => {  } },
      { type: 'separator' },
      { label: 'Informe de Ventas', click: () => {windowManager.createWindow("saleReport", 700, 520, false, false) } },
      { label: 'Facturas', click: () => { } }
    ]
  },
  {
    label: 'Caja',
    submenu: [
      { label: 'Orden de Pago', click: () => { windowManager.createWindow("newPayment", 640,550,true,false) } },
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