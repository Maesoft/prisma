const newProvider = async () => {

  const providerData = {
    razon_social: document.getElementById('companyName').value,
    cuit: document.getElementById('cuit').value,
    direccion: document.getElementById('address').value,
    telefono: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    regimen: document.getElementById('regimen').value
  };

  const res = await window.prismaFunctions.addProvider(providerData)

  if (res.success) {
    alert(res.message);
    window.close();
  } else {
    alert(res.message);
  }

}