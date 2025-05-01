const loadCashes = async () => {
   const res = await window.prismaFunctions.getCashes();
   console.log(res);
   
   
}
loadCashes();