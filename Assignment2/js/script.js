

// Player Object
function Player(name, year, month, day)
{
    this.name = name;
    this.birthday = new Date(year,month,day);

    return this;
}

function Board()
{

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

alert("hi!");

var me = new Player("Alessio", 1993, 05, 03);

alert("Hello: " + me.name);
alert("Your birthday is: " + me.birthday.toDateString());