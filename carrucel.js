document.addEventListener('DOMContentLoaded', () => {
  const carruselImagenes = document.querySelector('.carrusel-imagenes');
  const items = document.querySelectorAll('.carrusel-item');
  const btnAnterior = document.querySelector('.carrusel-btn.anterior');
  const btnSiguiente = document.querySelector('.carrusel-btn.siguiente');
  const indicadoresContenedor = document.querySelector('.carrusel-indicadores');
  let indiceActual = 0;
  const totalItems = items.length;

  // Crear indicadores
  items.forEach((_, i) => {
    const indicador = document.createElement('span');
    indicador.classList.add('carrusel-indicador');
    if (i === 0) indicador.classList.add('activo');
    indicador.addEventListener('click', () => irAItem(i));
    indicadoresContenedor.appendChild(indicador);
  });

  // Función para actualizar el carrusel
  function actualizarCarrusel() {
    carruselImagenes.style.transform = `translateX(-${indiceActual * 100}%)`;
    const indicadores = document.querySelectorAll('.carrusel-indicador');
    indicadores.forEach((indicador, i) => {
      indicador.classList.toggle('activo', i === indiceActual);
    });
  }

  // Función para ir a un item específico
  function irAItem(indice) {
    indiceActual = indice;
    if (indiceActual >= totalItems) indiceActual = 0;
    if (indiceActual < 0) indiceActual = totalItems - 1;
    actualizarCarrusel();
  }

  // Event listeners para botones
  btnSiguiente.addEventListener('click', () => {
    indiceActual = (indiceActual + 1) % totalItems;
    actualizarCarrusel();
  });

  btnAnterior.addEventListener('click', () => {
    indiceActual = (indiceActual - 1 + totalItems) % totalItems;
    actualizarCarrusel();
  });

  setInterval(() => {
    indiceActual = (indiceActual + 1) % totalItems;
    actualizarCarrusel();
  }, 5000);
});