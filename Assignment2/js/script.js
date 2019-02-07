// Global var holding which player's turn it is.
// The value is 1 for Player1 and 2 for Player2
var turn = 1;

// Globals holding each player and the board representation
var player1, player2;
var game_board = new Board;


// Player Object
function Player(name, year, month, day)
{
    this.name = name;
    this.birthday = new Date(year,month,day);
    this.tokens_left = 21;

    return this;
}

// Board object
function Board()
{
    this.rows = [ 
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
    ];

    this.isWin = function ()
    {
        return false;
    }

    // Given a column, place a token in the lowest possible row.
    // Returns true/false based upon success/falure token placement
    this.placeToken = function(col, player)
    {   
        for(var row = 5; row >= 0; row--)
        {   
            // Check each row and place token in lowest 
            if ( this.rows[row][col] === 0)
            {
                // Update internal game representation
                this.rows[row][col] = 1;

                // Update board to display token
                // Get the current row and cell, and change its source image
                // based on which player's turn it is.
                if (player === 1)
                {
                    // Get curr row
                    var curr_row = document.getElementById("r"+row);
                    // Grab the cell, and the corresponding image, and change its source
                    curr_row.cells[col].children[0].src = "images/black-circle.png"
                }
                else
                {
                    // Get curr row
                    var curr_row = document.getElementById("r"+row);
                    // Grab the cell, and the corresponding image, and change its source
                    curr_row.cells[col].children[0].src = "images/red-circle.png"
                }

                // Make turn next player's
                if ( turn === 1 )
                {
                    turn = 2;
                }
                else
                {
                    turn = 1;
                }

                return true;
            }
        }

        // Token could not be placed. Alert player that column is full
        // and to pick another column to place token.
        alert("Column is full! Please place token in free column!");

        return false;;
    }

    return this;
}

// This method creates the game board
function createBoard()
{
    // parent = div in html where game board goes
    var parent = document.getElementById("game");

    // htmlBoard = actual table to inject into parent
    var htmlBoard = document.createElement("table");

    // Set the id of the table to "board"
    htmlBoard.setAttribute("id", "board");

    // Append the game board to the game divs
    parent.append(htmlBoard);

    // Create cells
    for(var r = 0; r < 6; r++)
    {
        // Create row element to insert cells
        var row = document.createElement("tr");
        row.id = "r" + r;

        for(var c = 0; c < 7; c++)
        {
            // Create cell to insert into row
            var col= document.createElement("td");

            // Add cell class to the newly created element
            col.classList.add("cell");

            // Set the cell's id to the proper column
            col.id = c;

             // This element is the white token picture provided.
            // The image source points to the images folder.
            var cell_image = document.createElement("img");
            cell_image.src = "images/white-circle.png"

            // I know it's normally bad practice to have multiple elements have the same ID,
            // but in this case I want that functionality. Becuase I set the callback function
            // to activate when a user clicks on either a cell or the image, it's still the same
            // column regardless and so I don't care if they have the same ID because what i'll need
            // is the column number.
            cell_image.id = c;
              
            // Add event listener to cell
            col.addEventListener("click", placeTokenOnBoard);

            // Add blank token
            col.appendChild(cell_image);

            // Add cell to row
            row.appendChild(col);
        }

        htmlBoard.appendChild(row);
    }
}

// This is the callback function for clicking on the board
function placeTokenOnBoard(event)
{
    game_board.placeToken(event.target.id, turn);
    
}

// This method gets all player-entered data and returns an array of two players
function getPlayerData()
{
    // Create Player1
    var player_name = prompt("Hello! Please enter your name!", "Enter name here");
    // var player_birthday = prompt("Please enter your birthday!", "Enter birthday here");
    // Use reg-ex to validate the birthday and split accordingly
    // var birthday_array = validateBirthday(player_birthday);

    // Enter valid birthday
    //while ( birthday_array === -1 )
    //{

    //}
    //var player1 = new Player(player_name, birthday[0], birthday[1], birthday[2]);
    player1 = new Player(player_name, 1993, 05, 03);

    // Create Player 2
    player_name = prompt("Hello! Please enter your name!", "Enter name here");
    //player_birthday = prompt("Please enter your birthday!", "Enter birthday here");
    // birthday_array = validateBirthday(player_birthday);
    player2 = new Player(player_name, 1993, 05, 03);


    // BEFORE CREATING PLAYERS, VALIDATE BIRTHDAY AND MAKE PLAYER1 THE
    // OLDEST (LEFT) AND PLAYER2 THE OTHER (RIGHT)






    // Add player data to board
    document.getElementById("p1_name").innerHTML = player1.name;
    document.getElementById("p2_name").innerHTML = player2.name;
    updateTokensLeft();
}

// This method updates the tokens left for each player on the board
function updateTokensLeft()
{
    document.getElementById("p1_tokens").innerHTML = player1.tokens_left;
    document.getElementById("p2_tokens").innerHTML = player2.tokens_left;
}

/*  This method uses regular expressions to check the entered birthday.
    The formats below are accepted:
        MM/DD/YYYY - i.e. 01/01/2019
        M/D/YYYY - i.e. 1/1/2019
        MM-DD-YYYY - i.e. 01-01-2019
        M-D-YYYY - i.e. 1-1-2019
        MM hnjmM. DD, YYYY - i.e. Jan. 01, 2019
        MMM. D, YYYY - i.e. Jan. 1, 2019
        MMMMMM DD, YYYY - i.e. January 01, 2019
        MMMMMM D, YYYY - i.e. January 1, 2019cvx z

    If the string entered by the user is valid, this method returns
    an array with the fllowing structure:
        [year, month, day]
*/
function validateBirthday(birthday)
{
    // Pattern: num 1-12 once, followed by /, num 1-31 once, followed by slash, any digit only once  
    var pattern = /([1-9]|1)[0-2]?/;

    var b_day_split = birthday.split(pattern) ;             

    // successfully split into year,month,day
    if (b_day_split.length === 3)
    {
        return b_day_split;
    }
    else
    {
        return -1;
    }
}



// This function will act as the game loop
function gameLoop(players, board)
{   
    // Continue game while neither player has won
    //while( board.isWin() === false )
    //{

    //}
}

////// START GAME HERE //////

// Create players and get their information
getPlayerData();
// Create game board to display
createBoard();
// Start Game loop
gameLoop();