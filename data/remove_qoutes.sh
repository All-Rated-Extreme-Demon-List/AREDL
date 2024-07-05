#!/bin/bash

for file in *.json; do
    sed -E 's/"hz": "([0-9]+)"/"hz": \1/g' "$file" > "$file.tmp" && mv -f "$file.tmp" "$file"
done