document.addEventListener("DOMContentLoaded", function () {
    const botones = document.querySelectorAll(".sidebar button");
    
    botones.forEach(boton => {
        boton.addEventListener("click", function () {
            const parcialId = this.getAttribute("onclick").replace("mostrarParcial('", "").replace("')", "");
            mostrarParcial(parcialId);
        });
    });
});

function mostrarParcial(parcial) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    const elemento = document.getElementById(parcial);
    if (elemento) {
        elemento.style.display = 'block';
    }
}
