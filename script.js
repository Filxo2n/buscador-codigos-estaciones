let estaciones = {};

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(() => {
        console.log("Service Worker registrado.");
    });
}

function cargarExcel() {
    fetch('listado-codigos-estaciones.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            let workbook = XLSX.read(data, { type: 'array' });
            let sheet = workbook.Sheets[workbook.SheetNames[0]];
            let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            jsonData.forEach(row => {
                if (row[0] && row[1]) {
                    estaciones[row[0]] = row[1];
                }
            });
        });
}

document.addEventListener("DOMContentLoaded", function() {
    cargarExcel();

    document.getElementById('codigo').addEventListener('input', function() {
        let input = this.value;
        let suggestions = Object.keys(estaciones).filter(cod => cod.startsWith(input));
        let suggestionsBox = document.getElementById('suggestions');

        suggestionsBox.innerHTML = '';
        suggestionsBox.style.display = suggestions.length > 0 ? 'block' : 'none';

        suggestions.forEach(cod => {
            let div = document.createElement('div');
            div.classList.add('suggestion');
            div.setAttribute('data-codigo', cod);
            div.textContent = `${cod} - ${estaciones[cod]}`;
            div.addEventListener('click', function() {
                document.getElementById('codigo').value = cod;
                document.getElementById('result').textContent = estaciones[cod];
                suggestionsBox.style.display = 'none';
            });
            suggestionsBox.appendChild(div);
        });
    });

    document.getElementById('buscar').addEventListener('click', function() {
        let codigo = document.getElementById('codigo').value;
        document.getElementById('result').textContent = estaciones[codigo] || "Código no encontrado";
    });
});
