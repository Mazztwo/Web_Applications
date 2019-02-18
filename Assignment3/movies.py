# Alessio Mazzone


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
    def __init__(self, title): 
        super().__init__(title)

    def Year(self, year):
        self.year = year
    
    def Director(self, director):
        self.director = director

    def Runtime(self, runtime):
        self.runtime = runtime

    def abbreviation(self):
        return "".join(super().slug().split("-"))[:3]
        

    def __repr__(self):
        return "<Movie: " + self.title + ">"

    def __str__(self):
        return "(" + str(self.year) + ") " + self.title 
    
    
test1 = Media("Don't Tell Mom the Babysitter's Dead")
test2 = Media("G.I. Joe")

print(test1.slug())
print(test2.slug())

test3 = Movie("The Lord of @!&#(*@&#)(*! the rings.")
print(test3.title)

test4 = Movie("G.I. Joe")
test4.Year(1980)
test4.Director("Charles Darwin")
test4.Runtime(14.223)

print(test4)
print(test4.abbreviation())