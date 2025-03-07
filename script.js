document.getElementById('uploadForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    const fileInput = document.getElementById('excelFile'); // Obtiene el input de archivo
    const jsonOutput = document.getElementById('jsonOutput'); // Obtiene el área de salida
    const downloadLink = document.getElementById('downloadLink'); // Obtiene el enlace de descarga

    if (fileInput.files.length === 0) {
        jsonOutput.textContent = "Por favor, selecciona un archivo.";
        return;
    }

    const file = fileInput.files[0]; // Obtiene el archivo seleccionado
    const reader = new FileReader(); // Crea un lector de archivos

    // Define lo que sucede cuando el archivo se ha leído
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result); // Convierte el archivo a un array de bytes
        const workbook = XLSX.read(data, { type: 'array' }); // Lee el archivo Excel

        // Obtiene el nombre de la primera hoja del archivo Excel
        const sheetName = workbook.SheetNames[0];
        // Obtiene los datos de la hoja
        const worksheet = workbook.Sheets[sheetName];
        // Convierte los datos de la hoja a JSON
        const json = XLSX.utils.sheet_to_json(worksheet);

        // Función replacer para asegurar que "Nombre" y "Código" sean strings
        const replacer = (key, value) => {
            if (key === "Nombre" || key === "Código") {
                return String(value); // Convierte el valor a string
            }
            return value; // Devuelve el valor sin cambios
        };

        // Convierte el JSON a una cadena, aplicando el replacer
        const jsonString = JSON.stringify(json, replacer, 4);

        // Muestra el JSON en el área de salida
        jsonOutput.textContent = jsonString;

        // Crea un archivo JSON descargable
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Configura el enlace de descarga
        downloadLink.href = url;
        downloadLink.download = 'data.json'; // Nombre del archivo descargado
        downloadLink.style.display = 'block'; // Muestra el botón de descarga
    };

    // Lee el archivo como un array de bytes
    reader.readAsArrayBuffer(file);
});