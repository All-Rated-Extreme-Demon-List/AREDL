import re
from datetime import datetime
import json

with open('name_map.json', "r", encoding='utf-8') as file:
        try:
            name_map = json.load(file)
        except ValueError as e:
            print(f"Invalid json in file name_map.json: {str(e)}")
            sys.exit(1)
            
# Step 1: Read the data from a file
input_file_path = 'raw.txt'
output_file_path = 'parsed_data.json'

with open(input_file_path, 'r') as file:
    data = file.read()

# Step 2: Split the data by date occurrences
date_pattern = re.compile(r'\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}')
sections = date_pattern.split(data)[1:]
dates = date_pattern.findall(data)

# Step 3: Parse each section
parsed_data = []
for date, section in zip(dates, sections):
    date_obj = datetime.strptime(date, '%d.%m.%Y %H:%M')
    actions = section.strip().split('\n')
    for action in actions:
        action_match = re.match(
            r'(?:Due to an update, )?(.*?) has been (re-placed|placed|raised|lowered) (?:from #(\d+) )?(?:to|at) #(\d+)(?:,(?: above (.*?) and)?(?: below (.*?))?)?(?:\.|,|$)',
            action
        )
        swap_action_match = re.match(
            r'(.*?) and (.*?) have been swapped, with (.*?) now (?:sitting )?above at #(\d+)(?:\.|,|$)',
            action
        )
        remove_action_match = re.match(
            r'(.*?) has been removed from the list(?:.*)',
            action
        )
        if action_match:
            name = action_match.group(1).lower()
            if name not in name_map:
                print(f"Unknown name {name}")
            else:
                name = name_map[name]
            
            above = action_match.group(5)
            if above is not None and above.lower() not in name_map:
                print(f"Unknown name {above.lower()}")
            else:
                above = name_map[above.lower()] if above is not None else None
            
            below = action_match.group(6)
            if below is not None and below.lower() not in name_map:
                print(f"Unknown name {below.lower()}")
            else:
                below = name_map[below.lower()] if below is not None else None
            
            action = action_match.group(2)
            if action == 're-placed':
                action = 'fromlegacy'
            
            parsed_data.append({
                'date': date_obj.strftime('%d.%m.%Y %H:%M'),
                'name': name,
                'action': action,
                'from_rank': int(action_match.group(3)) if action_match.group(3) is not None else None,
                'to_rank': int(action_match.group(4)) if action_match.group(4) is not None else None,
                'above': above,
                'below': below
            })
        elif swap_action_match:
            if swap_action_match.group(1) == swap_action_match.group(3):
                below = swap_action_match.group(2).lower()
            else:
                below = swap_action_match.group(1).lower()
            
            if below not in name_map: 
                print(f"Unknown name {below}")
            else: 
                below = name_map[below]
            
            name = swap_action_match.group(3).lower()
            if name not in name_map:
                print(f"Unknown name {name}")
            else:
                name = name_map[name]
                
            parsed_data.append({
                'date': date_obj.strftime('%d.%m.%Y %H:%M'),
                'name': name,
                'action': 'swapped',
                'from_rank': int(swap_action_match.group(4)) + 1,
                'to_rank': int(swap_action_match.group(4)),
                'above': below,
                'below': None
            })
        elif remove_action_match:
            name = remove_action_match.group(1).lower()
            if name not in name_map:
                print(f"Unknown name {name}")
            else:
                name = name_map[name]
                
            parsed_data.append({
                'date': date_obj.strftime('%d.%m.%Y %H:%M'),
                'name': name,
                'action': 'tolegacy',
                'from_rank': None,
                'to_rank': None,
                'above': None,
                'below': None
            })
        else:
            print(f"Failed to parse {action}")

# Step 4: Write the parsed data to an output JSON file
with open(output_file_path, 'w') as file:
    json.dump(parsed_data, file, indent=4)

# Print a message indicating that the data has been written
print(f"Parsed data has been written to {output_file_path}")
