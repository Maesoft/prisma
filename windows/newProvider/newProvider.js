import { AppDataSource } from "./data-source";
import { Proveedor } from "./entities/Proveedor";

export class ProveedorController {
    // Función para obtener todos los proveedores
    async getAllProveedores() {
        const proveedorRepository = AppDataSource.getRepository(Proveedor);
        return await proveedorRepository.find();
    }

    // Función para crear un nuevo proveedor
    async createProveedor() {
        const proveedorRepository = AppDataSource.getRepository(Proveedor);
        const nuevoProveedor = proveedorRepository.create({ nombre, telefono });
        return await proveedorRepository.save(nuevoProveedor);
    }
}



// const { ipcRenderer } = require('electron');

// document.getElementById('providerForm').addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const providerData = {
//     companyName: document.getElementById('companyName').value,
//     cuit: document.getElementById('cuit').value,
//     address: document.getElementById('address').value,
//     phone: document.getElementById('phone').value,
//     email: document.getElementById('email').value,
//     regimen: document.getElementById('regimen').value
//   };

//   const result = await ipcRenderer.invoke('add-provider', providerData);

//   if (result.success) {
//     alert('Proveedor guardado exitosamente');
//     window.close();
//   } else {
//     alert(result.message);
//   }
// });

