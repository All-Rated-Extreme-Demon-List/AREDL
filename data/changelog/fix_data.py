import subprocess

subprocess.run(['python', './parse_raw.py'])

import json
import sys
from itertools import groupby
from datetime import datetime
from collections import OrderedDict

input_file = 'parsed_data.json'
output_file = 'changelog.json'
list_output_file = 'generated_list.json'
legacy_output_file = 'generated_legacy.json'

with open('_list_init.json', "r", encoding="utf-8") as file:
    try:
        current_list = json.load(file)
    except ValueError as e:
        print(f"Invalid json in file _list_init.json: {str(e)}")
        sys.exit(1)
      
with open('_legacy_init.json', "r", encoding="utf-8") as file:
    try:
        current_legacy_list = json.load(file)
    except ValueError as e:
        print(f"Invalid json in file _legacy_init.json: {str(e)}")
        sys.exit(1)

with open(input_file, "r", encoding="utf-8") as file:
    try:
        changelog = json.load(file)
    except ValueError as e:
        print(f"Invalid json in file {input_file}: {str(e)}")
        sys.exit(1)
        
fixed_changelog = []

# Function to convert date string to datetime object
def parse_date(date_str):
    return int(datetime.strptime(date_str, "%d.%m.%Y %H:%M").timestamp())
    
grouped_changelog = OrderedDict()
for date, items in groupby(changelog, key=lambda x: x['date']):
    grouped_changelog[parse_date(date)] = list(items)
    
aligned_changelog = []
for date, logs in grouped_changelog.items():
    sorted_changelog = sorted(logs, key=lambda x: x['to_rank'] if x['to_rank'] is not None else -1)
    
    for log in sorted_changelog:
        if log['action'] != "lowered":
            continue
            
        from_pos = log['from_rank']
        to_position = log['to_rank']
        for other in sorted_changelog:
            other_to_position = other['to_rank']
            if from_pos >= (other_to_position if other_to_position is not None else -1) or other == log:
                continue
            if to_position < other_to_position:
                break
            
            other['to_rank'] = other_to_position + 1
    
    aligned_changelog.extend(sorted_changelog)    
   
for entry in aligned_changelog:
    
    date = entry['date']
    action = entry['action']
    level = entry['name']
    to_rank = entry['to_rank']
    from_rank = entry['from_rank']
    above = entry['above']
    below = entry['below']
    
    #print(f"Level {level}")
    
    if action == "placed":
        index = to_rank - 1;
        if level in current_list:
            print(f"Level already in list for entry: {entry}")
            sys.exit(1)
            
        if len(current_list) < index:
            print(f"Level outside of placeable range [0;{len(current_list)}]: {entry}")
            sys.exit(1)
            
        current_list.insert(index, level)
    elif action == "raised" or action == "lowered":
        if current_list[from_rank - 1] != level:
            print(f"From position of level {level} at {date} is invalid, fixing")
            try:
                from_rank = current_list.index(level) + 1
            except ValueError:
                print(f"Could not find level in list")
                sys.exit(1)
                
        index = to_rank - 1;
        current_list.remove(level)
        
        current_list.insert(index, level)
    elif action == "tolegacy":
        if level not in current_list:
            print(f"Level {level} is not in current list to perform action {entry}")
            sys.exit(1)
            
        from_rank = current_list.index(level) + 1
        to_rank = len(current_list)
        current_list.remove(level)
        
        if len(current_legacy_list) != 0:
            above = current_legacy_list[0]
            
        below = current_list[-1]
        
        current_legacy_list.insert(0, level)
    elif action == "swapped":
        if level != current_list[from_rank - 1]:
            print(f"Swap action level {level} is not at position {from_rank}")
            sys.exit(1)
        if above is None:
            print(f"Invalid swap action below is not set")
            sys.exit(1)
        if above != current_list[to_rank - 1]:
            print(f"Swap action level {below} is not at position {to_rank}")
            sys.exit(1)
            
        index = to_rank - 1
        
        current_list[from_rank - 1], current_list[to_rank - 1] = current_list[to_rank - 1], current_list[from_rank - 1]
    elif action == "fromlegacy":
        if level not in current_legacy_list:
            print(f"Level {level} is not in current legacy list to perform action {entry}")
            sys.exit(1)
            
        from_rank = current_legacy_list.index(level) + 1 + len(current_list)
        current_legacy_list.remove(level)
        index = to_rank - 1
        
        current_list.insert(index, level)
        
    else:
        print(f"Unsupported action: {entry}")
        sys.exit(1) 
        
    if above is not None and above != current_list[index + 1] and action != "tolegacy":
        print(f"Level is not above {above} after entry: {entry} instead {current_list[index + 1]}")
        sys.exit(1)
    if below is not None and below != current_list[index - 1] and action != "tolegacy":
        print(f"Level is not below {below} after entry: {entry} instead {current_list[index - 1]}")
        sys.exit(1)
        
    fixed_changelog.append({
        "date": parse_date(date),
        "action": action,
        "name": level,
        "to_rank": to_rank,
        "from_rank": from_rank,
        "above": above,
        "below": below
    })
    
    
        
 
with open(list_output_file, 'w') as file:
        json.dump(current_list, file, indent=4)
        
with open(legacy_output_file, 'w') as file:
        json.dump(current_legacy_list, file, indent=4)
        
with open(output_file, 'w') as file:
        json.dump(fixed_changelog, file, indent=4) 