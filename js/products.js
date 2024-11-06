const newProduct = async () => {
    const productData = {
        productCode : document.getElementById('productCode').value,
        productName : document.getElementById('productName').value,
        productDescription : document.getElementById('productDescription').value,
        productCategory : document.getElementById('productCategory').value,
        productImage : document.getElementById('productImage').src,
        productControlStock : document.getElementById('productControlStock').checked,
    }
    
}