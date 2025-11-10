#!/usr/bin/env python3
"""
Script to create a GIF from Goyard images 3-8
"""

from PIL import Image
import os

# Paths
project_dir = "/Users/caterinatahan/Documents/GitHub/StePez"
images_dir = os.path.join(project_dir, "images/projects/Goyard")
output_path = os.path.join(images_dir, "Goyard_animated.gif")

# Image files to include (3-8)
image_files = [
    "Goyard_3.png",
    "Goyard_4.png",
    "Goyard_5.png",
    "Goyard_6.png",
    "Goyard_7.png",
    "Goyard_8.png"
]

# Load images
images = []
for filename in image_files:
    filepath = os.path.join(images_dir, filename)
    if os.path.exists(filepath):
        img = Image.open(filepath)
        images.append(img)
        print(f"Loaded: {filename}")
    else:
        print(f"Warning: {filename} not found")

if images:
    # Save as GIF
    # duration is in milliseconds (1000ms = 1 second per frame)
    images[0].save(
        output_path,
        save_all=True,
        append_images=images[1:],
        duration=800,  # 800ms per frame
        loop=0  # 0 means loop forever
    )
    print(f"\nGIF created successfully: {output_path}")
    print(f"Total frames: {len(images)}")
else:
    print("No images found to create GIF")
