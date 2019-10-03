import os
os.chdir('src/assets/data')

orig = open("sentences-pinyin-on-top.txt", "r")
new = open("sentences-pinyin-accent-nospecialchar.txt","w")
longest = ""

for line in orig:
  line = line.replace("锟斤拷", "ǚ")
  # line = ''.join([i for i in line if not i.isdigit()])
  line = line.replace("，", " ")
  line = line.replace("“", "")
  line = line.replace("”", "")
  line = line.replace("?", " ")
  line = line.replace("？", " ")
  line = line.replace("，", " ")
  line = line.replace("锟", "en")
  line = line.replace("\"", " ")
  line = line.replace("《", " ")
  line = line.replace("》", " ")
  line = line.replace("\'", " ")
  line = line.replace("、", " ")
  line = line.replace("   ", " ")
  line = line.replace("  ", " ")
  new.write(line)
  for c in line.split():
    longest = longest if (max(len(longest), len(c)) == len(longest)) else c

print(longest)


