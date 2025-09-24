#!/bin/bash

# List of files to clean up
files=(
"app/dashboard/documents/page.tsx"
"app/dashboard/emergencies/page.tsx"
"app/dashboard/emergency-info/page.tsx"
"app/dashboard/events/page.tsx"
"app/dashboard/help/page.tsx"
"app/dashboard/maps/page.tsx"
"app/dashboard/notifications/page.tsx"
"app/dashboard/payment-gated/page.tsx"
"app/dashboard/payments/page.tsx"
"app/dashboard/radio/page.tsx"
"app/dashboard/ranking/page.tsx"
"app/dashboard/revenue/page.tsx"
"app/dashboard/search/page.tsx"
"app/dashboard/settings/page.tsx"
"app/dashboard/weather/page.tsx"
"app/dashboard/cameras/[id]/page.tsx"
"app/dashboard/admin/announcements/page.tsx"
"app/dashboard/admin/contacts/page.tsx"
"app/dashboard/admin/calendar/page.tsx"
"app/dashboard/admin/cameras/page.tsx"
"app/dashboard/admin/emergency-protocols/page.tsx"
"app/dashboard/admin/maintenance/page.tsx"
"app/dashboard/admin/projects/page.tsx"
"app/dashboard/admin/radio/page.tsx"
"app/dashboard/admin/weather/page.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Cleaning $file"

        # Remove duplicate BackButton imports, keeping only the first one
        awk '
        BEGIN { seen_backbutton = 0 }
        /^import.*BackButton.*from.*back-button/ {
            if (!seen_backbutton) {
                seen_backbutton = 1
                print
            }
            next
        }
        { print }
        ' "$file" > tmp_file && mv tmp_file "$file"

        echo "  ✓ Cleaned duplicate imports"
    fi
done

echo "Done cleaning files"