document.querySelectorAll('table.crossword input').forEach(input => {
    input.addEventListener('input', e => {
      e.target.value = e.target.value.toUpperCase().replace(/[^A-ZÑÁÉÍÓÚÜ]/g, '');
    });
  });