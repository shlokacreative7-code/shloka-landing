#!/bin/sh
# Downloads the static font instances the logos are drawn from (both SIL Open Font License).
# Google Fonts serves TTF to non-browser user agents.
set -e
mkdir -p fonts
for spec in "Fraunces:opsz,wght@72,600" "Fraunces:opsz,wght@72,400" "Manrope:wght@800"; do
  url=$(curl -s -A "Wget/1.0" "https://fonts.googleapis.com/css2?family=$spec" | grep -o 'https://[^)]*\.ttf' | head -1)
  name="$(echo "$spec" | tr ':,@' '___').ttf"
  curl -s -o "fonts/$name" "$url"
  echo "fonts/$name"
done
