const fs = require('fs');
const path = require('path');

const stationsDir = 'public/stations';
const files = fs.readdirSync(stationsDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
    const filePath = path.join(stationsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to find the split header caused by previous error
    // Captures: 1=HeaderStart, 2=ImageTag, 3=HeaderRest
    // We handle both Markdown ![]() and HTML <img ...>
    // Regex explanation:
    // (###\s*\(?Meditamos): Group 1, matches start of header
    // \s*(?:\r?\n)+\s*: Matches newline(s) and whitespace
    // (!\[.*?\]\(.*?\)|<img.*?>): Group 2, Matches image (MD or HTML)
    // ([^\r\n]*): Group 3, Matches rest of the line (text after image)
    const splitRegex = /(###\s*\(?Meditamos)\s*(?:\r?\n)+\s*(!\[.*?\]\(.*?\)|<img.*?>)\s*([^\r\n]*)/;

    const match = content.match(splitRegex);

    if (match) {
        let headerStart = match[1]; // e.g. "### Meditamos"
        let imageTag = match[2];    // e.g. "<img ...>" or "![](...)"
        let headerRest = match[3];  // e.g. " com Santa Maria Goretti"

        // Check if image is HTML and convert to Markdown
        if (imageTag.startsWith('<img')) {
            // Extract src
            const srcMatch = imageTag.match(/src=["'](.*?)["']/);
            // Extract alt
            const altMatch = imageTag.match(/alt=["'](.*?)["']/);

            if (srcMatch) {
                const src = srcMatch[1];
                const alt = altMatch ? altMatch[1] : 'Station Image';
                imageTag = '![' + alt + '](' + src + ')';
            }
        }

        // Reconstruct: HeaderStart + HeaderRest
        let fullHeader = (headerStart + headerRest).trim();

        // Ensure formatting is clean
        const fixedSection = fullHeader + '\n\n' + imageTag;

        // Replace the split section with the fixed section
        // Use replace with string not regex to avoid issues with special chars in match[0] if present?
        // But match[0] comes from regex match, so it should be fine.
        // However, if match[0] contains special regex chars, string replacement is safer.
        content = content.replace(match[0], fixedSection);

        fs.writeFileSync(filePath, content);
        console.log('Repaired ' + file);
    } else {
        // If not split, check if we need to convert HTML img to Markdown anyway
        // For 1.md or manual edits that might not match the split regex exactly
        const htmlImgRegex = /<img.*?>/;
        const imgMatch = content.match(htmlImgRegex);
        if (imgMatch) {
            let imageTag = imgMatch[0];
            const srcMatch = imageTag.match(/src=["'](.*?)["']/);
            const altMatch = imageTag.match(/alt=["'](.*?)["']/);

            if (srcMatch) {
                const src = srcMatch[1];
                const alt = altMatch ? altMatch[1] : 'Station Image';
                const mdImage = '![' + alt + '](' + src + ')';
                content = content.replace(imageTag, mdImage);
                fs.writeFileSync(filePath, content);
                console.log('Converted HTML image in ' + file);
            }
        } else {
            console.log('No split pattern or HTML image found in ' + file);
        }
    }
});
