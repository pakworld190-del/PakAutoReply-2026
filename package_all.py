import os
import zipfile

# 1. Create pure Android AIDE project zip
aide_zip_path = os.path.join("public", "PakAutoReply-2026-Android-AIDE.zip")
with zipfile.ZipFile(aide_zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk("android_app"):
        for file in files:
            full_path = os.path.join(root, file)
            # Make the root of the zip be the project itself (PakAutoReply-2026/...)
            rel_path = os.path.relpath(full_path, "android_app")
            zipf.write(full_path, arcname=os.path.join("PakAutoReply-2026", rel_path))

print(f"Android AIDE Zip created: {aide_zip_path} ({os.path.getsize(aide_zip_path)} bytes)")

# 2. Update the master PakAutoReply-2026.zip to include both web and android_app
master_zip_path = os.path.join("public", "PakAutoReply-2026.zip")
exclude_dirs = {"node_modules", ".git", ".aistudio", "dist", ".cache"}
exclude_files = {".dev.pid", ".dev.env.json", "bun.lock", "create_zip.py", "package_all.py"}

with zipfile.ZipFile(master_zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith(".aistudio")]
        for file in files:
            if file in exclude_files or file.endswith(".zip"):
                continue
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, ".")
            if rel_path.startswith("public/"):
                if "zip" in rel_path: continue
            zipf.write(full_path, arcname=os.path.join("PakAutoReply-2026", rel_path))

print(f"Master Zip created: {master_zip_path} ({os.path.getsize(master_zip_path)} bytes)")
