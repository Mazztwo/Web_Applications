

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
    var parent = document.querySelector("#game");

    // htmlBoard = actual table to inject into parents
    var htmlBoard = document.createElement("table");

    // Set the id of the table to "board"
    htmlBoard.setAttribute("id", "board");

    // Append the game board to the game divs
    parent.append(htmlBoard);


}

/*
alert("hi!");
var me = new Player("Alessio", 1993, 05, 03);
alert("Hello: " + me.name);
alert("Your birthday is: " + me.birthday.toDateString());
*/

/*
var player_name = prompt("Hello! Please enter your name!", "Enter name here");
var player1 = new Player(player_name, 1993, 05, 03);

player_name = prompt("Hello! Please enter your name!", "Enter name here");
var player2 = new Player(player_name, 1993, 05, 03);

document.querySelector("#p1").createTextNode(player1.name);
document.querySelector("#p2").createTextNode(player2.name);
*/