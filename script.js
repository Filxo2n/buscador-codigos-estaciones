document.addEventListener("DOMContentLoaded", function () {
    const buscador = document.getElementById("buscador");
    const sugerencias = document.getElementById("sugerencias");

    // Cargar el archivo XLSX
    fetch('estaciones.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0]; // Obtener la primera hoja
            const sheet = workbook.Sheets[sheetName];
            const estaciones = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Convertir los datos a un array de objetos { codigo, nombre }
            const datos = estaciones.slice(1).map(row => ({
                codigo: row[0],
                nombre: row[1]
            }));

            // Función para mostrar sugerencias
            buscador.addEventListener("input", function () {
                const valor = buscador.value.toUpperCase();
                sugerencias.innerHTML = "";

                if (valor.length > 0) {
                    const resultados = datos.filter(estacion =>
                        estacion.codigo.toUpperCase().includes(valor) ||
                        estacion.nombre.toUpperCase().includes(valor)
                    );

                    resultados.forEach(estacion => {
                        const li = document.createElement("li");
                        li.textContent = `${estacion.codigo} - ${estacion.nombre}`;
                        li.addEventListener("click", () => {
                            buscador.value = `${estacion.codigo} - ${estacion.nombre}`;
                            sugerencias.innerHTML = "";
                        });
                        sugerencias.appendChild(li);
                    });
                }
            });
        })
        .catch(error => console.error("Error cargando el archivo XLSX:", error));
});
