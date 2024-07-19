import json
import sys

input_file = 'data/_changelog.json'

level_input_file = 'data/_list_init.json'
legacy_input_file = 'data/_legacy_init.json'

list_output_file = 'data/_generated_list.json'
legacy_output_file = 'data/_generated_legacy.json'

reference_list_file = 'data/_list.json'
reference_legacy_file = 'data/_legacy.json'

do_output = False

with open(level_input_file, "r", encoding="utf-8") as file:
    try:
        current_list = json.load(file)
    except ValueError as e:
        print(f"Invalid json in file {level_input_file}: {str(e)}")
        sys.exit(1)
        
with open(legacy_input_file, "r", encoding="utf-8") as file:
    try:
        current_legacy_list = json.load(file)
    except ValueError as e:
        print(f"Invalid json in file {legacy_input_file}: {str(e)}")
        sys.exit(1)
        
with open(input_file, "r", encoding="utf-8") as file:
    try:
        changelog = json.load(file)
    except ValueError as e:
        print(f"Invalid json in file {input_file}: {str(e)}")
        sys.exit(1)
        
for entry in changelog:
    date = entry['date']
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
            
        if len(current_list) < index:
            print(f"Level outside of placeable range [0;{len(current_list)}]: {entry}")
            sys.exit(1)
            
        current_list.insert(index, level)
        
    elif action == "raised" or action == "lowered":
        index = to_rank - 1;
        if level not in current_list:
            print(f"Level not in list for entry: {entry}")
            sys.exit(1)
        
        old_pos = current_list.index(level) + 1
        if (old_pos != from_rank):
            print(f"Level old position {old_pos} does not match {from_rank} for entry {entry}")
            sys.exit(1)
            
        current_list.remove(level)
        current_list.insert(index, level)
    elif action == "swapped":
        index = to_rank - 1
        if level != current_list[from_rank - 1]:
            print(f"Level {level} is not at position {from_rank} for action {entry}")
            sys.exit(1)
        if above is None:
            print(f"Invalid swap action below is not set for action {entry}")
            sys.exit(1)
        if above != current_list[to_rank - 1]:
            print(f"Level {below} is not at position {to_rank} for action {entry}")
            sys.exit(1)
            
        current_list[from_rank - 1], current_list[to_rank - 1] = current_list[to_rank - 1], current_list[from_rank - 1]
    elif action == "tolegacy":
        if level not in current_list:
            print(f"Level {level} is not in current list to perform action {entry}")
            sys.exit(1)
            
        aligned_index = to_rank - len(current_list)
            
        current_legacy_list.insert(aligned_index, level)
        current_list.remove(level)
        
        if aligned_index == 0:
            if below is not None and below != current_list[-1]:
                print(f"Level is not below {below} after entry: {entry} instead {current_list[-1]}")
                sys.exit(1)
        else:
            if below is not None and above != current_legacy_list[aligned_index - 1]:
                print(f"Level is not below {below} after entry: {entry} instead {current_legacy_list[aligned_index - 1]}")
                sys.exit(1)
                
        if above is not None and above != current_legacy_list[aligned_index + 1]:
            print(f"Level is not above {above} after entry: {entry} instead {current_legacy_list[aligned_index + 1]}")
            sys.exit(1)
            
        continue
        
    elif action == "fromlegacy":
        index = to_rank - 1
        if level not in current_legacy_list:
            print(f"Level {level} is not in current legacy list to perform action {entry}")
            sys.exit(1)
            
        current_legacy_list.remove(level)
        current_list.insert(index, level) 
    else:
        print(f"Unsupported action: {entry}")
        sys.exit(1) 
        
    if above is not None and above != current_list[index + 1]:
        print(f"Level is not above {above} after entry: {entry} instead {current_list[index + 1]}")
        sys.exit(1)
    if below is not None and below != current_list[index - 1]:
        print(f"Level is not below {below} after entry: {entry} instead {current_list[index - 1]}")
        sys.exit(1)
        
if do_output:
    with open(list_output_file, 'w') as file:
        json.dump(current_list, file, indent=4)
        
    with open(legacy_output_file, 'w') as file:
        json.dump(current_legacy_list, file, indent=4)
    
        
with open(reference_list_file, "r", encoding="utf-8") as file:
    try:
        reference_list = json.load(file)
    except ValueError as e:
        print(f"Invalid json in file {reference_list_file}: {str(e)}")
        sys.exit(1)

with open(reference_legacy_file, "r", encoding="utf-8") as file:
    try:
        reference_legacy_list = json.load(file)
    except ValueError as e:
        print(f"Invalid json in file {reference_legacy_file}: {str(e)}")
        sys.exit(1)
        
if reference_list != current_list:
    print(f"The changelog does not generate the same list as the current one")
    sys.exit(1)
    
if reference_legacy_list != current_legacy_list:
    print(f"The changelog does not generate the same legacy list as the current one")
    sys.exit(1)
    
        
