const getCashes = async () => {
    const res = await window.prismaFunctions.getCashes();
    return res.cashes;
}
const renderCashesModal = async () => {
    const cashes = await getCashes();
    const cashTable = document.querySelector("#cashTable tbody");
    cashTable.innerHTML = "";
    cashes.forEach(cash => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cash.id}</td>
            <td>${cash.nombre}</td>
            `;
        cashTable.appendChild(row);
    })
}

renderCashesModal();