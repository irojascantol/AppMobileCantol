

export const descargar_enlace_archivo = (data, nameFile) => {
    // Crear un URL para el archivo recibido
    const url = window.URL.createObjectURL(new Blob([data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nameFile}.pdf`; // Nombre del archivo
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a); // Remover el enlace después de descargar
}