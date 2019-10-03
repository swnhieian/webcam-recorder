import os
os.chdir('src/assets/data')

orig = open("sentences.txt", "r")
characters = 0
characters += sum(len(word) - 1 for word in orig)
print(characters)

