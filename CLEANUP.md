# ⚠️ CLEANUP INSTRUCTIONS

## Files to Remove (Old Duplicates)

These old root-level files/folders are now duplicated in the new structure and should be deleted:

### Folders to Delete:
```
aqweather/           → Now in backend/aqweather/
weather/             → Now in backend/weather/
static/              → Now in frontend/static/
templates/           → Now in frontend/templates/
```

### Files to Delete:
```
manage.py            → Now in backend/manage.py
db.sqlite3           → If not needed, keep only in backend/
```

## How to Clean Up

### Using PowerShell (Windows):
```powershell
cd d:\Project1\aqweather

# Remove old folders
Remove-Item -Recurse -Force aqweather
Remove-Item -Recurse -Force weather
Remove-Item -Recurse -Force static
Remove-Item -Recurse -Force templates

# Remove old files
Remove-Item manage.py
```

### Using Git Commands:
```bash
cd d:\Project1\aqweather

# Remove from git tracking (but keep locally first to verify)
git rm --cached -r aqweather/
git rm --cached -r weather/
git rm --cached -r static/
git rm --cached -r templates/
git rm --cached manage.py

# Then delete the actual files
# (or use the PowerShell commands above)

# Commit changes
git add .gitignore
git commit -m "Remove duplicate files and add .gitignore"
git push
```

## What Will Be Ignored by Git

After cleanup, these files/folders will NOT be tracked by Git:
- ✅ `.env` (API keys and secrets)
- ✅ `__pycache__/` (Python cache)
- ✅ `.venv/` / `venv/` (Virtual environment)
- ✅ `db.sqlite3` (Database)
- ✅ `.vscode/` (IDE settings)
- ✅ `*.pyc` (Compiled Python files)
- ✅ All other temporary and security-sensitive files

## Verify Your Final Structure

After cleanup, your root should only contain:
```
aqweather/
├── .env                    ← NOT tracked by git
├── .gitignore             ← Track this
├── backend/               ← Track this
├── frontend/              ← Track this
├── requirements.txt       ← Track this
├── README.md              ← Track this
├── PROJECT_STRUCTURE.md   ← Track this
└── .git/
```

✅ Done! Clean project structure ready for deployment.
