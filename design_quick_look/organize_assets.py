#!/usr/bin/env python3
"""
Script to organize project assets into subfolders with consistent naming.
Creates an 'assets' folder in each project and renames files to asset_001.png, asset_002.png, etc.
"""

import json
import shutil
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).parent
ASSETS_DIR = BASE_DIR / 'assets'
PROJECTS_DIR = ASSETS_DIR / 'projects'

DISCIPLINES = [
    'Product Designer',
    'Brand Designer',
    'Illustrator',
    'Generative Designer',
    'Painter',
    'Immersion Designer'
]

def organize_project_assets(project_dir):
    """Organize assets in a project folder into an 'assets' subfolder with consistent naming."""
    if not project_dir.exists() or not project_dir.is_dir():
        return []
    
    # Create assets folder
    assets_dir = project_dir / 'assets'
    assets_dir.mkdir(exist_ok=True)
    
    # Find all image files (excluding thumbnails and description files)
    image_extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    image_files = []
    
    for file in project_dir.iterdir():
        if file.is_file():
            # Skip thumbnails, descriptions, and other text files
            if file.suffix.lower() in image_extensions:
                if 'thumbnail' not in file.name.lower():
                    image_files.append(file)
    
    # Sort files by name for consistent ordering
    image_files.sort(key=lambda x: x.name.lower())
    
    # Rename and move files
    renamed_files = []
    counter = 1
    
    for old_file in image_files:
        # Determine extension
        ext = old_file.suffix.lower()
        
        # Create new name: asset_001.png, asset_002.png, etc.
        new_name = f"asset_{counter:03d}{ext}"
        new_path = assets_dir / new_name
        
        # Move and rename
        if old_file != new_path:
            shutil.move(str(old_file), str(new_path))
            renamed_files.append(new_name)
            print(f"  ✓ {old_file.name} → assets/{new_name}")
        else:
            renamed_files.append(new_name)
        
        counter += 1
    
    return renamed_files

def update_manifest_for_discipline(discipline):
    """Update manifest.json for a specific discipline after reorganization."""
    discipline_dir = PROJECTS_DIR / discipline
    if not discipline_dir.exists():
        return {}
    
    projects = {}
    
    for project_dir in sorted(discipline_dir.iterdir()):
        if project_dir.is_dir() and not project_dir.name.startswith('.'):
            project_name = project_dir.name
            assets_dir = project_dir / 'assets'
            
            if assets_dir.exists():
                # Get all image files from assets folder
                images = []
                for file in sorted(assets_dir.iterdir()):
                    if file.is_file() and file.suffix.lower() in ['.png', '.jpg', '.jpeg', '.gif', '.webp']:
                        # Store with 'assets/' prefix for manifest
                        images.append(f"assets/{file.name}")
                projects[project_name] = images
    
    manifest_path = discipline_dir / 'manifest.json'
    with open(manifest_path, 'w') as f:
        json.dump(projects, f, indent=2)
    
    return projects

def main():
    print("Organizing project assets...")
    print("=" * 60)
    
    total_moved = 0
    
    for discipline in DISCIPLINES:
        discipline_dir = PROJECTS_DIR / discipline
        if not discipline_dir.exists():
            continue
        
        print(f"\nProcessing {discipline}:")
        print("-" * 60)
        
        for project_dir in sorted(discipline_dir.iterdir()):
            if project_dir.is_dir() and not project_dir.name.startswith('.'):
                print(f"\n{project_dir.name}:")
                renamed = organize_project_assets(project_dir)
                total_moved += len(renamed)
                if not renamed:
                    print("  (no assets to organize)")
        
        # Update manifest after organizing
        update_manifest_for_discipline(discipline)
        print(f"\n✓ Updated manifest.json for '{discipline}'")
    
    print("\n" + "=" * 60)
    print(f"✓ Done! Organized {total_moved} assets across all projects.")
    print("  All assets are now in 'assets' folders with consistent naming (asset_001.png, etc.)")

if __name__ == '__main__':
    main()

