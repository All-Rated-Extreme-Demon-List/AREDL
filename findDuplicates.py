import os
import json

def findDuplicates():
    current_dir = os.path.join(os.getcwd(), "data")
    list_path = os.path.join(current_dir, "_list.json")
    levels = []
    with open(list_path, "r") as file:
        levels = json.load(file)
        
    for filename in levels:
        if filename.startswith("_"):
                continue
        file_path = os.path.join(current_dir, f"{filename}.json")
        lines = []
        with open(file_path, "r") as file:
            data = json.load(file)
            records = data["records"]
            names = []
            for record in records:
                name = record["user"].lower()
                if name in names:
                    print(f"Duplicate {filename}: {name}")
                    
                names.append(name)

if __name__ == "__main__":
    findDuplicates()