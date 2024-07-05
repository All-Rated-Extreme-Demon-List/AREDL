import json
import sys

input_file = 'parsed_data.json'
output_file = 'generated_list.json'

with open('name_map.json', "r", encoding='utf-8') as file:
    try:
        name_map = json.load(file)
    except ValueError as e:
        print(f"Invalid json in file name_map.json: {str(e)}")
        sys.exit(1)
            
with open('_list_init.json', "r", encoding='utf-8') as file:
    try:
        current_list = json.load(file)
    except ValueError as e:
        print(f"Invalid json in file _list_init.json: {str(e)}")
        sys.exit(1)
    
            
with open(input_file, "r", encoding='utf-8') as file:
    try:
        changelog = json.load(file)
    except ValueError as e:
        print(f"Invalid json in file {input_file}: {str(e)}")
        sys.exit(1)
            
for entry in changelog:
    with open(output_file, 'w') as file:
        json.dump(current_list, file, indent=4)
    
    action = entry['action']
    level = entry['name']
    to_rank = entry['to_rank']
    from_rank = entry['from_rank']
    above = entry['above']
    below = entry['below']
    if action == "placed":
        index = to_rank - 1;
        if level in current_list:
            print(f"Level already in list for entry: {entry}")
            sys.exit(1)
            
        current_list.insert(index, level)
        if above is not None and above != current_list[index + 1]:
            print(f"Level is not above {above} after entry: {entry}")
            sys.exit(1)
        if below is not None and below != current_list[index - 1]:
            print(f"Level is not below {below} after entry: {entry}")
            sys.exit(1)
            
    elif action == "raised" or action == "lowered":
        if current_list[from_rank - 1] != level:
            print(f"Level is not at from position (instead: {current_list[from_rank - 1]}) for entry {entry}")
        
        index = to_rank - 1;
        current_list.remove(level)
        if action == "lowered":
            index = index - 1
        
        current_list.insert(index, level)
        if above is not None and above != current_list[index + 1]:
            print(f"Level is not above {above} after entry: {entry}")
            sys.exit(1)
        if below is not None and below != current_list[index - 1]:
            print(f"Level is not below {below} after entry: {entry}")
            sys.exit(1)
        
    else:
        print(f"Unsupported action: {action}")
        sys.exit(1)