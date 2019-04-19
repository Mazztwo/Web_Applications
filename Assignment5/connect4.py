from flask import Flask, request, session, render_template, abort, redirect, url_for
from models import db, Player, Game
import datetime
import os
import json

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(
    app.root_path, "connect4.db"
)
# Suppress deprecation warning
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

@app.route("/")
def login_page():
    return render_template("login.html")

@app.route("/landing/<id>")
def landing_page(id):
    games = Game.query.filter(db.or_(
        Game.player_one_id==int(id), 
        Game.player_two_id==int(id)
        )).all()

    # get top 10 games
    wins = {}
    for game in games:
        if (game.winner_id == int(id)):
            wins[game.id] = game.turn

    # sort 
    wins = [(k, wins[k]) for k in sorted(wins, key=wins.get, reverse=True)]

    print("WINS ", wins)

    # wins = {game_id:turns, .....}

    return render_template("landing.html", 
                            games=games, 
                            curr_user=Player.query.filter_by(id=int(id)).first(), 
                            wins=wins,
                            len=len(wins))

@app.route("/account-creation-page/")
def account_creation_page():
    return render_template("account_creation.html")

@app.route("/create-acc/", methods=['POST'])
def create_account_logic():

    # Create new user and place into database
    new_user = Player(
        username=request.form["username"], 
        birthday=datetime.datetime.strptime(request.form["birthday"].replace("-","/"), '%Y/%m/%d').date(),
        password=request.form["password"]
    )

    db.session.add(new_user)
    db.session.commit()

    return redirect(url_for("login_page"))

@app.route("/login-logic/", methods=['POST'])
def landing_page_logic():

    # Verify username and password
    temp_user = Player.query.filter_by(username=request.form["username"]).first()

    # Check if username is in player table
    if(temp_user):
        # Check if user password is correct
        if(temp_user.password == request.form["password"]):
            # Take user to their landing page
            return redirect(url_for("landing_page", id=temp_user.id))
    
    # User not found/incorrect password
    return redirect(url_for("user_not_found_page"))

# Renders user not found page
@app.route("/user-not-found/")
def user_not_found_page():
    return render_template("wrong_info.html")

@app.route("/game/<curr_user>/<game_id>/", methods=['GET'])
def game(game_id=None, curr_user=None):
    if game_id:
        game = db.session.query(Game).get(game_id)
        return render_template("game.html", game=game, curr_user=curr_user)

    return abort(404)

@app.route("/delete-logic/<game_id>/")
def delete_logic(game_id):
    # Delete game and re-render landing page
    user_id = Game.query.filter_by(id=int(game_id)).first().created_by_id
    Game.query.filter_by(id=int(game_id)).delete()

    db.session.commit()
    return redirect(url_for("landing_page", id=user_id))

@app.route("/new_token", methods=["POST"])
def add():
    # Get game from request
    json_game = json.loads(request.form["game"])

    # Update game in db
    curr_game = Game.query.filter_by(id=json_game["gameId"]).first()
    curr_game.persisted = request.form["game"]
    curr_game.turn = json_game["turn"]

    if (json_game["gameOver"] == True):
        curr_game.game_over = 1

        if (json_game["p1"]["winner"] == True):
            curr_game.winner_id = curr_game.player_one_id
        else:
            curr_game.winner_id = curr_game.player_two_id

    db.session.commit()

    print("UPDATED DB")
    return "token updated"

@app.route("/game_board", methods=["POST"])
def poll():

    # Get current game in db and send to js
    curr_game = Game.query.filter_by(id=request.form["game_id"]).first()

    return curr_game.persisted

# CLI Commands
@app.cli.command("initdb")
def init_db():
    """Initializes database and any model objects necessary for assignment"""
    db.drop_all()
    db.create_all()

    print("Initialized Connect 4 Database.")

@app.cli.command("rawr")
def init_dev_data():
    """Initializes database with data for development and testing"""
    db.drop_all()
    db.create_all()
    print("Initialized Connect 4 Database.")

    g1 = Game()
    g2 = Game()
    g3 = Game()
    db.session.add(g1)
    db.session.add(g2)
    db.session.add(g3)

    p1 = Player(username="p1", birthday=datetime.datetime.strptime('11/06/1991', '%m/%d/%Y').date(), password="p1")
    p2 = Player(username="p2", birthday=datetime.datetime.strptime('01/14/1987', '%m/%d/%Y').date(), password="p2")
    p3 = Player(username="p3", birthday=datetime.datetime.strptime('06/03/1993', '%m/%d/%Y').date(), password="p3")

    db.session.add(p1)
    db.session.add(p2)
    db.session.add(p3)

    g1.player_one = p1
    g1.player_two = p2
    g1.created_by = p1
    g1.persisted = """{
            "gameId": 1, 
            "p1": 
                {"name": \""""+p1.username+"""\", 
                "id": 1, 
                "birthday": \""""+p1.birthday_format()+"""\", 
                "isRedToken": false, 
                "tokensRemaining": 21, 
                "remainingToWin": 4, 
                "winner": false
                }, 
            "p2": 
                {"name": \""""+p2.username+"""\", 
                "id": 2, 
                "birthday": \""""+p2.birthday_format()+"""\",
                "isRedToken": true, 
                "tokensRemaining": 21, 
                "remainingToWin": 4, 
                "winner": false
                }, 
            "turn": 1, 
            "tokenState": [
                {"row": 0, "col": 0}, {"row": 0, "col": 1}, {"row": 0, "col": 2}, {"row": 0, "col": 3}, {"row": 0, "col": 4}, {"row": 0, "col": 5}, {"row": 0, "col": 6}, 
                {"row": 1, "col": 0}, {"row": 1, "col": 1}, {"row": 1, "col": 2}, {"row": 1, "col": 3}, {"row": 1, "col": 4}, {"row": 1, "col": 5}, {"row": 1, "col": 6}, 
                {"row": 2, "col": 0}, {"row": 2, "col": 1}, {"row": 2, "col": 2}, {"row": 2, "col": 3}, {"row": 2, "col": 4}, {"row": 2, "col": 5}, {"row": 2, "col": 6}, 
                {"row": 3, "col": 0}, {"row": 3, "col": 1}, {"row": 3, "col": 2}, {"row": 3, "col": 3}, {"row": 3, "col": 4}, {"row": 3, "col": 5}, {"row": 3, "col": 6}, 
                {"row": 4, "col": 0}, {"row": 4, "col": 1}, {"row": 4, "col": 2}, {"row": 4, "col": 3}, {"row": 4, "col": 4}, {"row": 4, "col": 5}, {"row": 4, "col": 6}, 
                {"row": 5, "col": 0}, {"row": 5, "col": 1}, {"row": 5, "col": 2}, {"row": 5, "col": 3}, {"row": 5, "col": 4}, {"row": 5, "col": 5}, {"row": 5, "col": 6}
                ], 
            "gameOver": false
            }"""

    g2.player_one = p1
    g2.player_two = p3
    g2.created_by = p1
    g2.persisted = """{
            "gameId": 1, 
            "p1": 
                {"name": \""""+p1.username+"""\", 
                "id": 1, 
                "birthday": \""""+p1.birthday_format()+"""\", 
                "isRedToken": false, 
                "tokensRemaining": 21, 
                "remainingToWin": 4, 
                "winner": false
                }, 
            "p2": 
                {"name": \""""+p3.username+"""\", 
                "id": 3, 
                "birthday": \""""+p3.birthday_format()+"""\",
                "isRedToken": true, 
                "tokensRemaining": 21, 
                "remainingToWin": 4, 
                "winner": false
                },
            "turn": 1, 
            "tokenState": [
                {"row": 0, "col": 0}, {"row": 0, "col": 1}, {"row": 0, "col": 2}, {"row": 0, "col": 3}, {"row": 0, "col": 4}, {"row": 0, "col": 5}, {"row": 0, "col": 6}, 
                {"row": 1, "col": 0}, {"row": 1, "col": 1}, {"row": 1, "col": 2}, {"row": 1, "col": 3}, {"row": 1, "col": 4}, {"row": 1, "col": 5}, {"row": 1, "col": 6}, 
                {"row": 2, "col": 0}, {"row": 2, "col": 1}, {"row": 2, "col": 2}, {"row": 2, "col": 3}, {"row": 2, "col": 4}, {"row": 2, "col": 5}, {"row": 2, "col": 6}, 
                {"row": 3, "col": 0}, {"row": 3, "col": 1}, {"row": 3, "col": 2}, {"row": 3, "col": 3}, {"row": 3, "col": 4}, {"row": 3, "col": 5}, {"row": 3, "col": 6}, 
                {"row": 4, "col": 0}, {"row": 4, "col": 1}, {"row": 4, "col": 2}, {"row": 4, "col": 3}, {"row": 4, "col": 4}, {"row": 4, "col": 5}, {"row": 4, "col": 6}, 
                {"row": 5, "col": 0}, {"row": 5, "col": 1}, {"row": 5, "col": 2}, {"row": 5, "col": 3}, {"row": 5, "col": 4}, {"row": 5, "col": 5}, {"row": 5, "col": 6}
                ], 
            "gameOver": false
            }"""


    g3.player_one = p2
    g3.player_two = p3
    g3.created_by = p2
    g3.persisted = """{
            "gameId": 1, 
            "p1": 
                {"name": \""""+p2.username+"""\", 
                "id": 2, 
                "birthday": \""""+p2.birthday_format()+"""\", 
                "isRedToken": false, 
                "tokensRemaining": 21, 
                "remainingToWin": 4, 
                "winner": false
                }, 
            "p2": 
                {"name": \""""+p3.username+"""\", 
                "id": 3, 
                "birthday": \""""+p3.birthday_format()+"""\",
                "isRedToken": true, 
                "tokensRemaining": 21, 
                "remainingToWin": 4, 
                "winner": false
                }, 
            "turn": 1, 
            "tokenState": [
                {"row": 0, "col": 0}, {"row": 0, "col": 1}, {"row": 0, "col": 2}, {"row": 0, "col": 3}, {"row": 0, "col": 4}, {"row": 0, "col": 5}, {"row": 0, "col": 6}, 
                {"row": 1, "col": 0}, {"row": 1, "col": 1}, {"row": 1, "col": 2}, {"row": 1, "col": 3}, {"row": 1, "col": 4}, {"row": 1, "col": 5}, {"row": 1, "col": 6}, 
                {"row": 2, "col": 0}, {"row": 2, "col": 1}, {"row": 2, "col": 2}, {"row": 2, "col": 3}, {"row": 2, "col": 4}, {"row": 2, "col": 5}, {"row": 2, "col": 6}, 
                {"row": 3, "col": 0}, {"row": 3, "col": 1}, {"row": 3, "col": 2}, {"row": 3, "col": 3}, {"row": 3, "col": 4}, {"row": 3, "col": 5}, {"row": 3, "col": 6}, 
                {"row": 4, "col": 0}, {"row": 4, "col": 1}, {"row": 4, "col": 2}, {"row": 4, "col": 3}, {"row": 4, "col": 4}, {"row": 4, "col": 5}, {"row": 4, "col": 6}, 
                {"row": 5, "col": 0}, {"row": 5, "col": 1}, {"row": 5, "col": 2}, {"row": 5, "col": 3}, {"row": 5, "col": 4}, {"row": 5, "col": 5}, {"row": 5, "col": 6}
                ], 
            "gameOver": false
            }"""


    db.session.commit()
    print("Added dummy data.") 

if __name__ == "__main__":
    app.run(threaded=True)
