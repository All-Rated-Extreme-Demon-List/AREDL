import os
import sys
import json

with open('../_list.json', 'r') as file:
    try:
        levels = json.load(file)
    except ValueError as e:
        print(f"Invalid json in file _list.json: {str(e)}")
        sys.exit(1)
        
with open('../_legacy.json', 'r') as file:
    try:
        legacy = json.load(file)
        levels = levels + legacy
    except ValueError as e:
        print(f"Invalid json in file _legacy.json: {str(e)}")
        sys.exit(1)
        
name_map = {}

for filename in levels:
    with open(f'../{filename}.json', 'r', encoding='utf-8') as file:
        try:
            data = json.load(file)
            name_map[data['name'].lower()] = filename
        except ValueError as e:
            print(f"Invalid json in file {filename}: {str(e)}")
            sys.exit(1)
            
with open('name_map.json', 'w') as file:
    json.dump(name_map, file, indent=4)