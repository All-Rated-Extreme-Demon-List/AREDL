import os
import sys
import json

def remove_records(user):
    print(f"Removing records for user: {user}")

    nb_removed = 0

    current_dir = os.path.join(os.getcwd(), "data")
    list_path = os.path.join(current_dir, "_list.json")
    legacy_list_path = os.path.join(current_dir, "_legacy.json")

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
        data['records'] = [record for record in data['records'] if record['user'] != user]

        if len(data['records']) < len(original_records):
            nb_removed += len(original_records) - len(data['records'])
            try:
                with open(file_path, "w", encoding='utf-8') as file:
                    json.dump(data, file, ensure_ascii=False, indent="\t")
                    print(f"Removed record(s) for level {filename}")
            except ValueError as e:
                print(f"Failed to write json to file {filename}.json: {str(e)}")

    print(f"Successfully removed {nb_removed} records for user {user}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python removeRecords.py <username>")
        sys.exit(1)

    remove_records(sys.argv[1])
