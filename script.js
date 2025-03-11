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
            const datos = estaciones.slice(1).map(row => {
                // Verificar que la fila tenga al menos dos columnas
                if (row[0] !== undefined && row[1] !== undefined) {
                    return {
                        codigo: row[0].toString(), // Asegurarse de que el código sea una cadena
                        nombre: row[1]
                    };
                } else {
                    return null; // Ignorar filas incompletas
                }
            }).filter(Boolean); // Eliminar filas nulas

            // Función para mostrar sugerencias
            buscador.addEventListener("input", function () {
                const valor = buscador.value.toUpperCase();
                sugerencias.innerHTML = ""; // Limpiar sugerencias anteriores

                if (valor.length > 0) {
                    // Filtrar resultados que comiencen con el valor ingresado
                    const resultados = datos.filter(estacion => {
                        // Verificar que estacion.codigo y estacion.nombre no sean undefined
                        if (estacion.codigo && estacion.nombre) {
                            return (
                                estacion.codigo.toUpperCase().startsWith(valor) || // Coincidencia en el código
                                estacion.nombre.toUpperCase().startsWith(valor)    // Coincidencia en el nombre
                            );
                        }
                        return false; // Ignorar filas con datos incompletos
                    });

                    if (resultados.length > 0) {
                        resultados.forEach(estacion => {
                            const li = document.createElement("li");
                            li.textContent = `${estacion.codigo} - ${estacion.nombre}`;
                            li.addEventListener("click", () => {
                                // Al hacer clic en una sugerencia, llenar el campo de búsqueda
                                buscador.value = `${estacion.codigo} - ${estacion.nombre}`;
                                sugerencias.innerHTML = ""; // Limpiar sugerencias
                                mostrarResultado(estacion); // Mostrar el resultado
                            });
                            sugerencias.appendChild(li);
                        });
                        sugerencias.style.display = "block"; // Mostrar el contenedor de sugerencias
                    } else {
                        sugerencias.style.display = "none"; // Ocultar si no hay resultados
                    }
                } else {
                    sugerencias.style.display = "none"; // Ocultar si el campo está vacío
                }
            });

            // Ocultar sugerencias al hacer clic fuera del buscador
            document.addEventListener("click", function (event) {
                if (event.target !== buscador) {
                    sugerencias.style.display = "none";
                }
            });

            // Función para mostrar el resultado
            function mostrarResultado(estacion) {
                // Aquí puedes mostrar el resultado en la interfaz
                alert(`Código: ${estacion.codigo}\nNombre: ${estacion.nombre}`);
            }
        })
        .catch(error => console.error("Error cargando el archivo XLSX:", error));
});
