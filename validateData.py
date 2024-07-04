import os
import sys
import json
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
from jsonschema import validate, exceptions

level_list_schema = {
    "type": "array",
    "items": {
        "type": "string"
    }
}

level_schema = {
    "type": "object",
    "properties": {
        "id": {"type": "number"},
        "name": {"type": "string"},
        "author": {"type": "string"},
        "creators": {
            "type": "array",
            "items": {
                "type": "string",
            }
        },
        "verifier": {"type": "string"},
        "verification": {"type": "string"},
        "records": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "user": {"type": "string"},
                    "link": {"type": "string"},
                    "percent": {"type": "number"},
                    "hz": {"type": "number"},
                    "mobile": {"type": "boolean"}
                }
            }
        }
    }
}

pack_tiers_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "color": {"type": "string"},
            "packs": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        }
    }
}

pack_list_schema = {
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "colour": {"type": "string"},
            "packs": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        }
    }
}


def validate_data():
    validator = URLValidator()
    current_dir = os.path.join(os.getcwd(), "data")
    list_path = os.path.join(current_dir, "_list.json")
    legacy_list_path = os.path.join(current_dir, "_legacy.json")
    pack_list_path = os.path.join(current_dir, "_packlist.json")
    pack_tiers_path = os.path.join(current_dir, "_packtiers.json")
    had_error = False
    with open(list_path, "r", encoding='utf-8') as file:
        try:
            levels = json.load(file)
            validate(instance=levels, schema=level_list_schema)
        except ValueError as e:
            print(f"Invalid json in file _list.json: {str(e)}")
            sys.exit(1)
        except exceptions.ValidationError as e:
            print(f"Validation failed for _list.json: {str(e)}")
            sys.exit(1)

    with open(legacy_list_path, "r", encoding='utf-8') as file:
        try:
            legacy = json.load(file)
            validate(instance=legacy, schema=level_list_schema)
            
            level_conflicts = list(set(levels) & set(legacy))
            
            for level in level_conflicts:
                print(f"Level {level} is both in legacy and main list!")
                had_error = True
            
            levels.extend(legacy)
        except ValueError as e:
            print(f"Invalid json in file _legacy.json: {str(e)}")
            sys.exit(1)
        except exceptions.ValidationError as e:
            print(f"Validation failed for _legacy.json: {str(e)}")
            sys.exit(1)

    with open(pack_list_path, "r", encoding='utf-8') as file:
        try:
            packs = json.load(file)
            validate(instance=packs, schema=pack_list_schema)
        except ValueError as e:
            print(f"Invalid json in file _packlist.json: {str(e)}")
            sys.exit(1)
        except exceptions.ValidationError as e:
            print(f"Validation failed for _packlist.json: {str(e)}")
            sys.exit(1)
            
    with open(pack_tiers_path, "r", encoding='utf-8') as file:
        try:
            pack_tiers = json.load(file)
            validate(instance=pack_tiers, schema=pack_list_schema)
        except ValueError as e:
            print(f"Invalid json in file _packtiers.json: {str(e)}")
            sys.exit(1)
        except exceptions.ValidationError as e:
            print(f"Validation failed for _packtiers.json: {str(e)}")
            sys.exit(1)

    level_ids = {}
    for filename in levels:
        file_path = os.path.join(current_dir, f"{filename}.json")
        try:
            with open(file_path, "r", encoding='utf-8') as file:
                try:
                    data = json.load(file)
                    validate(instance=data, schema=level_schema)
                except ValueError as e:
                    print(f"Invalid json in file {filename}: {str(e)}")
                    had_error = True
                    continue
                except exceptions.ValidationError as e:
                    print(f"Validation failed for {filename}: {str(e)}")
                    had_error = True
                    continue
                    
                level_id = str(data["id"])
                
                if filename.endswith("2p"):
                    level_id += "2p"
                    
                if level_id in level_ids:
                    print(f"Duplicate gd level id in file {filename} with previous file {level_ids[level_id]}")
                    had_error = True
                    
                level_ids[level_id] = filename

                records = data["records"]
                names = [data["verifier"].lower()]
                try:
                    validator(data["verification"])
                except ValidationError:
                    had_error = True
                    print(f"Invalid verification Url: {filename}: {data['verification']}")

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

                if "" in names:
                    had_error = True
                    print(f"Empty username in {filename}")

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
            
    pack_names = []    
    for pack in packs:
        if pack["name"] in pack_names:
            had_error = True
            print(f"Duplicate pack name: \"{pack['name']}\"")
            continue
            
        pack_names.append(pack["name"])
        for level in pack["levels"]:
            if level not in levels:
                had_error = True
                print(f"Unkown level {level} in Pack \"{pack['name']}\"")
                
    pack_names_used = []
    for tier in pack_tiers:
        for pack in tier["packs"]:
            if pack not in pack_names:
                had_error = True
                print(f"Unkown pack \"{pack}\" in pack-tier \"{tier['name']}\"")
            if pack in pack_names_used:
                had_error = True
                print(f"Pack \"{pack}\" was already used in another pack-tier than \"{tier['name']}\"")
            pack_names_used.append(pack)
            
    pack_names_unused = list(set(pack_names) - set(pack_names_used))
    for pack in pack_names_unused:
        had_error = True
        print(f"Pack \"{pack}\" is not assigned to a tier")
                
    if had_error:
        sys.exit(1)


if __name__ == "__main__":
    validate_data()
