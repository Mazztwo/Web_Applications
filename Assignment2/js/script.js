

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
    // Create Player1
    var player_name = prompt("Hello! Please enter your name!", "Enter name here");
    var player_birthday = prompt("Please enter your birthday!", "Enter birthday here");
    // Use reg-ex to validate the birthday and split accordingly
    var birthday_array = validateBirthday(player_birthday);

    // Enter valid birthday
    while ( birthday_array === -1 )
    {

    }
    var player1 = new Player(player_name, birthday[0], birthday[1], birthday[2]);

    // Create Player 2
    player_name = prompt("Hello! Please enter your name!", "Enter name here");
    player_birthday = prompt("Please enter your birthday!", "Enter birthday here");
    birthday_array = validateBirthday(player_birthday);
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
    an array with the fllowing structure:
        [year, month, day]
*/
function validateBirthday(birthday)
{
    // Pattern: num 1-12 once, followed by /, num 1-31 once, followed by slash, any digit only once  
    var pattern = /[1-12]{1}\/[1-31]{1}\/[\d]{1}/;

    // successfully split into year,month,day
    if (pattern.length === 3)
    {
        return pattern
    }
    else
    {
        return -1;
    }
}




console.log(validateBirthda(""));


// start();