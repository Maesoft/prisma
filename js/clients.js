const newClient = async () => {

  const clientData = {
    codigo: document.getElementById('companyCode').value.trim(),
    razon_social: document.getElementById('companyName').value.trim(),
    cuit: document.getElementById('cuit').value.trim(),
    direccion: document.getElementById('address').value,
    telefono: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    regimen: document.getElementById('regimen').value
  };

  const res = await window.prismaFunctions.addClient(clientData)

  if (res.success) {
    alert(res.message);
    window.close();
  } else {
    alert(res.message);
  }

}