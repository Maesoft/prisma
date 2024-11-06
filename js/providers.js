const newProvider = async () => {
  const providerData = {
    razon_social: document.getElementById('companyName').value,
    cuit: document.getElementById('cuit').value,
    direccion: document.getElementById('address').value,
    telefono: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    regimen: document.getElementById('regimen').value
  };
  const query = await window.prismaFunctions.addProvider(providerData)
  if (query.success) {
    alert(query.message);
    window.close();
  } else {
    alert(query.message);
  }
}