from flask import Flask, request, session, render_template, abort, redirect, url_for
from models import db, Player, Game
import datetime
import os

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
    return render_template("landing.html", games=games, curr_user=int(id))

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

@app.route("/game/<game_id>/")
def game(game_id=None):
    if game_id:
        game = db.session.query(Game).get(game_id)
        return render_template("game.html", game=game)

    return abort(404)

# CLI Commands
@app.cli.command("initdb")
def init_db():
    """Initializes database and any model objects necessary for assignment"""
    db.drop_all()
    db.create_all()

    print("Initialized Connect 4 Database.")

@app.cli.command("devinit")
def init_dev_data():
    """Initializes database with data for development and testing"""
    db.drop_all()
    db.create_all()
    print("Initialized Connect 4 Database.")

    g = Game()
    db.session.add(g)

    p1 = Player(username="p1", birthday=datetime.datetime.strptime('11/06/1991', '%m/%d/%Y').date(), password="p1")
    p2 = Player(username="p2", birthday=datetime.datetime.strptime('01/14/1987', '%m/%d/%Y').date(), password="p2")

    db.session.add(p1)
    print("Created %s" % p1.username)
    db.session.add(p2)
    print("Created %s" % p2.username)

    g.player_one = p1
    g.player_two = p2
    g.created_by = p1

    db.session.commit()
    print("Added dummy data.") 

if __name__ == "__main__":
    app.run(threaded=True)
