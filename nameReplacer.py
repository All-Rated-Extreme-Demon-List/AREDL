import os
import sys
import json
import random

current_dir = os.path.join(os.getcwd(), "data")
output_path = os.path.join(current_dir, "_name_map.json")
countries_path = os.path.join(current_dir, "_countries.json")

name_map={}
lookup_map={}

with open(output_path, 'r', encoding='utf-8') as file:
    name_map = json.load(file)

for key, value in name_map.items():
    lookup_map[value.lower()] = int(key)

id_digits = 10
id_lower = 10**(id_digits-1)
id_upper = 10**id_digits - 1

def get_id(username):
    username = username.strip()
    if username.lower() in lookup_map:
        return lookup_map[username.lower()]
        
    user_id = 0
    while user_id == 0:
        user_id = random.randint(id_lower, id_upper)
        if user_id in name_map:
            user_id = 0
            
    name_map[user_id] = username
    lookup_map[username.lower()] = user_id
    return user_id
    
def replace_users(names):
    for i in range(len(names)):
        if type(names[i]) == int:
            continue
                
        names[i] = get_id(names[i])

with open(countries_path, 'r+', encoding='utf-8') as file:
    countries = json.load(file)
    
    for country in countries:
        replace_users(country['users'])
    
    file.seek(0)
    json.dump(countries, file, ensure_ascii=False, indent="\t")
    file.truncate()

with open(os.path.join(current_dir, "_editors.json"), 'r+', encoding='utf-8') as file:
    editors = json.load(file)
    
    for editor_group in editors:
        members = editor_group['members']
        for i in range(len(members)):
            name = members[i]['name']
            if type(name) == int:
                continue
            members[i]['name'] = get_id(name)
    
    file.seek(0)
    json.dump(editors, file, ensure_ascii=False, indent="\t")
    file.truncate()
    
with open(os.path.join(current_dir, "_supporters.json"), 'r+', encoding='utf-8') as file:
    supporters = json.load(file)
    
    for editor_group in supporters:
        members = editor_group['members']
        for i in range(len(members)):
            name = members[i]['name']
            if type(name) == int:
                continue
            members[i]['name'] = get_id(name)
    
    file.seek(0)
    json.dump(supporters, file, ensure_ascii=False, indent="\t")
    file.truncate()
    
with open(os.path.join(current_dir, "_leaderboard_banned.json"), 'r+', encoding='utf-8') as file:
    banned = json.load(file)
    
    replace_users(banned)
    
    file.seek(0)
    json.dump(banned, file, ensure_ascii=False, indent="\t")
    file.truncate()
    
levels = []

with open(os.path.join(current_dir, "_list.json"), 'r', encoding='utf-8') as file:
    levels = json.load(file)
    
with open(os.path.join(current_dir, "_legacy.json"), 'r', encoding='utf-8') as file:
    levels = levels + json.load(file)
    
for level_name in levels:
    with open(os.path.join(current_dir, level_name + ".json"), 'r+', encoding='utf-8') as file:
        level = json.load(file)
        
        name = level['author']
        if type(name) != int:
            level['author'] = get_id(name)
            
        name = level['verifier']
        if type(name) != int:
            level['verifier'] = get_id(name)
        
        replace_users(level['creators'])
    
        for i in range(len(level['records'])):
            name = level['records'][i]['user']
            if type(name) == int:
                continue
            level['records'][i]['user'] = get_id(name)
    
        file.seek(0)
        json.dump(level, file, ensure_ascii=False, indent="\t")
        file.truncate()


with open(output_path, 'w+', encoding='utf-8') as file:
    json.dump(name_map, file, ensure_ascii=False, indent="\t")
    print("Written names to file")