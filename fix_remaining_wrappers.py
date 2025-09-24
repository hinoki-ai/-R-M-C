#!/usr/bin/env python3
import os
import re

files_to_fix = [
    "app/dashboard/weather/page.tsx",
    "app/dashboard/admin/calendar/page.tsx",
    "app/dashboard/admin/emergency-protocols/page.tsx",
    "app/dashboard/admin/rss/page.tsx",
    "app/dashboard/admin/announcements/page.tsx",
    "app/dashboard/admin/weather/page.tsx",
    "app/dashboard/admin/cameras/page.tsx",
    "app/dashboard/admin/contacts/page.tsx",
    "app/dashboard/admin/radio/page.tsx"
]

for file_path in files_to_fix:
    if os.path.exists(file_path):
        print(f"Fixing {file_path}...")
        
        with open(file_path, 'r') as f:
            content = f.read()
        
        # Replace the opening DocumentDashboardLayout tag with <>
        content = re.sub(
            r'<DocumentDashboardLayout\s+[^>]*>',
            '<>',
            content,
            flags=re.MULTILINE | re.DOTALL
        )
        
        # Replace the closing DocumentDashboardLayout tag with </>
        content = re.sub(
            r'</DocumentDashboardLayout>',
            '</>',
            content
        )
        
        with open(file_path, 'w') as f:
            f.write(content)
        
        print(f"Fixed {file_path}")

print("All remaining wrappers fixed!")
