import os
import sys
import json
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError

def validateData():
    validator = URLValidator()
    current_dir = os.path.join(os.getcwd(), "data")
    list_path = os.path.join(current_dir, "_list.json")
    legacy_list_path = os.path.join(current_dir, "_legacy.json")
    levels = []
    had_error = False
    with open(list_path, "r") as file:
        try:
            levels = json.load(file)
        except ValueError as e:
            print(f"Invalid json in file _list.json: {str(e)}")
            sys.exit(1)
        
    with open(legacy_list_path, "r") as file:
        try:
            legacy = json.load(file)
            levels.extend(legacy)
        except ValueError as e:
            print(f"Invalid json in file _legacy.json: {str(e)}")
            sys.exit(1)
        
    for filename in levels:
        file_path = os.path.join(current_dir, f"{filename}.json")
        lines = []
        try:
            with open(file_path, "r") as file:
                data = []
                try:
                    data = json.load(file)
                except ValueError as e:
                    print(f"Invalid json in file {filename}: {str(e)}")
                    had_error = True
                    continue
                
                records = data["records"]
                names = []
                try:
                    validator(data["verification"])
                except ValidationError:
                    had_error = True
                    print(f"Invalid verification Url: {filename}: {url}")
                    
                for record in records:
                
                    name = record["user"].lower()
                    if name in names:
                        had_error = True
                        print(f"Duplicate Record: {filename}: {name}")
                    
                    names.append(name)
                    url = record["link"]
                    try:
                        validator(url)
                    except ValidationError:
                        had_error = True
                        print(f"Invalid Url: {filename} {name}: {url}")
                    
                creators = []
                for creator in data["creators"]:
                    if creator in creators:
                        had_error = True
                        print(f"Duplicate Creator: {filename}: {creator}")
                    
                    if "," in creator:
                        had_error = True
                        print(f"Invalid Creator: {filename}: {creator}")
                    creators.append(creator)
        except FileNotFoundError:
            had_error = True
            print(f"Missing file {filename}")
                
    if had_error:
        sys.exit(1)

if __name__ == "__main__":
    validateData()
