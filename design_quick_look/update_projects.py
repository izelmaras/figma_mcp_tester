#!/usr/bin/env python3
"""
Auto-update script for design_quick_look projects.
Scans for new project folders within each discipline and updates manifest.json files
"""

import os
import json
import re
from pathlib import Path

BASE_DIR = Path(__file__).parent
ASSETS_DIR = BASE_DIR / 'assets'
PROJECTS_DIR = ASSETS_DIR / 'projects'
THUMBNAILS_DIR = ASSETS_DIR / 'thubnails'

# List of disciplines
DISCIPLINES = [
    'Product Designer',
    'Brand Designer',
    'Illustrator',
    'Generative Designer',
    'Painter',
    'Immersion Designer'
]

def get_project_images(project_dir):
    """Get all image files from a project directory, excluding thumbnails."""
    images = []
    for file in sorted(project_dir.iterdir()):
        if file.is_file() and file.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.webp']:
            if 'thumbnail' not in file.name.lower():
                images.append(file.name)
    return images

def update_manifest_for_discipline(discipline):
    """Update manifest.json for a specific discipline."""
    discipline_dir = PROJECTS_DIR / discipline
    if not discipline_dir.exists():
        print(f"⚠ Discipline folder '{discipline}' does not exist, creating it...")
        discipline_dir.mkdir(parents=True, exist_ok=True)
        return {}
    
    projects = {}
    
    for project_dir in sorted(discipline_dir.iterdir()):
        if project_dir.is_dir() and not project_dir.name.startswith('.'):
            project_name = project_dir.name
            images = get_project_images(project_dir)
            projects[project_name] = images
    
    manifest_path = discipline_dir / 'manifest.json'
    with open(manifest_path, 'w') as f:
        json.dump(projects, f, indent=2)
    
    print(f"✓ Updated manifest.json for '{discipline}' with {len(projects)} projects")
    return projects

def main():
    print("Scanning for projects by discipline...")
    
    # Ensure all discipline folders exist
    for discipline in DISCIPLINES:
        discipline_dir = PROJECTS_DIR / discipline
        if not discipline_dir.exists():
            discipline_dir.mkdir(parents=True, exist_ok=True)
            print(f"✓ Created discipline folder: {discipline}")
    
    # Update manifest for each discipline
    all_projects = {}
    for discipline in DISCIPLINES:
        projects = update_manifest_for_discipline(discipline)
        all_projects[discipline] = projects
    
    total_projects = sum(len(projects) for projects in all_projects.values())
    print(f"\n✓ Done! Found {total_projects} total projects across all disciplines.")
    print("  The grid will automatically load projects based on the selected discipline.")

if __name__ == '__main__':
    main()
