const boardTileCount = 8;


document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('div.board');
    const scoreBoard = document.querySelector('.score-board>h1');

    let score = 0;

    const candyTiles = [];
    const tileColors = [
        'cadetblue',
        'chartreuse',
        'yellow',
        'purple',
        'maroon',
        'coral'
    ];

    let colorBeingDragged;
    let colorBeingReplaced;
    let idBeingDragged;
    let idBeingReplaced;

    function buildBoard() {
        for (let i = 0; i < boardTileCount; i++) {
            // create an array of divs and add it to the candytiles array to create a 2d array of all board tiles
            const gridRow = [];

            for (let j = 0; j < boardTileCount; j++) {
                let tile = document.createElement('div');
                tile.classList.add('gridTile');
                board.appendChild(tile);
                tile.setAttribute('draggable', true);
                tile.setAttribute('id', (i * boardTileCount + j));

                const randomIndex = parseInt((Math.random() * 100) % 6)
                tile.style.backgroundColor = tileColors[randomIndex];

                addEventListenersToTile(tile);

                gridRow.push(tile);
            }
            candyTiles.push(gridRow);
        }

    }

    function addEventListenersToTile(tile) {
        tile.addEventListener('dragstart', dragStart);
        tile.addEventListener('dragend', dragEnd);
        tile.addEventListener('dragover', dragOver);
        tile.addEventListener('dragenter', dragEnter);
        tile.addEventListener('dragleave', dragLeave);
        tile.addEventListener('drop', dropTile);
    }

    function dragStart() {
        colorBeingDragged = this.style.backgroundColor;
        idBeingDragged = this.id;
    }

    function dragEnd() { }

    function dragOver(e) {
        e.preventDefault();
    }

    function dragEnter(e) {
        e.preventDefault();
    }

    function dragLeave() { }

    function dropTile() {

        idBeingReplaced = this.id;
        colorBeingReplaced = this.style.backgroundColor;

        const draggedColumnNumber = idBeingDragged % boardTileCount;
        const replacedColumnNumber = idBeingReplaced % boardTileCount;
        const draggedRowNumber = parseInt(idBeingDragged / boardTileCount);
        const replacedRowNumber = parseInt(idBeingReplaced / boardTileCount);

        console.log(draggedColumnNumber, draggedRowNumber);
        console.log(replacedColumnNumber, replacedRowNumber);

        const isColumnDrag = Math.abs(draggedColumnNumber - replacedColumnNumber) === 1 && draggedRowNumber === replacedRowNumber;
        const isRowDrag = Math.abs(draggedRowNumber - replacedRowNumber) === 1 && draggedColumnNumber === replacedColumnNumber

        if (isColumnDrag || isRowDrag) {
            // exchange the colors
            const itemBeingDragged = document.getElementById(idBeingDragged);
            const tempColor = this.style.backgroundColor;
            this.style.backgroundColor = colorBeingDragged;
            itemBeingDragged.style.backgroundColor = tempColor;

            // -1 point on move
            updateScore(-1);
        }

    }



    function checkMatches() {
        for (let k = 0; k < candyTiles.length; k++) {

            // console.groupCollapsed(`row ${k}`)
            checkRowMatch(k);
            // console.groupEnd(`row ${k}`)

            // console.groupCollapsed(`column ${k}`)
            checkColumnMatch(k);
            // console.groupEnd(`column ${k}`)
        }
    }

    function checkRowMatch(rowNumber) {
        let matchIndex = 0;
        let matchColor = '';
        let numberOfMatches = 1;

        // check every row
        for (j = 0; j < candyTiles[rowNumber].length; j++) {
            // check mismatch
            if (candyTiles[rowNumber][j].style.backgroundColor != matchColor) {
                // if matches are >=3, change color to black
                if (numberOfMatches > 2) {
                    for (let i = 0; i < numberOfMatches; i++) {
                        candyTiles[rowNumber][matchIndex + i].style.backgroundColor = 'white';
                    }
                    updateScore(numberOfMatches);
                }
                matchIndex = j;
                matchColor = candyTiles[rowNumber][j].style.backgroundColor;
                numberOfMatches = 1;
            } else {
                numberOfMatches++;
            }
            // console.log(matchIndex, matchColor, numberOfMatches);
        }
        if (numberOfMatches > 2) {
            for (let i = 0; i < numberOfMatches; i++) {
                candyTiles[rowNumber][matchIndex + i].style.backgroundColor = 'white';
            }
            updateScore(numberOfMatches);

        }
        // console.log(matchIndex, matchColor, numberOfMatches);
        // console.log('\n')
    }

    function checkColumnMatch(columnNumber) {
        // check every colmn
        let matchIndex = 0;
        let matchColor = '';
        let numberOfMatches = 1;

        for (j = 0; j < candyTiles[columnNumber].length; j++) {
            // check mismatch
            if (candyTiles[j][columnNumber].style.backgroundColor != matchColor) {
                // if matches are >=3, change color to black
                if (numberOfMatches > 2) {
                    for (let i = 0; i < numberOfMatches; i++) {
                        candyTiles[matchIndex + i][columnNumber].style.backgroundColor = 'white';
                    }
                    // update score
                    updateScore(numberOfMatches);
                }
                matchIndex = j;
                matchColor = candyTiles[j][columnNumber].style.backgroundColor;
                numberOfMatches = 1;
            } else {
                numberOfMatches++;
            }
            // console.log(matchIndex, matchColor, numberOfMatches);
        }
        if (numberOfMatches > 2) {
            for (let i = 0; i < numberOfMatches; i++) {
                candyTiles[matchIndex + i][columnNumber].style.backgroundColor = 'white';
            }
            updateScore(numberOfMatches);
        }
        // console.log(matchIndex, matchColor, numberOfMatches);
        // console.log('\n')
    }

    function fallTiles() {
        for (let row = 1; row < candyTiles.length; row++) {
            for (let column = 0; column < candyTiles[row].length; column++) {
                if (candyTiles[row][column].style.backgroundColor == 'white') {
                    candyTiles[row][column].style.backgroundColor = candyTiles[row - 1][column].style.backgroundColor;
                    candyTiles[row - 1][column].style.backgroundColor = 'white';
                }
            }
        }
    }

    function fillBlankTiles() {
        for (let i = 0; i < candyTiles[0].length; i++) {
            if (candyTiles[0][i].style.backgroundColor == 'white') {
                const randomIndex = parseInt((Math.random() * 100) % 6)
                candyTiles[0][i].style.backgroundColor = tileColors[randomIndex];
            }
        }
    }

    function updateScore(points) {
        score += points;
        scoreBoard.innerText = score;
    }


    buildBoard();

    // check matches every 100ms
    window.setInterval(checkMatches, 100);
    // fallTiles()
    window.setInterval(fallTiles, 100);
    window.setInterval(fillBlankTiles, 100);

})