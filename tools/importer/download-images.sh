#!/bin/bash
# Download images from AllianceBernstein DAM and save as media_<hash>.<ext>
# Then update the content HTML to use relative ./media_ paths

CONTENT_FILE="content/corporate/en/home.plain.html"
CONTENT_DIR="content/corporate/en"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

# Create temp dir for downloads
TMPDIR=$(mktemp -d)

# Extract unique AB image URLs
URLS=$(grep -oP 'src="(https://www\.alliancebernstein\.com[^"]+)"' "$CONTENT_FILE" | sed 's/src="//' | sed 's/"$//' | sort -u)

echo "Downloading images..."
for URL in $URLS; do
  FILENAME=$(basename "$URL" | cut -d'?' -f1)
  EXT="${FILENAME##*.}"
  EXT=$(echo "$EXT" | tr '[:upper:]' '[:lower:]')

  # Download
  TMPFILE="$TMPDIR/$FILENAME"
  echo "  Fetching: $FILENAME"
  curl -sL -A "$UA" -o "$TMPFILE" "$URL"

  if [ ! -s "$TMPFILE" ]; then
    echo "    FAILED: empty or missing"
    continue
  fi

  # Generate hash from content (first 16 chars of sha256)
  HASH=$(sha256sum "$TMPFILE" | cut -c1-16)
  MEDIA_NAME="media_${HASH}.${EXT}"

  # Copy to content directory
  cp "$TMPFILE" "$CONTENT_DIR/$MEDIA_NAME"
  SIZE=$(du -k "$TMPFILE" | cut -f1)
  echo "    Saved: $CONTENT_DIR/$MEDIA_NAME (${SIZE} KiB)"

  # Replace URL in HTML (escape special chars for sed)
  ESCAPED_URL=$(printf '%s\n' "$URL" | sed 's/[&/\]/\\&/g')
  ESCAPED_MEDIA=$(printf '%s\n' "./$MEDIA_NAME" | sed 's/[&/\]/\\&/g')
  sed -i "s|$URL|./$MEDIA_NAME|g" "$CONTENT_FILE"
done

# Cleanup
rm -rf "$TMPDIR"

echo ""
echo "Done! Verifying..."
REMAINING=$(grep -c 'alliancebernstein.com/content/dam' "$CONTENT_FILE" 2>/dev/null || echo "0")
echo "Remaining external AB DAM references: $REMAINING"
ls -la "$CONTENT_DIR"/media_* 2>/dev/null | wc -l
echo "media_ files created"
