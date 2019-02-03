

// Player Object
function Player(name, year, month, day)
{
    this.name = name;
    this.birthday = new Date(year,month,day);

    return this;
}

// Board object
function Board()
{
    this.board = [ 
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
    ];

    this.isWin = function ()
    {
        return true;
    }

    this.placeToken = function(col)
    {
        return true;
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

        for(var c = 0; c < 7; c++)
        {
            // Create cell to insert into row
            var col= document.createElement("td");

            // Add cell class to the newly created element
            col.classList.add("cell");

             // This element is the white token picture provided.
            // The image source points to the images folder.
            var no_token = document.createElement("img");
            no_token.src = "images/white-circle.png"

            // Add blank token
            col.appendChild(no_token);

            // Add cell to row
            row.appendChild(col);
        }

        htmlBoard.appendChild(row);
    }
}

// This method gets all player-entered data
function getPlayerData()
{
    var player_name = prompt("Hello! Please enter your name!", "Enter name here");
    var player1 = new Player(player_name, 1993, 05, 03);

    player_name = prompt("Hello! Please enter your name!", "Enter name here");
    var player2 = new Player(player_name, 1993, 05, 03);

    // Add player data to board
    document.getElementById("player1").innerHTML += player1.name;
    document.getElementById("player2").innerHTML += player2.name;
}

// This function will act as a main method and will initialize everything
function start()
{

    // Get player names and birthdays
    // getPlayerData();

    // Create game board
    createBoard();
}




start();