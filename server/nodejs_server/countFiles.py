from pathlib import Path
import sys

webcamIds = [
    '53e6d1ce5c5155d.webm',
    '8199fe2c373a8d4.webm',
    'b2a6f55d31cda49.webm',
    'bcb109e5b537b4b.webm',
    'bebf6b071073727.webm',
    'd2f9c06f0fd3c97.webm',
    'e202102a3710910.webm',
    'f80598a32e03e00.webm'
]
if __name__ == '__main__':
    dirName = sys.argv[1]
    p = Path(dirName)
    dirs = list(p.glob('*'))
    maxIndex = max(map(lambda x: int(x.name), dirs))
    for i in range(maxIndex + 1):
        subdir = p / str(i)
        if subdir.exists():
            files = list(subdir.glob('*.webm'))
            fileNames = list(map(lambda x:x.name, files))
            if (len(files) != 8):
                print(f"{i} sentence not full")
                for webcam in webcamIds:
                    if webcam not in fileNames:
                        print(f"\t: {webcam} not saved!")
        else:
            print(f"{i} sentence not exists")