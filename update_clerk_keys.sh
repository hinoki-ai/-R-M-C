#!/bin/bash

if [ $# -ne 2 ]; then
    echo "❌ Usage: $0 'pk_live_xxx' 'sk_live_xxx'"
    echo "Example: $0 'pk_live_your_key_here' 'sk_live_your_secret_here'"
    exit 1
fi

PK_KEY="$1"
SK_KEY="$2"

echo "🔄 Updating Clerk keys in .env files..."

update_file() {
  local file="$1"
  if [ -f "$file" ]; then
    echo "  • $file"
    # Replace any existing value (test or live) robustly
    if grep -q '^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=' "$file"; then
      sed -i "s|^NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=.*|NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$PK_KEY|" "$file"
    else
      echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$PK_KEY" >> "$file"
    fi
    if grep -q '^CLERK_SECRET_KEY=' "$file"; then
      sed -i "s|^CLERK_SECRET_KEY=.*|CLERK_SECRET_KEY=$SK_KEY|" "$file"
    else
      echo "CLERK_SECRET_KEY=$SK_KEY" >> "$file"
    fi
  fi
}

update_file .env.local
update_file .env.production

echo "✅ Clerk keys updated."
echo "ℹ️  Ensure your Content-Security-Policy allows your Clerk domain and that Vercel env vars match."
