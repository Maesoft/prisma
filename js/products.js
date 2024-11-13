const loadCategories = async () => {
    const res = await window.prismaFunctions.getCategories();
    if (res.success) {
        const categorySelect = document.getElementById('productCategory');
        res.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } else {
        alert(res.message);
    }
};

const addCategory = async () => {
    const newCategoryName = document.getElementById('newCategoryName').value;
    const res = await window.prismaFunctions.addCategory({name:newCategoryName});
    if (res.success) {
        alert(res.message);
        // Recargar categorías después de añadir una nueva
        document.getElementById('productCategory').innerHTML = '';
        await loadCategories();
        // Cerrar el modal
        document.getElementById('categoryModal').classList.remove('show');
    } else {
        alert(res.message);
    }
};

    const showModal = () => {
        const modal = document.getElementById('categoryModal');
        modal.classList.toggle('show');  // Alternar la clase 'show' de Bootstrap
        modal.style.display = modal.classList.contains('show') ? 'block' : 'none';  // Cambiar visibilidad
    };
    
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

window.addEventListener('DOMContentLoaded', loadCategories);
