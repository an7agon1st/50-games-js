document.addEventListener('DOMContentLoaded', () => {
    let grid = document.querySelector('.grid');

    let isGameOver = false;
    let tileNumber = 10;
    let flags = 0;
    let mines = 13;

    let gridArray = [];

    function buildGrid() {
        // array to map the mines and not mines
        let allTiles = Array((tileNumber * tileNumber) - mines).fill('tile');
        let allMines = Array(mines).fill('mine');
        let gridTilesAndBombs = allTiles.concat(allMines);
        shuffle(gridTilesAndBombs);

        // fill grid array
        let count = 0;
        for (let i = 0; i < tileNumber; i++) {
            let row = [];
            for (let j = 0; j < tileNumber; j++) {
                let tile = document.createElement('div');
                tile.setAttribute('id', count);
                tile.setAttribute('neighbors', 0)
                tile.classList.add(gridTilesAndBombs[count]);
                tile.addEventListener('click', (e) => { tileClicked(tile); });
                // on right click
                tile.addEventListener('contextmenu', addFlag);

                grid.appendChild(tile);
                row.push(tile);
                count++;
            }
            gridArray.push(row);
        }

    }

    function countNeighborBombs() {
        for (let i = 0; i < gridArray.length; i++) {

            for (let j = 0; j < gridArray[i].length; j++) {
                const isFirstRow = i == 0;
                const isLastRow = i == tileNumber - 1;
                const isFirstColumn = j == 0;
                const isLastColumn = j == tileNumber - 1;

                // get current neighboring mines count
                let currentNeighbors = parseInt(gridArray[i][j].getAttribute('neighbors'));

                // check the tile over
                if (!isFirstRow) {
                    if (gridArray[i - 1][j].classList.contains('mine')) {
                        currentNeighbors += 1;
                        gridArray[i][j].setAttribute('neighbors', currentNeighbors)
                    }

                    // check top left
                    if (!isFirstColumn) {
                        if (gridArray[i - 1][j - 1].classList.contains('mine')) {
                            currentNeighbors += 1;
                            gridArray[i][j].setAttribute('neighbors', currentNeighbors)
                        }
                    }

                    // check top right
                    if (!isLastColumn) {
                        if (gridArray[i - 1][j + 1].classList.contains('mine')) {
                            currentNeighbors += 1;
                            gridArray[i][j].setAttribute('neighbors', currentNeighbors)
                        }
                    }
                }

                // check tile below
                if (!isLastRow) {
                    if (gridArray[i + 1][j].classList.contains('mine')) {
                        currentNeighbors += 1;
                        gridArray[i][j].setAttribute('neighbors', currentNeighbors)
                    }

                    // check bottom left
                    if (!isFirstColumn) {
                        if (gridArray[i + 1][j - 1].classList.contains('mine')) {
                            currentNeighbors += 1;
                            gridArray[i][j].setAttribute('neighbors', currentNeighbors)
                        }
                    }

                    // check bottom right
                    if (!isLastColumn) {
                        if (gridArray[i + 1][j + 1].classList.contains('mine')) {
                            currentNeighbors += 1;
                            gridArray[i][j].setAttribute('neighbors', currentNeighbors)
                        }
                    }
                }

                // check tile on the left
                if (!isFirstColumn) {
                    if (gridArray[i][j - 1].classList.contains('mine')) {
                        currentNeighbors += 1;
                        gridArray[i][j].setAttribute('neighbors', currentNeighbors)
                    }

                }

                // check tile on the right
                if (!isLastColumn) {
                    if (gridArray[i][j + 1].classList.contains('mine')) {
                        currentNeighbors += 1;
                        gridArray[i][j].setAttribute('neighbors', currentNeighbors)
                    }
                }
            }
        }
    }

    function tileClicked(tile) {
        const totalNeighbors = tile.getAttribute('neighbors');
        if (isGameOver) return;
        if (tile.classList.contains('checked') || tile.classList.contains('flag')) return;
        if (tile.classList.contains('mine')) {
            gameOver();
            return;
        }
        if (totalNeighbors == 0) {
            uncoverNeighbors(tile);
            return;
        }

        const p = document.createElement('p');
        p.innerText = totalNeighbors;
        tile.appendChild(p);
        tile.classList.add('checked')

    }

    function uncoverNeighbors(tile) {
        const i = parseInt(parseFloat(tile.id) / tileNumber);
        const j = parseFloat(tile.id) % tileNumber;

        const isFirstRow = i == 0;
        const isLastRow = i == tileNumber - 1;
        const isFirstColumn = j == 0;
        const isLastColumn = j == tileNumber - 1;

        tile.classList.add('checked');

        if (!isFirstRow) {
            // check the tile over
            tileClicked(gridArray[i - 1][j]);

            // check top left
            if (!isFirstColumn)
                tileClicked(gridArray[i - 1][j - 1]);

            // check top right
            if (!isLastColumn)
                tileClicked(gridArray[i - 1][j + 1]);
        }

        if (!isLastRow) {
            // check tile below
            tileClicked(gridArray[i + 1][j]);

            if (!isFirstColumn)
                // check bottom left
                tileClicked(gridArray[i + 1][j - 1]);

            if (!isLastColumn)
                // check bottom right
                tileClicked(gridArray[i + 1][j + 1]);
        }

        if (!isFirstColumn) {
            // check tile on the left
            tileClicked(gridArray[i][j - 1]);
        }

        if (!isLastColumn) {
            // check tile on the right
            tileClicked(gridArray[i][j + 1]);
        }
    }

    function addFlag(e) {
        e.preventDefault();
        if (isGameOver) return;
        if (this.classList.contains('checked')) return;

        this.classList.toggle('flag')
        if (this.classList.contains('flag')) {
            this.innerHTML = '<p>🚩</p>';
            flags++;
        } else {
            this.innerHTML = '';
            flags--;
        }
        if (flags == mines) {
            // check if all mines are flagged
            for (let i = 0; i < tileNumber; i++) {
                for (let j = 0; j < tileNumber; j++) {
                    if (gridArray[i][j].classList.contains('mine') && !gridArray[i][j].classList.contains('flag')) {
                        return;
                    }
                }
            }

            // game won if true
            gameWon();
        }
    }

    function gameWon() {
        console.log('Game over!!');
        isGameOver = true;
        alert('You won!!')
    }

    function gameOver() {
        for (let i = 0; i < tileNumber; i++) {
            for (let j = 0; j < tileNumber; j++) {
                if (gridArray[i][j].classList.contains('mine')) {
                    gridArray[i][j].innerHTML = '<p>💣</p>';
                    gridArray[i][j].style.backgroundColor = '#e84a5f';
                }
            }

        }
        console.log('Game over!!');
        isGameOver = true;
        alert('Game over!!')
    }

    buildGrid();
    countNeighborBombs();
});

// got this shuffle method off the internet
function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}