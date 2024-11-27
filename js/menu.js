const windowManager = require("../main/windowManager");

const menuTemplate = [
  {
    label: 'Archivo',
    submenu: [
      { label: 'Backup', click: () => { /* Función de backup */ } },
      { label: 'Opciones', click: () => { /* Función de opciones */ } },
      { type: 'separator' },
      { label: 'Salir', role: 'quit' }
    ]
  },
  {
    label: 'Proveedores',
    submenu: [
      { label: 'Nuevo Proveedor', click: () => { windowManager.createWindow("newProvider",800,600,true,false)} },
      { label: 'Eliminar Proveedor', click: () => { /* Función para eliminar proveedor */ } },
      { label: 'Modificar Proveedor', click: () => { /* Función para modificar proveedor */ } },
      { type: 'separator' },
      { label: 'Resumen de Cuenta', click: () => { /* Función para resumen de cuenta de proveedores */ } },
      { label: 'Lista de Proveedores', click: () => { /* Función para lista de proveedores */ } }
    ]
  },
  {
    label: 'Clientes',
    submenu: [
      { label: 'Nuevo Cliente', click: () => { windowManager.createWindow("newClient",800,600,true, false) } },
      { label: 'Eliminar Cliente', click: () => { /* Función para eliminar cliente */ } },
      { label: 'Modificar Cliente', click: () => { /* Función para modificar cliente */ } },
      { type: 'separator' },
      { label: 'Resumen de cuenta', click: () => { /* Función para resumen de cuenta de clientes */ } },
      { label: 'Lista de Clientes', click: () => { /* Función para lista de clientes */ } }
    ]
  },
  {
    label: 'Productos',
    submenu: [
      { label: 'Nuevo Producto', click: () => { windowManager.createWindow("newProduct",800,600,true, false) } },
      { label: 'Eliminar Producto', click: () => { /* Función para eliminar producto */ } },
      { label: 'Modificar Producto', click: () => { /* Función para modificar producto */ } },
      { label: 'Ver Productos', click: () => { /* Función para lista de precios */ } },
      { type: 'separator' },
      { label: 'Lista de Precios', click: () => { /* Función para lista de precios */ } }
    ]
  },
  {
    label: 'Stock',
    submenu: [
      {label: 'Ingreso/Egreso de Stock', click: ()=>{windowManager.createWindow("stockEntry",800,450,true,true)}},
      {type: 'separator'},
      {label: 'Resumen de Stock', click:()=>{}},
      {type: 'separator'},
      {label: 'Stock Minimo', click:()=>{}},
      {type: 'separator'},
      {label: 'Comparar Stock Fisico', click:()=>{}},
      {label: 'Consultar Movimientos', click:()=>{}},
    ]
  },
  {
    label: 'Compras',
    submenu: [
      {label: 'Ingresar Compra', click: ()=>{windowManager.createWindow("newPurchase",800,600,true, false) }},
      {label: 'Eliminar Compra', click: ()=>{}},
      {type: 'separator'},
      {label: 'Ingresar Gasto', click: ()=>{}},
      {label: 'Eliminar Gasto', click: ()=>{}},
      {type: 'separator'},
      {label: 'Resumen de Compras', click:()=>{}},
      {label: 'Resumen de Gastos', click:()=>{}}
    ]
  },
  {
    label: 'Ventas',
    submenu: [
      {label: 'Ingresar Venta', click: ()=>{windowManager.createWindow("newSale",800,600,true, false)}},
      {label: 'Eliminar Venta', click: ()=>{}},
      {type: 'separator'},
      {label: 'Resumen de Ventas', click:()=>{}},
      {label: 'Facturas', click:()=>{}}
    ]
  },
  {
    label: 'Caja',
    submenu: [
      {label: 'Apertura de Caja', click: ()=>{windowManager.createWindow("openCash",400,300,false, true)}},
      {label: 'Cierre de Caja', click: ()=>{}},
      {type: 'separator'},
      {label: 'Ingresos', click:()=>{}},
      {label: 'Egresos', click:()=>{}},
      {type: 'separator'},
      {label: 'Medios de Pagos', click:()=>{}},
      {type: 'separator'},
      {label: 'Resumen de Caja', click:()=>{}},
      {label: 'Consulta de Saldo', click:()=>{}},
    ]
  }
];

module.exports={
  menuTemplate
}