from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy

###### SETUP INFORMATION ########################################
app = Flask(__name__)                                           #
app.secret_key = "This is a terrible key"                       #
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///salon.db"    #
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False            #
db = SQLAlchemy(app)                                            #
#################################################################

class Stylist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    username = db.Column(db.String(80))
    password = db.Column(db.String(80))

    def __init__(self, name, username, password):
        self.name = name   
        self.username = username
        self.password = password

class Patron(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    username = db.Column(db.String(80))
    password = db.Column(db.String(80))

    def __init__(self, name, username, password):
        self.name = name   
        self.username = username
        self.password = password    

# Default page. Renders login page
@app.route("/")
def login_page():
    """
    names = Name.query.all()
    return render_template("home.html", message="Hello World!", names=names)
    """
    return render_template("login.html")

# Handles login of users.
@app.route("/user-page/", methods=["POST"])
def get_user_page():

    '''
    name = Name(request.form.get("name"))
    db.session.add(name)
    db.session.commit()
    return redirect(url_for("hello"))
    return render_template("home.html", message="Hello World!", names=names)
    '''
    # Get input from http request
    un = request.form.get("username")
    pw = request.form.get("password")

    if(un == "owner" and pw == "pass"):
        return redirect(url_for("owner_page"))
    else:
        # Check if username is in stylist table
        temp_user = Stylist.query.filter_by(username=un).first()
        if(temp_user):
            # Check if stylist password is correct
            if(temp_user.password == pw):
                # Take user to their profile
                return redirect(url_for("stylist_page", stylist=temp_user.name))
        
        # Check if username is in patron table
        temp_user = Patron.query.filter_by(username=un).first()
        if(temp_user):
            # Check if patron password is correct
            if(temp_user.password == pw):
                # Take user to their profile
                return redirect(url_for("patron_page", patron=temp_user.name))

        return redirect(url_for("user_not_found_page"))

# Renders owner page
@app.route("/owner-page/", methods=["GET"])
def owner_page():
    return render_template("owner.html", stylists=Stylist.query.all())

# Renders stylist page
@app.route("/stylist-page/<stylist>")
def stylist_page(stylist):
    styl = Stylist.query.filter_by(name=stylist).first()
    return render_template("stylist.html", stylist=styl)

# Renders patron page
@app.route("/patron-page/<patron>")
def patron_page(patron):
    pat = Patron.query.filter_by(name=patron).first()
    return render_template("patron.html", patron=pat)

# Renders stylist creation page
@app.route("/stylist-creation", methods=["GET"])
def stylist_creation_page():
    return render_template("stylist_creation.html")

# Renders patron creation page which allows owner to enter username and pass
@app.route("/patron-creation", methods=["GET"])
def patron_creation_page():
    return render_template("patron_creation.html")
    
# Creates new patron account with form data provided by html request
@app.route("/create-patron-account", methods=["POST"])
def create_patron_page():
    name = request.form.get("name")
    username = request.form.get("username")
    password = request.form.get("password")

    # Create new patron and add to database
    new_patron = Patron(name, username, password)
    db.session.add(new_patron)
    db.session.commit()

    # Send back to login page
    return redirect(url_for("login_page"))

# Creates new stylist account
@app.route("/create-stylist-account", methods=["POST"])
def create_stylist_page():
    name = request.form.get("name")
    username = request.form.get("username")
    password = request.form.get("password")

    # Create new stylist and add to database
    new_stylist = Stylist(name, username, password)
    db.session.add(new_stylist)
    db.session.commit()

    # Send back to owner page
    return redirect(url_for("owner_page"))

# Renders user not found page
@app.route("/user-not-found/", methods=["GET"])
def user_not_found_page():
    return render_template("wrong_info.html")

@app.cli.command("initdb")
def initdb():
    """Creates SQLite Database"""
    db.drop_all()
    db.create_all()
    print("Database initialized.")

@app.cli.command("populatedb")
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