import os
import sys
import json

def remove_records(user_name):
    
    nb_removed = 0

    current_dir = os.path.join(os.getcwd(), "data")
    list_path = os.path.join(current_dir, "_list.json")
    legacy_list_path = os.path.join(current_dir, "_legacy.json")
    name_map_path = os.path.join(current_dir, "_name_map.json")

    print(f"Looking up ID for user: {user_name}")
    try:
        with open(name_map_path, "r", encoding='utf-8') as file:
            name_map = json.load(file)
    except ValueError as e:
        print(f"Invalid json in file _name_map.json: {str(e)}")
        sys.exit(1)

    user_id = None
    for uid, uname in name_map.items():
        if uname == user_name:
            user_id = uid
            break
    
    if not user_id:
        print(f"User {user_name} not found in _name_map.json.")
        sys.exit(1)

    try:
        user_id = int(user_id)
    except ValueError as e:
        print(f"Invalid user ID {user_id} for user {user_name}: {str(e)}")
        sys.exit(1)

    print(f"- Removing records for user ID: {user_id}")

    try:
        with open(list_path, "r", encoding='utf-8') as file:
            levels = json.load(file)
    except ValueError as e:
        print(f"Invalid json in file _list.json: {str(e)}")
        sys.exit(1)
    
    try:
        with open(legacy_list_path, "r", encoding='utf-8') as file:
            legacy = json.load(file)
            levels.extend(legacy)
    except ValueError as e:
        print(f"Invalid json in file _legacy.json: {str(e)}")
        sys.exit(1)

    for filename in levels:
        file_path = os.path.join(current_dir, f"{filename}.json")
        try:
            with open(file_path, "r", encoding='utf-8') as file:
                data = json.load(file)
        except ValueError as e:
            print(f"Invalid json in file {filename}.json: {str(e)}")
            sys.exit(1)

        original_records = data['records'][:]
        data['records'] = [record for record in data['records'] if record['user'] != user_id]

        if len(data['records']) < len(original_records):
            nb_removed += len(original_records) - len(data['records'])
            try:
                with open(file_path, "w", encoding='utf-8') as file:
                    json.dump(data, file, ensure_ascii=False, indent="\t")
                    print(f"Removed record(s) for level {filename}")
            except ValueError as e:
                print(f"Failed to write json to file {filename}.json: {str(e)}")

    print(f"Successfully removed {nb_removed} records for user {user_name}")

    print(f"Removing {user_name} from the name map.")
    try:
        del name_map[str(user_id)] 
        with open(name_map_path, "w", encoding='utf-8') as file:
            json.dump(name_map, file, ensure_ascii=False, indent=4)
        print(f"Successfully removed {user_name} from the name map.")
    except KeyError:
        print(f"Failed to remove {user_name} from the name map: ID {user_id} not found.")
    except ValueError as e:
        print(f"Failed to write json to file _name_map.json: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python removeRecords.py <username>")
        sys.exit(1)

    user_name = " ".join(sys.argv[1:])

    remove_records(user_name)