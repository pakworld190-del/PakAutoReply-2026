import os
import zipfile

output_zip_path = os.path.join("public", "PakAutoReply-2026.zip")

exclude_dirs = {"node_modules", ".git", ".aistudio", "dist", ".cache"}
exclude_files = {".dev.pid", ".dev.env.json", "bun.lock", "create_zip.py"}

with zipfile.ZipFile(output_zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk("."):
        # Filter directories in-place
        dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith(".aistudio")]
        
        for file in files:
            if file in exclude_files or file.endswith(".zip"):
                continue
            
            full_path = os.path.join(root, file)
            # Relative path inside zip
            rel_path = os.path.relpath(full_path, ".")
            if rel_path.startswith("public/PakAutoReply-2026.zip"):
                continue
            zipf.write(full_path, arcname=os.path.join("PakAutoReply-2026", rel_path))

print(f"Zip created successfully: {output_zip_path} ({os.path.getsize(output_zip_path)} bytes)")
