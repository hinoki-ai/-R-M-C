#!/bin/bash

# Script to add withErrorHandling wrapper to Convex functions properly

echo "Adding error handling to Convex functions..."

# Find all Convex files with function definitions but without withErrorHandling
files_to_update=$(find convex -name "*.ts" -exec grep -l "export.*=.*query\|export.*=.*mutation\|export.*=.*action" {} \; | grep -v "_generated" | xargs grep -L "withErrorHandling")

for file in $files_to_update; do
    echo "Processing $file..."

    # Check if the file already imports withErrorHandling
    if ! grep -q "withErrorHandling" "$file"; then
        # Add withErrorHandling to the import from utils/error_handler
        if grep -q "from './utils/error_handler'" "$file"; then
            # File already imports from error_handler, add withErrorHandling
            sed -i "s/from '\.\/utils\/error_handler'/&, withErrorHandling/" "$file"
        else
            # File doesn't import from error_handler, add the full import
            # Find a good place to add the import (after other imports)
            sed -i "1a import { withErrorHandling } from './utils/error_handler';" "$file"
        fi
    fi

    # Use a more precise sed command to replace only the handler assignment
    # Look for patterns like: handler: async (ctx, args) =>
    # And replace with: handler: withErrorHandling(async (ctx, args) =>
    sed -i 's/handler: async \?(/handler: withErrorHandling(async (/g' "$file"

    echo "Updated $file"
done

echo "Error handling added to all Convex functions!"