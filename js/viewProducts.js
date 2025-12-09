let currentView = "cards";

const loadProducts = async () => {
  try {
    const response = await window.prismaFunctions.getProducts();
    if (!response.success) {
      window.prismaFunctions.showMSG(
        "error",
        "Prisma",
        response.message,
        ["Aceptar"],
        0
      );
      return;
    }
    products = response.products;
    console.log(products);

    renderProducts(products);
  } catch (error) {
    window.prismaFunctions.showMSG(
      "error",
      "Prisma",
      "Error al cargar los articulos",
      ["Aceptar"],
      0
    );
  }
};

const setView = (type) => {
  currentView = type;
  renderProducts(products);
};

const renderProducts = (products) => {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");

    if (currentView === "list") {
      productCard.className = "col-12 item-card";
      productCard.innerHTML = `
        <div class="card shadow-sm d-flex flex-row align-items-center p-2">
        <img 
          src="${product.imagen}" 
          class="img-fluid me-3" 
          style="width: 80px; height: 80px; object-fit: cover;" 
          alt="Imagen artículo"
          onerror="this.onerror=null;this.src='../assets/sin_imagen.png';"
        />          
        <div class="card-body p-0">
            <h5 class="card-title mb-1">Cod: ${product.codigo} - ${product.nombre}</h5>
            <p class="card-text text-muted mb-1">${product.descripcion}</p>
            <span class="badge bg-dark w-25">Stock: ${product.stock}</span>
        </div>
        </div>`;
    } else {
      productCard.className = "col-12 col-md-4 item-card mb-3";
      productCard.innerHTML = `
  <div class="card shadow-sm p-3 text-center h-100 d-flex flex-column">
    <div class="d-flex justify-content-center mb-2">
      <img 
        src="${product.imagen}" 
        class="img-fluid" 
        style="width: 100px; height: 100px; object-fit: cover;" 
        alt="Imagen artículo"
        onerror="this.onerror=null;this.src='../assets/sin_imagen.png';"
      />
    </div>
    <div class="card-body d-flex flex-column justify-content-between">
      <div>
        <h5 class="card-title">Cod: ${product.codigo} - ${product.nombre}</h5>
        <p class="card-text text-muted">${product.descripcion}</p>
      </div>
      <span class="badge bg-dark mt-2">Stock: ${product.stock}</span>
    </div>
  </div>`;
  }
    container.appendChild(productCard);
  });
};

document.addEventListener("DOMContentLoaded", loadProducts);
