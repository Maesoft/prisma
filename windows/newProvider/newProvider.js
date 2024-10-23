document.getElementById('providerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const providerData = {
    razon_social: document.getElementById('companyName').value,
    cuit: document.getElementById('cuit').value,
    direccion: document.getElementById('address').value,
    telefono: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    regimen: document.getElementById('regimen').value
  };

  const result = await window.prismaFunctions.addProvider(providerData)

  if (result.success) {
    alert('Proveedor guardado exitosamente');
    window.close();
  } else {
    alert(result.message);
  }
});