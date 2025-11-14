#!/usr/bin/env python3
"""
Auto-update script for design_quick_look projects.
Scans for new project folders and thumbnails, updates manifest.json and index.html
"""

import os
import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent
ASSETS_DIR = BASE_DIR / 'assets'
PROJECTS_DIR = ASSETS_DIR / 'projects'
THUMBNAILS_DIR = ASSETS_DIR / 'thubnails'
INDEX_HTML = BASE_DIR / 'index.html'
MANIFEST_JSON = PROJECTS_DIR / 'manifest.json'

def get_project_images(project_dir):
    """Get all image files from a project directory, excluding thumbnails."""
    images = []
    for file in sorted(project_dir.iterdir()):
        if file.is_file() and file.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.webp']:
            if 'thumbnail' not in file.name.lower():
                images.append(file.name)
    return images

def update_manifest():
    """Update manifest.json with all projects and their images."""
    projects = {}
    
    for project_dir in sorted(PROJECTS_DIR.iterdir()):
        if project_dir.is_dir():
            project_name = project_dir.name
            images = get_project_images(project_dir)
            projects[project_name] = images
    
    with open(MANIFEST_JSON, 'w') as f:
        json.dump(projects, f, indent=2)
    
    print(f"✓ Updated manifest.json with {len(projects)} projects")
    return projects

def get_project_name_from_folder(folder_name):
    """Convert folder name to display name."""
    # Remove leading numbers and underscores
    name = re.sub(r'^\d+_', '', folder_name)
    # Convert underscores to spaces and title case
    name = name.replace('_', ' ').title()
    return name

def find_thumbnail_for_project(project_id):
    """Find thumbnail file for a project."""
    # Try exact match first
    thumbnail_path = THUMBNAILS_DIR / f"{project_id}.png"
    if thumbnail_path.exists():
        return f"{project_id}.png"
    
    # Try with project number (handle mismatches like 014_sketches for 015_sketches)
    project_num = project_id.split('_')[0]
    project_name = '_'.join(project_id.split('_')[1:])
    
    # Try exact project name match
    for thumb_file in THUMBNAILS_DIR.glob(f"*{project_name}*.png"):
        return thumb_file.name
    
    # Try any file starting with project number
    for thumb_file in sorted(THUMBNAILS_DIR.glob(f"{project_num}_*.png")):
        return thumb_file.name
    
    # Try next number (for cases like 015_sketches using 014_sketches.png)
    try:
        next_num = str(int(project_num) - 1).zfill(3)
        for thumb_file in sorted(THUMBNAILS_DIR.glob(f"{next_num}_*.png")):
            return thumb_file.name
    except:
        pass
    
    return None

def update_html(projects):
    """Update index.html with all projects from manifest."""
    with open(INDEX_HTML, 'r') as f:
        html_content = f.read()
    
    # Extract existing grid items to preserve span classes
    span_pattern = r'<div class="grid-item item-\d+([^"]*)" data-project="([^"]+)">'
    existing_spans = {}
    for match in re.finditer(span_pattern, html_content):
        span_class = match.group(1).strip()
        project_id = match.group(2)
        existing_spans[project_id] = span_class
    
    # Generate project names mapping
    project_names = {}
    for project_id in projects.keys():
        project_names[project_id] = get_project_name_from_folder(project_id)
    
    # Generate grid items HTML
    grid_items = []
    item_num = 1
    
    for project_id in sorted(projects.keys()):
        thumbnail_file = find_thumbnail_for_project(project_id)
        if not thumbnail_file:
            print(f"⚠ Warning: No thumbnail found for {project_id}")
            continue
        
        span_class = existing_spans.get(project_id, '')
        if span_class and not span_class.startswith(' '):
            span_class = ' ' + span_class
        project_name = project_names[project_id]
        
        grid_item = f'''                    <div class="grid-item item-{item_num}{span_class}" data-project="{project_id}">
                        <img src="/design_quick_look/assets/thubnails/{thumbnail_file}" alt="{project_name}" class="grid-image">
                    </div>'''
        grid_items.append(grid_item)
        item_num += 1
    
    # Replace grid content - find the entire grid section
    grid_start = html_content.find('<div class="grid">')
    if grid_start == -1:
        print("⚠ Could not find grid in HTML")
        return
    
    # Find the closing </div> for the grid (need to count nested divs)
    pos = grid_start
    depth = 0
    grid_end = -1
    while pos < len(html_content):
        if html_content[pos:pos+11] == '<div class=':
            depth += 1
        elif html_content[pos:pos+6] == '</div>':
            depth -= 1
            if depth == 0:
                grid_end = pos + 6
                break
        pos += 1
    
    if grid_end != -1:
        new_grid_content = '                <div class="grid">\n' + '\n'.join(grid_items) + '\n                </div>'
        html_content = html_content[:grid_start] + new_grid_content + html_content[grid_end:]
    
    # Update projectNames in JavaScript
    js_project_names = '        const projectNames = {\n'
    for project_id in sorted(projects.keys()):
        project_name = project_names[project_id]
        js_project_names += f"            '{project_id}': '{project_name}',\n"
    js_project_names = js_project_names.rstrip(',\n') + '\n        };'
    
    # Replace projectNames object
    names_start = html_content.find('const projectNames = {')
    if names_start != -1:
        names_end = html_content.find('};', names_start) + 2
        html_content = html_content[:names_start] + js_project_names + html_content[names_end:]
    
    with open(INDEX_HTML, 'w') as f:
        f.write(html_content)
    
    print(f"✓ Updated index.html with {len(grid_items)} grid items")

def main():
    print("Scanning for projects...")
    projects = update_manifest()
    print("Updating HTML...")
    update_html(projects)
    print("✓ Done! Refresh your browser to see changes.")

if __name__ == '__main__':
    main()

