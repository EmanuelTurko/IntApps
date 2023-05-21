const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
};

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
};
const shuffle = array => {
    const DupArr = [...array]

    for (let index = DupArr.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = DupArr[index]

        DupArr[index] = DupArr[randomIndex]
        DupArr[randomIndex] = original
    }

    return DupArr
}

const pickRandom = (array, items) => {
    const DupArr = [...array]
    const randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * DupArr.length)
        
        randomPicks.push(DupArr[randomIndex])
        DupArr.splice(randomIndex, 1)
    }

    return randomPicks
}

const generateGame = () => {
    const pairsSelect = document.querySelector('#pairs-select');
    const pairs = parseInt(pairsSelect.value, 10);
    const dimensions = Math.ceil(Math.sqrt(pairs * 2));

    if (dimensions % 1 !== 0) {
        throw new Error('The number of pairs does not have a valid square root.');
    }

    const emojis = ['🙈','🙉','🙊','🐌','🐣','🦖','🦭','🦄','🦍','🦦','🦥','🐉','🦚','🦃','🦬','🦣','🐳','🦞','🐢','🦔','🐕','🐩','🦮','🐖','🦘','🐅','🦓','🦅','🦋','🐛','🦌','🐡','🐏','🦒'];
    const picks = pickRandom(emojis, pairs);
    const items = shuffle([...picks, ...picks]);
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
        </div>
    `;

    const parser = new DOMParser().parseFromString(cards, 'text/html');

    selectors.boardContainer.innerHTML = '';
    selectors.boardContainer.appendChild(parser.querySelector('.board'));

    // Add the following code to ensure selectors.win is in the correct position
    selectors.boardContainer.insertAdjacentHTML('beforeend', `
        <div class="win"></div>
    `);
    selectors.win = selectors.boardContainer.querySelector('.win');
};
const startGame = () => {
    selectors.start.disabled = true; // Disable the "Start" button
    selectors.start.classList.add('disabled'); // Add the "disabled" class
    state.gameStarted = true;
    selectors.start.classList.add('disabled');
    const playerNameInput = document.querySelector('#player-name-input');
    playerName = playerNameInput.value.trim(); // Assign the input value to playerName
    if (!playerName || !/^[a-zA-Z]+$/.test(playerName)) {
        selectors.start.disabled = false; // Enable the "Start" button
        selectors.start.classList.remove('disabled'); // Remove the "disabled" class
        return;
    }
    // Hide player's name input 
    const playerNameContainer = document.querySelector('.PlayerName');
    playerNameContainer.style.display = 'none';
  
    // Display the "Now Playing" title
    const playerNameTitle = document.createElement('div');
    playerNameTitle.classList.add('now-playing');
    playerNameTitle.innerHTML = `Now Playing: <span class="highlight">${playerName}</span>`;    selectors.boardContainer.insertBefore(playerNameTitle, selectors.boardContainer.firstChild);
    const pairsSelect = document.querySelector('#pairs-select');
    pairsSelect.disabled = true;
    pairsSelect.style.display = 'none';
  
    state.loop = setInterval(() => {
      state.totalTime++;
  
      selectors.moves.innerText = `${state.totalFlips} moves`;
      selectors.timer.innerText = `time: ${state.totalTime} sec`;
    }, 1000);
  };
const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}

const flipCard = card => {
    if (!state.gameStarted) {
        return; // Do nothing if the game hasn't started
    }
    state.flippedCards++
    state.totalFlips++

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // If there are no more cards that we can flip, we won the game
if (!document.querySelectorAll('.card:not(.flipped)').length) {
    setTimeout(() => {
        selectors.boardContainer.classList.add('flipped')
        selectors.win.innerHTML = `
            <span class="win-text">
                <span class="highlight">${playerName}</span> won!<br />
                with <span class="highlight">${state.totalFlips}</span> moves<br />
                under <span class="highlight">${state.totalTime}</span> seconds
            </span>
        `

        clearInterval(state.loop)
    }, 1000)
}
}
const attachEventListeners = () => {
    const pairsSelect = document.querySelector('#pairs-select');
    pairsSelect.addEventListener('change', generateGame);

    const boardContainer = document.querySelector('.board-container');
    boardContainer.addEventListener('click', event => {
        const eventTarget = event.target;
        const card = eventTarget.closest('.card');
        if (card && !card.classList.contains('flipped')) {
            flipCard(card);
        }
    });

    selectors.start.addEventListener('click', startGame);
};
generateGame()
attachEventListeners()