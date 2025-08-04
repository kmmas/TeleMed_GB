import os
from pathlib import Path

list_of_files = [
     "src/main.py",
     "src/helper.py",
     "src/prompt.py",
     ".env",
     "setup.py",
     "research/tChatbot.ipynb",
     "app.py",
     "vectorstore.py",
     "static",
]

for file in list_of_files:
    path = Path(file)
    folder_name, file_name = os.path.split(file)
    if folder_name:
        os.makedirs(folder_name, exist_ok=True)
    if (not os.path.exists(path)) or (os.path.getsize(file_name) == 0):
        with open(path, "w") as f:
            pass
