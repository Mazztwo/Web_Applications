// Alessio Mazzone
///////////////////////////


// Player Object
function Player(name, birthday)
{
    this.name = name;
    this.birthday = birthday;
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

    // Checks current board to see if either player has won
    this.isWin = function ()
    {
        for(var row = 0; row < 6; row++)
        {
            for(var col = 0; col < 7; col++)
            {
                // Check up/down for each player
                if( (row-3) >= 0 )
                {
                    if( game_board.rows[row][col] === 1 && 
                        game_board.rows[row-1][col] === 1 &&
                        game_board.rows[row-2][col] === 1 &&
                        game_board.rows[row-3][col] === 1 )
                    {
                        return true;
                    }

                    if( game_board.rows[row][col] === 2 && 
                        game_board.rows[row-1][col] === 2 &&
                        game_board.rows[row-2][col] === 2 &&
                        game_board.rows[row-3][col] === 2 )
                    {
                        return true;
                    }

                    // Check diagonals up-left
                    if( (col-3) >= 0)
                    {
                        if( game_board.rows[row][col] === 1 && 
                            game_board.rows[row-1][col-1] === 1 &&
                            game_board.rows[row-2][col-2] === 1 &&
                            game_board.rows[row-3][col-3] === 1 )
                        {
                            return true;
                        }

                        if( game_board.rows[row][col] === 2 && 
                            game_board.rows[row-1][col-1] === 2 &&
                            game_board.rows[row-2][col-2] === 2 &&
                            game_board.rows[row-3][col-3] === 2 )
                        {
                            return true;
                        }
                    }

                    // Check diagonals up-right
                    if( (col+3) <= 6)
                    {
                        if( game_board.rows[row][col] === 1 && 
                            game_board.rows[row-1][col+1] === 1 &&
                            game_board.rows[row-2][col+2] === 1 &&
                            game_board.rows[row-3][col+3] === 1 )
                        {
                            return true;
                        }

                        if( game_board.rows[row][col] === 2 && 
                            game_board.rows[row-1][col+1] === 2 &&
                            game_board.rows[row-2][col+2] === 2 &&
                            game_board.rows[row-3][col+3] === 2 )
                        {
                            return true;
                        }
                    }

                }
                // Check left/right
                if( (col-3) >= 0 )
                {
                    if( game_board.rows[row][col] === 1 && 
                        game_board.rows[row][col-1] === 1 &&
                        game_board.rows[row][col-2] === 1 &&
                        game_board.rows[row][col-3] === 1 )
                    {
                        return true;
                    }

                    if( game_board.rows[row][col] === 2 && 
                        game_board.rows[row][col-1] === 2 &&
                        game_board.rows[row][col-2] === 2 &&
                        game_board.rows[row][col-3] === 2 )
                    {
                        return true;
                    }

                    // Check diagonals down-left
                    if( (row+3) <= 5)
                    {
                        if( game_board.rows[row][col] === 1 && 
                            game_board.rows[row+1][col-1] === 1 &&
                            game_board.rows[row+2][col-2] === 1 &&
                            game_board.rows[row+3][col-3] === 1 )
                        {
                            return true;
                        }

                        if( game_board.rows[row][col] === 2 && 
                            game_board.rows[row+1][col-1] === 2 &&
                            game_board.rows[row+2][col-2] === 2 &&
                            game_board.rows[row+3][col-3] === 2 )
                        {
                            return true;
                        }
                    }
                }
                // Check diagonals down-right
                if ( ((row+3) <= 5) && ((col+3) <=6) )
                {
                    if( game_board.rows[row][col] === 1 && 
                        game_board.rows[row+1][col+1] === 1 &&
                        game_board.rows[row+2][col+2] === 1 &&
                        game_board.rows[row+3][col+3] === 1 )
                    {
                        return true;
                    }

                    if( game_board.rows[row][col] === 2 && 
                        game_board.rows[row+1][col+1] === 2 &&
                        game_board.rows[row+2][col+2] === 2 &&
                        game_board.rows[row+3][col+3] === 2 )
                    {
                        return true;
                    }
                } 
            }
        }
        
        return false;
    }

    // Given a column, place a token in the lowest possible row.
    // Returns true/false based upon success/falure token placement
    this.placeToken = function(col)
    {   
        for(var row = 5; row >= 0; row--)
        {   
            // Check each row and place token in lowest 
            if ( this.rows[row][col] === 0)
            {
                // Update board to display token
                // Get the current row and cell, and change its source image
                // based on which player's turn it is.
                if (turn === 1)
                {
                    // Get curr row
                    var curr_row = document.getElementById("r"+row);
                    // Grab the cell, and the corresponding image, and change its source
                    curr_row.cells[col].children[0].src = "images/red-circle.png"

                    // Update internal game representation
                    this.rows[row][col] = 1;
                }
                else
                {
                    // Get curr row
                    var curr_row = document.getElementById("r"+row);
                    // Grab the cell, and the corresponding image, and change its source
                    curr_row.cells[col].children[0].src = "images/black-circle.png"

                    // Update internal game representation
                    this.rows[row][col] = 2;
                }

                // Make turn next players and decrement curr player tokens
                if ( turn === 1 )
                {
                    player1.tokens_left--;
                    turn = 2;
                }
                else
                {
                    player2.tokens_left--;
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

// This method creates and renders the game board
function renderBoard()
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

// This method creates and renders the HiScores table
function renderHiscores()
{
    // parent = div in html where game board goes
    var parent = document.getElementById("game");

    // Remove game board
    parent.removeChild(parent.childNodes[0]);

    // Stop timer
    clearInterval(time_interval);
    time_interval = 0;
    document.getElementById("timer").innerHTML = "HiScores";

    // htmlBoard = actual table to inject into parent
    var hiscores = document.createElement("table");

    // Set the id of the table to "board"
    hiscores.id = "hiscores";

    // Append the game board to the game divs
    parent.append(hiscores);

    // Create Headers for winner and time elapsed
    var titles = document.createElement("tr");
    var col_t1 = document.createElement("td");
    var col_t2 = document.createElement("td");
    col_t1.innerHTML = "Winner Name";
    col_t2.innerHTML = "Time to Win (mm:ss)";
    col_t1.classList.add("tit");
    col_t2.classList.add("tit");
    titles.appendChild(col_t1);
    titles.appendChild(col_t2);
    hiscores.appendChild(titles);

    // Create cells
    for(var r = 0; r < 10; r++)
    {
        // Create row element to insert cells
        var row = document.createElement("tr");
        row.id = "r" + r;

        for(var c = 0; c < 2; c++)
        {
            // Create cell to insert into row
            var col= document.createElement("td");

            // Set the cell's id to the proper column
            col.id = c;
            
            // Add blank data
            col.innerHTML = "--";

            // Syle cell
            col.classList.add("hiscore_entry");

            // Add cell to row
            row.appendChild(col);
        }

        hiscores.appendChild(row);
    }   
    
    // Get data from local storage to place into table
    storageToTable();
}

function storageToTable()
{
    var tab = document.getElementById("hiscores");
    var children = tab.childNodes;
    var hiscores = JSON.parse(localStorage.getItem("hiscores"));
    var len = Object.keys(hiscores).length;

    // Go through every row in table and populate from localStorage data.
    // Skip row 1 because that is where the row headers are.
    for(var i = 1; i <= len; i++)
    {
        children[i].childNodes[0].innerHTML = hiscores[i-1][0];
        children[i].childNodes[1].innerHTML = hiscores[i-1][1];
    }
}

// This is the callback function for clicking on the board
function placeTokenOnBoard(event)
{
    game_board.placeToken(event.target.id);
    updateTokensLeft();
}

// This method gets all player-entered data and returns an array of two players
function getPlayerData()
{
    // Create Player1
    var player_name1 = prompt("Hello user 1! Please enter your name!", "Enter name here");
    var player_birthday1 = prompt("Please enter your birthday!", "Enter birthday here");
    // Use reg-ex to validate the birthday and split accordingly
    var date_object1 = processBirthday(player_birthday1);
    
    // Create Player 2
    var player_name2 = prompt("Hello user 2! Please enter your name!", "Enter name here");
    var player_birthday2 = prompt("Please enter your birthday!", "Enter birthday here");
    // Use reg-ex to validate the birthday and split accordingly
    var date_object2 = processBirthday(player_birthday2);

    // Set oldest player to player1 and other to player2
    if (date_object1 < date_object2)
    {
        player1 = new Player(player_name1, date_object1);
        player2 = new Player(player_name2, date_object2);
    }
    else
    {
        player1 = new Player(player_name2, date_object2);
        player2 = new Player(player_name1, date_object1);
    }

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

    setTimeout(checkForWin, 200);
}

// This function checks the board for a win and displays appropirate alerts to users
function checkForWin()
{
    // Check for win
    if (game_board.isWin())
    {
        var winner = getWinnerName();

        // Time is one off, subtract.
        sec = sec - 1;

        alert("Congratulations! " + winner + " won in " + min + " minutes and " + sec + " seconds.");

        // Reset the game
        resetGame()
    }
    else
    {
        if(turn == 1)
        {
            alert("Click OK to begin " + player1.name + "\'s turn.");
        }
        else
        {
            alert("Click OK to begin " + player2.name + "\'s turn.");
        }
    }
}

/*  This method uses regular expressions to check the entered birthday.
    The formats below are accepted:
        MM/DD/YYYY - i.e. 01/01/2019
        M/D/YYYY - i.e. 1/1/2019
        MM-DD-YYYY - i.e. 01-01-2019
        M-D-YYYY - i.e. 1-1-2019
        MMM. DD, YYYY - i.e. Jan. 01, 2019
        MMM. D, YYYY - i.e. Jan. 1, 2019
        MMMMMM DD, YYYY - i.e. January 01, 2019
        MMMMMM D, YYYY - i.e. January 1, 2019

    If the string entered by the user is valid, this method returns
    a valid date object.
*/
function processBirthday(birthday)
{
    var re = /^(\d{1,2}|[A-Za-z]{3,9})(\/|-|. | )(\d{1,2})(?:\2|, )(\d{4})$/
    var match = re.test(birthday)
    
    // Validate birthday using regex
    while(!match)
    {
        birthday = prompt("Birthday format not valid. Please enter your birthday!", "Enter valid birthday here");
        match = re.test(birthday);
    }

    // Parse birthday with regex and create date object
    var info = re.exec(birthday);
    var month = info[1];
    var day = info[3];
    var year = info[4];
    var date_obj = new Date(month + " " + day + " " + year);

    return date_obj;
}

// When game ends, this function will reset the game.
function resetGame()
{
    // Reset the game board, no need to create a new object.
    // Having direct access to object properties isn't great,
    // but it's fine for this tiny case.
    game_board.rows = [ 
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
    ];

    // Store everything in local storage!
    storeScores();

    // Display HiScore table
    renderHiscores();

    // Reset player tokens
    player1.tokens_left = 21;
    player2.tokens_left = 21;
    // I put this here instead of just calling updateTokensLeft() because i        
    // want to just update the DOM without checking for win. I don't have time
    // to do this the right way but this works perfectly for the assignment nonetheless.
    document.getElementById("p1_tokens").innerHTML = player1.tokens_left;
    document.getElementById("p2_tokens").innerHTML = player2.tokens_left;

    // Reset time
    sec = 0;
    min = 0;

    // Reset turn
    turn = 1;
}

// This function clears the tokens from the board
function clearTokens()
{
    var board = document.getElementById("board");
    board.parentNode.removeChild(board);
    renderBoard();
}

// This function starts the game.
// button_press = argument that tells function from where it was called.
// button_press = 0 --> function was called from within the javascript
// button_press = 1 --> function called from button press 
function startGame(button_press)
{
    if (button_press)
    {
        // Remove game board
        var parent = document.getElementById("game");
        parent.removeChild(parent.childNodes[0]);

        // Restart time interval if button is pressed while HiScores are showing
        if(time_interval === 0)
        {
            time_interval = setInterval(timer,1000);
        }
        // The interval for the timer is already set. Just reset minutes and seconds.
        else
        {
            min = 0;
            sec = 0;
        }

        // reset turn
        turn = 1;
    }
    // Clear game representation
    game_board.rows = [ 
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
    ];

    // gather player data and set objects accordingly
    getPlayerData();

    // Create game board to display
    renderBoard();
}

function timer()
{
    document.getElementById("timer").innerHTML = min + " minutes : " + sec + " seconds";
    
    if ( sec < 59 )
    {
        sec = sec + 1;
    }
    else
    {
        min = min + 1;
        sec = 0;
    }
}

/* This function populates the Hiscores table from local storage data
   Data is in the form:
   {
       0: [player_name, time_to_victory]
       ....
       ....
   }
   lists fastests 10 games
*/
function storeScores()
{
    // If nothing in local storage, store current time and winner
    if (localStorage.length === 0)
    {   
        var winner = getWinnerName();
        var time_to_win = min + ":" + sec ;

        var hiscore_table = { 0 : [winner, time_to_win]};
        localStorage.setItem("hiscores", JSON.stringify(hiscore_table));
        
    }
    // Grab HiScores table from local storage
    else
    {
        var hiscore_table = JSON.parse(localStorage.getItem("hiscores"));
        var len = Object.keys(hiscore_table).length
        var winner = getWinnerName();
 
        // if length is less than 10, go to the nth entry and add data
        if (len < 10 )
        {
            hiscore_table[len] = [winner, min + ":" + sec];
        }
        else
        {
            var values = hiscore_table[0][1].split(":");
            var greatest_hiscore_time = (parseInt(values[0]) * 60) + parseInt(values[1]);
            var greatest_index = 0;
            var curr_values;
            var curr_hiscore_time;

            // Find a longer time than current win time
            for(var i = 1; i < 10; i++)
            {
                // Converts mm:ss timet to just seconds for comparison
                curr_values = hiscore_table[i][1].split(":");
                curr_hiscore_time = (parseInt(curr_values[0]) * 60) + parseInt(curr_values[1]);

                if(curr_hiscore_time > greatest_hiscore_time)
                {
                    // Found time greater than curr win time
                    greatest_hiscore_time = curr_hiscore_time;
                    greatest_index = i;
                }
            }       
            
            hiscore_table[greatest_index] = [winner, min + ":" + sec];
        }
        localStorage.setItem("hiscores", JSON.stringify(hiscore_table));
    }
}

// Returns the name of the winner. Since the win check happens after the token has been
// placed, the turn will actually have already gone to the next player because baoard.placeToken
// has already changed turn. 
function getWinnerName()
{
    var winner;
    if (turn === 2)
    {
        winner = player1.name;
    }
    else
    {
        winner = player2.name;
    }

    return winner;
}

////// START GAME HERE //////

// Holds which player's turn it is.
// value=1 --> player1 turn, value=2 --> player2 turn
var turn = 1;

// Initialize players and board.
var player1, player2;
var game_board = new Board();

startGame(0);

// Timer Calculations
var sec = 0
var min = 0;
var time_interval = setInterval(timer, 1000);
