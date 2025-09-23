
const getClients = async () => {
    try {
        const res = await window.prismaFunctions.getClients();
        if(!res.success){
            window.prismaFunctions.showMSG("error", "Prisma", res.message);
            return [];
        }
        return res.clients;
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        window.prismaFunctions.showMSG("error", "Prisma", "Error al obtener clientes");
        return [];
    }
}
const renderClientsTable = async () => {
    const clients = await getClients();
    const tableBody = document.getElementById("clientsTableBody");
    tableBody.innerHTML = ""; // Limpiar tabla antes de renderizar

    clients.forEach(client => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${client.codigo}</td>
            <td>${client.razon_social}</td>
            <td>${client.cuit}</td>
            <td>${client.direccion}</td>
            <td>${client.telefono}</td>
            <td>${client.email}</td>
            <td>${client.regimen}</td>
        `;
        tableBody.appendChild(row);
    });
};
const imprimir = () => {
    document.querySelector(".boton-imprimir").style.display = 'none';
    document.querySelector(".boton").style.display = 'none';
    window.print();
    document.querySelector(".boton-imprimir").style.display = 'block';
    document.querySelector(".boton").style.display = 'block';
}
renderClientsTable();