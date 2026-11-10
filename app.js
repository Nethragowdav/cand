document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const width = 8;
    const squares = [];
    let score = 0;

    const candyColors = [
        '<span>🔴</span>', // Red
        '<span>🟠</span>', // Orange
        '<span>🟡</span>', // Yellow
        '<span>🟢</span>', // Green
        '<span>🔵</span>', // Blue
        '<span>🟣</span>'  // Purple
    ];

    let colorBeingDragged;
    let colorBeingReplaced;
    let squareIdBeingDragged;
    let squareIdBeingReplaced;

    // Create Board
    function createBoard() {
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.setAttribute('draggable', true);
            
            // Random candy generation ensuring no initial matches
            let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
            square.innerHTML = randomColor;
            grid.appendChild(square);
            squares.push(square);
        }
    }
    createBoard();

    // Dragging Candies
    squares.forEach(square => square.addEventListener('dragstart', dragStart));
    squares.forEach(square => square.addEventListener('dragend', dragEnd));
    squares.forEach(square => square.addEventListener('dragover', dragOver));
    squares.forEach(square => square.addEventListener('dragenter', dragEnter));
    squares.forEach(square => square.addEventListener('dragleave', dragLeave));
    squares.forEach(square => square.addEventListener('drop', dragDrop));

    function dragStart() {
        colorBeingDragged = this.innerHTML;
        squareIdBeingDragged = parseInt(this.id);
    }

    function dragOver(e) { e.preventDefault(); }
    function dragEnter(e) { e.preventDefault(); }
    function dragLeave() {}

    function dragDrop() {
        colorBeingReplaced = this.innerHTML;
        squareIdBeingReplaced = parseInt(this.id);
        squares[squareIdBeingDragged].innerHTML = colorBeingReplaced;
        this.innerHTML = colorBeingDragged;
    }

    function dragEnd() {
        // Valid moves: adjacent squares only
        let validMoves = [
            squareIdBeingDragged - 1,
            squareIdBeingDragged - width,
            squareIdBeingDragged + 1,
            squareIdBeingDragged + width
        ];

        let validMove = validMoves.includes(squareIdBeingReplaced);

        if (squareIdBeingReplaced && validMove) {
            squareIdBeingReplaced = null;
        } else if (squareIdBeingReplaced && !validMove) {
            squares[squareIdBeingDragged].innerHTML = colorBeingDragged;
            squares[squareIdBeingReplaced].innerHTML = colorBeingReplaced;
        } else {
            squares[squareIdBeingDragged].innerHTML = colorBeingDragged;
        }
    }

    // Drop candies down once matched
    function moveIntoSquare() {
        for (let i = 0; i < 55; i++) {
            if (squares[i + width].innerHTML === "") {
                squares[i + width].innerHTML = squares[i].innerHTML;
                squares[i].innerHTML = "";
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                if (isFirstRow && squares[i].innerHTML === "") {
                    let randomColor = candyColors[Math.floor(Math.random() * candyColors.length)];
                    squares[i].innerHTML = randomColor;
                }
            }
        }
    }

    // Checking for Matches
    function checkRowForThree() {
        for (let i = 0; i < 61; i++) {
            let rowOfThree = [i, i + 1, i + 2];
            let decidedColor = squares[i].innerHTML;
            let isBlank = squares[i].innerHTML === '';
            const notRow = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
            if (notRow.includes(i)) continue;

            if (rowOfThree.every(index => squares[index].innerHTML === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                rowOfThree.forEach(index => {
                    squares[index].innerHTML = '';
                });
            }
        }
    }

    function checkColumnForThree() {
        for (let i = 0; i < 47; i++) {
            let columnOfThree = [i, i + width, i + width * 2];
            let decidedColor = squares[i].innerHTML;
            let isBlank = squares[i].innerHTML === '';

            if (columnOfThree.every(index => squares[index].innerHTML === decidedColor && !isBlank)) {
                score += 3;
                scoreDisplay.innerHTML = score;
                columnOfThree.forEach(index => {
                    squares[index].innerHTML = '';
                });
            }
        }
    }

    // Game loop
    window.setInterval(() => {
        checkRowForThree();
        checkColumnForThree();
        moveIntoSquare();
    }, 100);
});