import os
import shutil

#FIND MINECRAFT PATH
minecraft_path = ""
addon_name = "Minespawn Addon"
local_appdata_path = os.getenv("LOCALAPPDATA")
packages_path = os.path.join(local_appdata_path, "Packages")
keyworkd_dir = "Microsoft.MinecraftUWP"

for entry in os.scandir(packages_path):
    if entry.is_dir() and keyworkd_dir in entry.name:
        minecraft_path = entry.path
        break

#FIND BP AND RP PATH
minecraft_path = minecraft_path + "\\LocalState\\games\\com.mojang\\"

rp_path = os.path.join(minecraft_path, f"development_resource_packs\\{addon_name} RP")
bp_path = os.path.join(minecraft_path, f"development_behavior_packs\\{addon_name} BP")

if os.path.exists(rp_path):
    shutil.rmtree(rp_path)
if os.path.exists(bp_path):
    shutil.rmtree(bp_path)

#COPY BP AND RP TO MINECRAFT PATH
shutil.copytree(f"{addon_name} RP", rp_path)
shutil.copytree(f"{addon_name} BP", bp_path)