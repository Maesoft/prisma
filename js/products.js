
const newProduct = async () => {
    const productData = {
        codigo : document.getElementById('productCode').value,
        nombre : document.getElementById('productName').value,
        descripcion : document.getElementById('productDescription').value,
        categoria : document.getElementById('productCategory').value,
        imagen : document.getElementById('productImage').src,
        stock : parseInt(document.getElementById('initialStock').value,10),
        costo : parseFloat(document.getElementById('productCost').value),
        precio1 : parseFloat(document.getElementById('productPrice1').value),
        precio2 : parseFloat(document.getElementById('productPrice2').value),
    }

    const res = await window.prismaFunctions.addProduct(productData);

    if(res.sucess){
        alert(res.message)
        window.close()
    }else{
        alert(res.message)
    }

}