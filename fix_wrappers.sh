#!/bin/bash

# Function to remove DocumentDashboardLayout wrapper from a file
fix_wrapper() {
    local file="$1"
    echo "Fixing wrapper in $file..."
    
    # Use sed to remove the DocumentDashboardLayout wrapper
    # This is complex because the wrapper spans multiple lines, so we'll use a more targeted approach
    
    # First, check if the file has a simple wrapper pattern
    if grep -q "<DocumentDashboardLayout" "$file" && grep -q "</DocumentDashboardLayout>" "$file"; then
        # For simple cases, replace the wrapper with just the content
        sed -i 's/<DocumentDashboardLayout[^>]*>//g' "$file"
        sed -i 's/<\/DocumentDashboardLayout>//g' "$file"
        echo "Fixed simple wrapper in $file"
    else
        echo "Complex wrapper in $file, needs manual fix"
    fi
}

# Files to fix
files=(
    "app/dashboard/businesses/page.tsx"
    "app/dashboard/events/page.tsx"
    "app/dashboard/emergency-info/page.tsx"
    "app/dashboard/weather/page.tsx"
    "app/dashboard/contacts/page.tsx"
    "app/dashboard/admin/maintenance/page.tsx"
    "app/dashboard/admin/calendar/page.tsx"
    "app/dashboard/admin/emergency-protocols/page.tsx"
    "app/dashboard/admin/rss/page.tsx"
    "app/dashboard/admin/announcements/page.tsx"
    "app/dashboard/admin/weather/page.tsx"
    "app/dashboard/admin/cameras/page.tsx"
    "app/dashboard/admin/contacts/page.tsx"
    "app/dashboard/admin/projects/page.tsx"
    "app/dashboard/admin/radio/page.tsx"
    "app/dashboard/maps/page.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        fix_wrapper "$file"
    fi
done

echo "Wrapper removal script completed."
