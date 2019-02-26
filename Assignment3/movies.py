# Alessio Mazzone

# Global movies list
movies = []

class Media:
    # Media class constructor
    def __init__(self, title):
        self.title = title

    # Returns the title in lower case title stripped of all
    # special characters and spaces replaced with '-'
    def slug(self):

        # Split title by space
        # Remove special characters
        # Join words with dashes

        words = self.title.split()

        for i in range(0,len(words)):
            word = words[i]
            word = ''.join(filter(str.isalnum, word))
            words[i] = word.lower()

        return '-'.join(words)

class Movie(Media):
    def __init__(self, title, year, director, runtime): 
        super().__init__(title)
        self.year = year
        self.director = director
        self.runtime = runtime
                
    def abbreviation(self):
        return "".join(super().slug().split("-"))[:3]
        
    def __repr__(self):
        return "<Movie: " + self.title + ">"

    def __str__(self):
        return "(" + str(self.year) + ") " + self.title 
   
   #


# Define a decorator to use on slugs(), abbr(), and before_year():
# Decorator should take an argument of msg
# Prints "=====\n%s\n=====" % msg
# Add decorator to functions named above, and pass in an appropriate heading message for each function.
def decor(msg):
    def wrap(func):
        def inner(*args, **kwargs):
            try:
                print("=====\n%s %s\n=====" % (msg, args[0]))
            except:
                print("=====\n%s\n=====" % msg)
            func(*args, **kwargs)
        return inner
    return wrap

# Uses a list comprehension to print() each Movie slug.
@decor("SLUGS")
def slugs():
    [print(mov.slug()) for mov in movies]

# Uses a list comprehension to print() each Movie abbreviation.
@decor("ABBREVIATIONS")
def abbr():
    [print(mov.abbreviation()) for mov in movies]

# Define a before_year() function that takes an int 
# parameter as a year and uses a list comprehension to 
# print() each Movie object if the movie was released 
# before a specified year.
@decor("BEFORE YEAR")
def before_year(year):
    [print(mov) for mov in movies if mov.year < year]

def main():

    print("Thanks for checking the Local Movie Database!")
    slugs()
    abbr()
    before_year(1995)
    print("Thank you")

if __name__ == '__main__':

    # Add five Movie objects to movies list
    movies.append(Movie("Don't Tell Mom the Babysitter's Dead", 2018, "John Mink", 114.4))
    movies.append(Movie("G.I. Joe", 1962, "Harry Mujin", 121.3))
    movies.append(Movie("The Lord of @!&#(*@&#)(*! The Rings.", 2001, "John Marx", 206.4))
    movies.append(Movie("Blade Runner", 1985, "Binny Lupo", 102.2))
    movies.append(Movie("Spider Man and the Lost Arc", 1994, "Peter Pukar", 111.1))

    # Execute main
    main()