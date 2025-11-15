#!/usr/bin/env python3
"""
Script to add thumbnails for all projects.
Copies existing thumbnails from project folders to the thumbnails folder,
or uses the first image from each project as a thumbnail.
"""

import json
import shutil
from pathlib import Path
from PIL import Image

BASE_DIR = Path(__file__).parent
ASSETS_DIR = BASE_DIR / 'assets'
PROJECTS_DIR = ASSETS_DIR / 'projects'
THUMBNAILS_DIR = ASSETS_DIR / 'thubnails'

DISCIPLINES = [
    'Product Designer',
    'Brand Designer',
    'Illustrator',
    'Generative Designer',
    'Painter',
    'Immersion Designer'
]

def find_thumbnail_in_project(project_dir):
    """Find thumbnail file in project directory."""
    thumbnail_patterns = [
        '*thumbnail*.png',
        '*thumbnail*.jpg',
        '*thumbnail*.jpeg',
        '*thumbnail*.gif',
        '*thumbnail*.webp'
    ]
    
    for pattern in thumbnail_patterns:
        matches = list(project_dir.glob(pattern))
        if matches:
            return matches[0]
    return None

def get_first_image(project_dir, manifest_images):
    """Get the first image from the project."""
    if not manifest_images:
        return None
    
    # Try to get the first image file
    first_image_name = manifest_images[0]
    first_image_path = project_dir / first_image_name
    
    if first_image_path.exists() and first_image_path.is_file():
        return first_image_path
    
    # If not found, try to find any image in the directory
    image_extensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    for ext in image_extensions:
        images = list(project_dir.glob(f'*{ext}'))
        if images:
            # Exclude thumbnails
            non_thumbnails = [img for img in images if 'thumbnail' not in img.name.lower()]
            if non_thumbnails:
                return non_thumbnails[0]
    
    return None

def copy_thumbnail(source, dest):
    """Copy thumbnail file to destination, converting to PNG if needed."""
    try:
        # If source is not PNG, convert it
        if source.suffix.lower() != '.png':
            try:
                img = Image.open(source)
                # Convert RGBA if needed, otherwise RGB
                if img.mode in ('RGBA', 'LA', 'P'):
                    img = img.convert('RGBA')
                else:
                    img = img.convert('RGB')
                img.save(dest, 'PNG')
                print(f"  ✓ Converted and copied: {source.name} → {dest.name}")
            except Exception as e:
                # If conversion fails, just copy the file
                shutil.copy2(source, dest)
                print(f"  ✓ Copied (no conversion): {source.name} → {dest.name}")
        else:
            shutil.copy2(source, dest)
            print(f"  ✓ Copied: {source.name} → {dest.name}")
        return True
    except Exception as e:
        print(f"  ✗ Error copying {source.name}: {e}")
        return False

def process_discipline(discipline):
    """Process all projects in a discipline."""
    discipline_dir = PROJECTS_DIR / discipline
    if not discipline_dir.exists():
        return
    
    manifest_path = discipline_dir / 'manifest.json'
    if not manifest_path.exists():
        return
    
    with open(manifest_path) as f:
        manifest = json.load(f)
    
    print(f"\nProcessing {discipline}:")
    
    for project_id, images in manifest.items():
        project_dir = discipline_dir / project_id
        if not project_dir.exists() or not project_dir.is_dir():
            continue
        
        thumbnail_dest = THUMBNAILS_DIR / f"{project_id}.png"
        
        # Skip if thumbnail already exists
        if thumbnail_dest.exists():
            print(f"  ⊙ {project_id}: thumbnail already exists")
            continue
        
        # Try to find existing thumbnail in project folder
        existing_thumbnail = find_thumbnail_in_project(project_dir)
        if existing_thumbnail:
            copy_thumbnail(existing_thumbnail, thumbnail_dest)
            continue
        
        # Try to use first image as thumbnail
        first_image = get_first_image(project_dir, images)
        if first_image:
            copy_thumbnail(first_image, thumbnail_dest)
            continue
        
        print(f"  ✗ {project_id}: no images found")

def main():
    print("Adding thumbnails for all projects...")
    print(f"Thumbnails directory: {THUMBNAILS_DIR}")
    
    # Ensure thumbnails directory exists
    THUMBNAILS_DIR.mkdir(parents=True, exist_ok=True)
    
    # Process each discipline
    for discipline in DISCIPLINES:
        process_discipline(discipline)
    
    print("\n✓ Done!")

if __name__ == '__main__':
    main()

