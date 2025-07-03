
const getProviders = async () => {
    try {
        const res = await window.prismaFunctions.getProviders();
        if(!res.success){
            window.prismaFunctions.showMSG("error", "Prisma", res.message);
            return [];
        }
        return res.providers;
    } catch (error) {
        console.error("Error al obtener proveedores:", error);
        window.prismaFunctions.showMSG("error", "Prisma", "Error al obtener proveedores");
        return [];
    }
}
const renderProvidersTable = async () => {
    const providers = await getProviders();
    const tableBody = document.getElementById("providersTableBody");
    tableBody.innerHTML = ""; // Limpiar tabla antes de renderizar

    providers.forEach(provider => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${provider.codigo}</td>
            <td>${provider.razon_social}</td>
            <td>${provider.cuit}</td>
            <td>${provider.direccion}</td>
            <td>${provider.telefono}</td>
            <td>${provider.email}</td>
            <td>${provider.regimen}</td>
        `;
        tableBody.appendChild(row);
    });
};

renderProvidersTable();