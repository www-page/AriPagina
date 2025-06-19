(() => {
  const words = [
    "CLASE",
    "OBJETO",
    "HERENCIA",
    "POLIMORFISMO",
    "ENCAPSULAMIENTO",
    "ABSTRACCION",
    "METODO",
    "ATRIBUTO"
  ];
  const rows = 15;
  const cols = 15;
  const directions = [
    [0,1],
    [1,0],
    [1,1],
    [-1,1]
  ];
  let board = [];
  let placedWords = [];
  let selectedCells = [];
  let isSelecting = false;
  const foundWords = new Set();
  const boardEl = document.getElementById("board");
  const wordsEl = document.getElementById("words");
  function setupWordList() {
    words.forEach(word => {
      const li = document.createElement("li");
      li.textContent = word;
      li.id = "word-" + word;
      wordsEl.appendChild(li);
    });
  }
  function initBoard() {
    board = [];
    for(let r=0; r<rows; r++) {
      board[r] = [];
      for(let c=0; c<cols; c++) {
        board[r][c] = {
          letter: '',
          wordIndices: []
        };
      }
    }
  }
  function placeWord(word, wordIndex) {
    const maxAttempts = 1000;
    let attempt = 0;
    while (attempt < maxAttempts) {
      attempt++;
      const dir = directions[Math.floor(Math.random()*directions.length)];
      const dr = dir[0];
      const dc = dir[1];
      const maxRowStart = dr === 1 ? rows - word.length : dr === -1 ? word.length - 1 : rows - 1;
      const maxColStart = dc === 1 ? cols - word.length : cols - 1;
      const rowStart = dr === -1
        ? getRandomInt(word.length - 1, rows - 1)
        : getRandomInt(0, maxRowStart);
      const colStart = getRandomInt(0, maxColStart);
      let fits = true;
      for(let i=0; i<word.length; i++) {
        const r = rowStart + i*dr;
        const c = colStart + i*dc;
        if(r < 0 || r >= rows || c < 0 || c >= cols) {
          fits = false;
          break;
        }
        const cell = board[r][c];
        if(cell.letter !== '' && cell.letter !== word[i]) {
          fits = false;
          break;
        }
      }
      if(!fits) continue;
      for(let i=0; i<word.length; i++) {
        const r = rowStart + i*dr;
        const c = colStart + i*dc;
        board[r][c].letter = word[i];
        board[r][c].wordIndices.push(wordIndex);
      }
      placedWords.push({
        word,
        rowStart,
        colStart,
        dr,
        dc,
        length: word.length,
        found: false
      });
      return true;
    }
    return false;
  }
  function fillEmpty() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(let r=0; r<rows; r++) {
      for(let c=0; c<cols; c++) {
        if(board[r][c].letter === '') {
          board[r][c].letter = alphabet[Math.floor(Math.random()*alphabet.length)];
        }
      }
    }
  }
  function renderBoard() {
    boardEl.style.gridTemplateColumns = `repeat(${cols}, 32px)`;
    boardEl.style.gridTemplateRows = `repeat(${rows}, 32px)`;
    boardEl.innerHTML = '';
    for(let r=0; r<rows; r++) {
      for(let c=0; c<cols; c++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = r;
        cell.dataset.col = c;
        cell.textContent = board[r][c].letter;
        boardEl.appendChild(cell);
      }
    }
  }
  function getRandomInt(min, max) {
    return Math.floor(Math.random()*(max - min + 1)) + min;
  }
  function onCellMouseDown(e) {
    if(foundWords.size === words.length) return;
    if(e.target.classList.contains('cell')) {
      e.preventDefault();
      clearSelection();
      isSelecting = true;
      addCellToSelection(e.target);
    }
  }
  function onCellMouseEnter(e) {
    if(!isSelecting) return;
    if(e.target.classList.contains('cell')) {
      addCellToSelection(e.target);
    }
  }
  function onMouseUp(e) {
    if(!isSelecting) return;
    isSelecting = false;
    checkSelection();
  }
  function addCellToSelection(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    if(selectedCells.length > 0) {
      const last = selectedCells[selectedCells.length-1];
      const lastRow = parseInt(last.dataset.row);
      const lastCol = parseInt(last.dataset.col);
      const dr = row - parseInt(selectedCells[0].dataset.row);
      const dc = col - parseInt(selectedCells[0].dataset.col);
      const len = selectedCells.length;
      if(len > 1) {
        const initialDr = parseInt(selectedCells[1].dataset.row) - parseInt(selectedCells[0].dataset.row);
        const initialDc = parseInt(selectedCells[1].dataset.col) - parseInt(selectedCells[0].dataset.col);
        if(initialDr === 0 && initialDc === 0) {
          if(Math.abs(row-lastRow) + Math.abs(col-lastCol) !== 1) return;
        } else {
          if((row - parseInt(selectedCells[0].dataset.row)) !== initialDr * len) return;
          if((col - parseInt(selectedCells[0].dataset.col)) !== initialDc * len) return;
        }
      } else {
        const distRow = Math.abs(row - parseInt(selectedCells[0].dataset.row));
        const distCol = Math.abs(col - parseInt(selectedCells[0].dataset.col));
        if(distRow > 1 || distCol > 1) return;
      }
    }
    if(!selectedCells.includes(cell)) {
      selectedCells.push(cell);
      cell.classList.add('selected');
    }
  }
  function clearSelection() {
    selectedCells.forEach(cell => cell.classList.remove('selected'));
    selectedCells = [];
  }
  function checkSelection() {
    if(selectedCells.length < 2) {
      clearSelection();
      return;
    }
    let selectedWord = selectedCells.map(c => c.textContent).join('');
    let selectedWordRev = selectedCells.map(c => c.textContent).reverse().join('');
    let foundIndex = -1;
    for(let i=0; i < placedWords.length; i++) {
      if(!placedWords[i].found && (placedWords[i].word === selectedWord || placedWords[i].word === selectedWordRev)) {
        foundIndex = i; break;
      }
    }
    if(foundIndex >= 0) {
      markWordFound(placedWords[foundIndex]);
      foundWords.add(placedWords[foundIndex].word);
      markWordInList(placedWords[foundIndex].word);
      clearSelection();
      checkWin();
    } else {
      clearSelection();
    }
  }
  function markWordFound(wordObj) {
    wordObj.found = true;
    for(let i=0; i<wordObj.length; i++) {
      const r = wordObj.rowStart + i*wordObj.dr;
      const c = wordObj.colStart + i*wordObj.dc;
      const cellIndex = r*cols + c;
      const cell = boardEl.children[cellIndex];
      cell.classList.add('found');
    }
  }
  function markWordInList(word) {
    const li = document.getElementById('word-' + word);
    if(li) {
      li.classList.add('found');
    }
  }
  function checkWin() {
    if(foundWords.size === words.length) {
      setTimeout(() => {
        alert("🎉 ¡Felicidades! Encontraste todas las palabras.");
      }, 100);
    }
  }
  function setupEvents() {
    boardEl.addEventListener('mousedown', onCellMouseDown);
    boardEl.addEventListener('mouseenter', e => {
      if(e.buttons === 1) onCellMouseEnter(e);
    });
    window.addEventListener('mouseup', onMouseUp);
    boardEl.addEventListener('touchstart', e => {
      if(e.target.classList.contains('cell')) {
        e.preventDefault();
        clearSelection();
        isSelecting = true;
        addCellToSelection(e.target);
      }
    }, {passive: false});
    boardEl.addEventListener('touchmove', e => {
      const touch = e.touches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      if(isSelecting && el && el.classList.contains('cell')) {
        addCellToSelection(el);
      }
    });
    window.addEventListener('touchend', e => {
      if(isSelecting) {
        isSelecting = false;
        checkSelection();
      }
      
      
    });
  }
  function init() {
    setupWordList();
    
    
    initBoard();
    for(let i=0; i<words.length; i++) {
      const success = placeWord(words[i], i);
      if(!success) {
        console.warn("No se pudo colocar la palabra:", words[i]);
      }
    }
    
    
    fillEmpty();
    renderBoard();
    setupEvents();
  }
  window.onload = init;
})();
