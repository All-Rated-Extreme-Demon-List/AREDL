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


def validate_data():
    validator = URLValidator()
    current_dir = os.path.join(os.getcwd(), "data")
    list_path = os.path.join(current_dir, "_list.json")
    legacy_list_path = os.path.join(current_dir, "_legacy.json")
    had_error = False
    with open(list_path, "r") as file:
        try:
            levels = json.load(file)
            validate(instance=levels, schema=level_list_schema)
        except ValueError as e:
            print(f"Invalid json in file _list.json: {str(e)}")
            sys.exit(1)
        except exceptions.ValidationError as e:
            print(f"Validation failed for _list.json: {str(e)}")
            sys.exit(1)

    with open(legacy_list_path, "r") as file:
        try:
            legacy = json.load(file)
            validate(instance=legacy, schema=level_list_schema)
            levels.extend(legacy)
        except ValueError as e:
            print(f"Invalid json in file _legacy.json: {str(e)}")
            sys.exit(1)
        except exceptions.ValidationError as e:
            print(f"Validation failed for _legacy.json: {str(e)}")
            sys.exit(1)

    for filename in levels:
        file_path = os.path.join(current_dir, f"{filename}.json")
        try:
            with open(file_path, "r") as file:
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

                records = data["records"]
                names = [data["verifier"].lower()]
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
    validate_data()
