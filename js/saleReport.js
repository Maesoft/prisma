let ventas = [];

const cargarVentas = async () => {
  try {
    const res = await window.prismaFunctions.getSales();
    if (!res.success) {
      window.prismaFunctions.showMSG("error", "Prisma", res.message);
      return;
    }
    ventas = res.sales;
  } catch (error) {
    window.prismaFunctions.showMSG("error", "Prisma", error.message);
  }
};

const generarInforme = async () => {
    await cargarVentas();
    const fechaInicio = document.getElementById("fechaInicio").value
      ? new Date(document.getElementById("fechaInicio").value)
      : null;
    const fechaFin = document.getElementById("fechaFin").value
      ? new Date(document.getElementById("fechaFin").value)
      : null;
    const ventasFiltradas = ventas.filter((venta) => {
      const fechaVenta = new Date(venta.fecha); 
  
      return (
        (!fechaInicio || fechaVenta >= fechaInicio) &&
        (!fechaFin || fechaVenta <= fechaFin)
      );
    });
  
   
    const totalVentas = ventasFiltradas.reduce(
      (acc, venta) => acc + venta.total,
      0
    );
    console.log(totalVentas);
    

  };
  
