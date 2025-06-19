(() => {
      // Board setup 5x5 squares numbered 1 to 25 with zigzag numbering for serpents ladders
      const BOARD_SIZE = 25;
      const ROWS = 5;
      const COLS = 5;

      // Snakes and ladders predefined with start => end positions
      // Snakes go from higher to lower number, ladders from lower to higher
      const snakes = {
        17: 7,
        24: 15,
        19: 8
      };

      const ladders = {
        3: 13,
        6: 16,
        10: 22
      };

      // Player positions start at 0 (off board, before position 1)
      const players = [
        { id: 1, position: 0, colorClass: 'player1', name: 'Jugador 1' },
        { id: 2, position: 0, colorClass: 'player2', name: 'Jugador 2' }
      ];

      let currentPlayerIndex = 0;
      let diceRoll = 0;

      const boardEl = document.getElementById('board');
      const diceResultEl = document.getElementById('dice-result');
      const turnInfoEl = document.getElementById('turn-info');
      const rollButton = document.getElementById('roll-button');

      // Generate board squares with zigzag pattern numbering
      function generateBoard() {
        boardEl.innerHTML = '';
        // For invert every other row for zigzag
        for (let row = ROWS - 1; row >= 0; row--) {
          const rowSquares = [];
          for (let col = 0; col < COLS; col++) {
            // Calculate square number based on zigzag rule per row
            let num;
            if ((ROWS - 1 - row) % 2 === 0) {
              num = row * COLS + col + 1;
            } else {
              num = row * COLS + (COLS - 1 - col) + 1;
            }
            rowSquares.push(num);
          }
          for (const num of rowSquares) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.setAttribute('data-square', num);
            square.setAttribute('aria-label', `Casilla ${num}`);
            // Add square number label
            const numberSpan = document.createElement('span');
            numberSpan.className = 'square-number';
            numberSpan.textContent = num;
            square.appendChild(numberSpan);

            // Add snake or ladder indicator if present
            if (snakes[num]) {
              square.insertAdjacentHTML('beforeend', getSnakeSVG());
              square.querySelector('.snake').setAttribute('title', `Serpiente baja a ${snakes[num]}`);
            }
            if (ladders[num]) {
              square.insertAdjacentHTML('beforeend', getLadderSVG());
              square.querySelector('.ladder').setAttribute('title', `Escalera sube a ${ladders[num]}`);
            }

            // Players tokens container
            const tokensContainer = document.createElement('div');
            tokensContainer.classList.add('tokens');
            tokensContainer.setAttribute('aria-live', 'polite');
            square.appendChild(tokensContainer);

            boardEl.appendChild(square);
          }
        }
      }

      // SVG icons for snake and ladder
      function getSnakeSVG() {
        return `
          <svg class="snake" viewBox="0 0 24 24" aria-hidden="true" focusable="false" >
            <path d="M4 20s1.5-2 2-3 2-3 3-3 2 3 3 3 2-2 3-3 2-3 2-3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
          </svg>
        `;
      }

      function getLadderSVG() {
        return `
          <svg class="ladder" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <line x1="6" y1="2" x2="6" y2="22" stroke="currentColor" stroke-width="2" />
            <line x1="18" y1="2" x2="18" y2="22" stroke="currentColor" stroke-width="2" />
            <line x1="6" y1="6" x2="18" y2="6" stroke="currentColor" stroke-width="2" />
            <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" stroke-width="2" />
            <line x1="6" y1="18" x2="18" y2="18" stroke="currentColor" stroke-width="2" />
          </svg>
        `;
      }

      // Update board player tokens positions
      function updatePlayerTokens() {
        // Clear all tokens
        const tokenContainers = boardEl.querySelectorAll('.tokens');
        tokenContainers.forEach(container => {
          container.innerHTML = '';
        });

        players.forEach(player => {
          let pos = player.position;
          if (pos === 0) {
            // Player not on board yet, show token before square 1 as separate (use square 1 tokens container for it)
            const startContainer = boardEl.querySelector('[data-square="1"] .tokens');
            const token = createPlayerToken(player.colorClass, player.name);
            // Add a tooltip to say "Fuera del tablero"
            token.setAttribute('title', `${player.name} listo para empezar`);
            startContainer.appendChild(token);
          } else {
            const squareEl = boardEl.querySelector(`[data-square="${pos}"]`);
            if (squareEl) {
              const tokensContainer = squareEl.querySelector('.tokens');
              const token = createPlayerToken(player.colorClass, player.name);
              tokensContainer.appendChild(token);
            }
          }
        });
      }

      // Create player token element
      function createPlayerToken(colorClass, playerName){
        const token = document.createElement('div');
        token.classList.add('player-token', colorClass);
        token.setAttribute('aria-label', playerName);
        token.setAttribute('role', 'img');
        return token;
      }

      // Roll dice with 1 to 6
      function rollDice() {
        return Math.floor(Math.random() * 6) + 1;
      }

      // Show dice roll result
      function showDiceRoll(roll) {
        diceResultEl.textContent = `Lanzamiento: ${roll}`;
        diceResultEl.setAttribute('aria-live', 'polite');
      }

      // Update turn label
      function updateTurnInfo() {
        const player = players[currentPlayerIndex];
        turnInfoEl.textContent = `Turno: ${player.name} (${player.colorClass === 'player1' ? 'Verde' : 'Azul'})`;
        turnInfoEl.setAttribute('aria-live', 'polite');
      }

      // Move player position with constraints
      function movePlayer(player, steps) {
        let newPos = player.position + steps;
        if (newPos > BOARD_SIZE) {
          // Cannot move beyond 25
          newPos = player.position;
        }

        player.position = newPos;

        // Check for snakes or ladders
        if (snakes[newPos]) {
          player.position = snakes[newPos];
        } else if (ladders[newPos]) {
          player.position = ladders[newPos];
        }
      }

      // Check if player has won
      function checkWin(player) {
        return player.position === BOARD_SIZE;
      }

      // Switch to next player
      function nextPlayer() {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        updateTurnInfo();
      }

      // Handle dice roll click
      function onRollClick() {
        rollButton.disabled = true;

        diceRoll = rollDice();
        showDiceRoll(diceRoll);

        const player = players[currentPlayerIndex];
        movePlayer(player, diceRoll);
        updatePlayerTokens();

        if (checkWin(player)) {
          setTimeout(() => {
            alert(`${player.name} ha ganado!`);
            resetGame();
          }, 50);
          return;
        }

        // If dice roll is not 6, switch player; else same player rolls again
        if (diceRoll !== 6) {
          nextPlayer();
        }

        setTimeout(() => {
          rollButton.disabled = false;
        }, 300);
      }

      // Reset game state
      function resetGame() {
        players.forEach(p => p.position = 0);
        currentPlayerIndex = 0;
        diceRoll = 0;
        showDiceRoll('-');
        updateTurnInfo();
        updatePlayerTokens();
        rollButton.disabled = false;
      }

      // Initialization
      function init() {
        generateBoard();
        resetGame();
        rollButton.addEventListener('click', onRollClick);
      }

      init();
    })();
