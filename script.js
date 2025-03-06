document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById('excelFile');
    const message = document.getElementById('message');

    if (fileInput.files.length === 0) {
        message.textContent = "Por favor, selecciona un archivo.";
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Suponiendo que la primera hoja es la que contiene los datos
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        // Enviar JSON a GitHub
        try {
            const githubToken = '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'; // ¡No expongas esto en producción!
            const repoOwner = 'Eddince';
            const repoName = 'web_exam';
            const filePath = 'database.json';
            const branch = 'main';

            const url = `https://api.github.com/repos/${repoOwner}/${repoName}/${filePath}`;
            const content = JSON.stringify(json, null, 4);
            const contentBase64 = btoa(unescape(encodeURIComponent(content)));

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                },
                body: JSON.stringify({
                    message: 'Actualización automática de JSON',
                    content: contentBase64,
                    branch: branch
                })
            });

            if (response.ok) {
                message.textContent = "JSON enviado correctamente a GitHub.";
            } else {
                const error = await response.json();
                message.textContent = "Error: " + error.message;
            }
        } catch (error) {
            message.textContent = "Error al enviar el archivo.";
        }
    };

    reader.readAsArrayBuffer(file);
});