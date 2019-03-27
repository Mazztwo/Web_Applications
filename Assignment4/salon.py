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
    appointments = db.relationship('Appointment', backref='stylist', lazy='select')

    def __init__(self, name, username, password):
        self.name = name   
        self.username = username
        self.password = password

class Patron(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    username = db.Column(db.String(80))
    password = db.Column(db.String(80))
    appointments = db.relationship('Appointment', backref='patron', lazy='select')

    def __init__(self, name, username, password):
        self.name = name   
        self.username = username
        self.password = password   

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.String(80))
    time = db.Column(db.String(80))
    stylist_id = db.Column(db.Integer, db.ForeignKey('stylist.id'))
    patron_id = db.Column(db.Integer, db.ForeignKey('patron.id'))

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
                return redirect(url_for("patron_logged_in_page", patron=temp_user.name))

        return redirect(url_for("user_not_found_page"))

# Renders owner page
@app.route("/owner-page/", methods=["GET"])
def owner_page():
    return render_template("owner.html", stylists=Stylist.query.all(), patrons=Patron.query.all())

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

# Renders book appointment page
@app.route("/book-appointment-page/<patron>-<stylist>-<day>-<time>", methods=["GET"])
def book_appointment_page(patron, stylist, day, time):
    # Send to appointment booking page
    return render_template("book_appointment.html", patron=patron, stylist=stylist, day=day, time=time)

# Renders a logged in patron's page
@app.route("/patron-logged-in-page/<patron>")
def patron_logged_in_page(patron):
    pat = Patron.query.filter_by(name=patron).first()
    stylists = Stylist.query
    return render_template("patron_logged_in.html", patron=pat, stylists=Stylist.query.all())

# Renders a stylists profile page when a patron is logged in
@app.route("/<patron>-logged-in-<stylist>-page/")
def stylist_logged_in_page(patron, stylist):
    pat = Patron.query.filter_by(name=patron).first()
    stat = Stylist.query.filter_by(name=stylist).first()
    return render_template("stylist_logged_in.html",  patron=pat, stylist=stat)

@app.cli.command("initdb")
def initdb():
    """Creates SQLite Database"""
    db.drop_all()
    db.create_all()
    print("Database initialized.")

@app.cli.command("bootstrap")
def bootstrap():
    """Populates database"""
    db.drop_all()
    db.create_all()
    print("Bootstrapping...")

    p1 = Patron("Patron1", "p1", "p1")
    p2 = Patron("Patron2", "p2", "p2")
    p3 = Patron("Patron3", "p3", "p3")
    s1 = Stylist("Stylist1", "s1", "s1")
    s2 = Stylist("Stylist2", "s2", "s2")
    a1 = Appointment(day="Thursday", time="6pm")
    a2 = Appointment(day="Tuesday", time="11am")
    a3 = Appointment(day="Saturday", time="2pm")

    db.session.add(p1)
    db.session.add(p2)
    db.session.add(p3)
    db.session.add(s1)
    db.session.add(s2)
    db.session.add(a1)
    db.session.add(a2)
    db.session.add(a3)

    s1.appointments.append(a1)  
    p1.appointments.append(a1)  
    s1.appointments.append(a2)
    p2.appointments.append(a2)
    s2.appointments.append(a3)
    p3.appointments.append(a3)
    
    db.session.commit()

    print("Done bootstrapping.")

if __name__ == "__main__":
    app.run()