from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy

###### SETUP INFORMATION ########################################
app = Flask(__name__)                                           #
app.secret_key = "This is a terrible key"                       #
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///intro.db"    #
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False            #
db = SQLAlchemy(app)                                            #
#################################################################

class Name(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))

    def __init__(self, name):
        self.name = name


@app.route("/")
def hello():
    names = Name.query.all()
    return render_template("home.html", message="Hello World!", names=names)


@app.route("/new-name/", methods=["POST"])
def new_name():
    name = Name(request.form.get("name"))

    db.session.add(name)
    db.session.commit()

    return redirect(url_for("hello"))


@app.cli.command("initdb")
def initdb():
    """Creates SQLite Database"""
    db.drop_all()
    db.create_all()
    print("Database initialized.")


@app.cli.command("add_names")
def cli_names():
    """Adds five names to the names list"""
    print("Adding names...")
    db.session.add(Name("Kazoo"))
    db.session.add(Name("Nathario"))
    db.session.add(Name("Lizzymag"))
    db.session.add(Name("Peppa"))
    db.session.add(Name("Wesley"))
    
    db.session.commit()

    print("Done adding names.")


if __name__ == "__main__":
    app.run()