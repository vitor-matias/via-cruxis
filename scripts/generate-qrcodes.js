import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';

// Base URL for the Via Cruxis application
const BASE_URL = 'https://via-sacra.acutis.pt/#/station/';
const TOTAL_STATIONS = 14;

// Output directory
const OUT_DIR = path.join(process.cwd(), 'qrcodes');
const STATIONS_DIR = path.join(process.cwd(), 'public', 'stations');

// Roman numerals for mapping
const romanNumerals = [
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII',
    'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV'
];

async function generateQRCodes() {
    // Ensure output directory exists
    if (!fs.existsSync(OUT_DIR)) {
        fs.mkdirSync(OUT_DIR, { recursive: true });
    }

    console.log(`Generating QR codes for ${TOTAL_STATIONS} stations...`);

    for (let i = 1; i <= TOTAL_STATIONS; i++) {
        const stationUrl = `${BASE_URL}${i}`;
        const romanNumeral = romanNumerals[i - 1];
        const outputFile = path.join(OUT_DIR, `estacao-${i}.svg`);

        try {
            // Generate SVG string with High error correction logic to allow for center text
            const svgString = await QRCode.toString(stationUrl, {
                type: 'svg',
                errorCorrectionLevel: 'H',
                margin: 4,
                color: {
                    dark: '#4a215c', // Slightly Darker Purple
                    light: '#ffffff'
                }
            });

            // We need to inject the text into the SVG.
            // qrcode's SVG output looks roughly like this:
            // <svg xmlns="..." viewBox="0 0 X X">
            //   <path fill="#ffffff" d="..."/>
            //   <path stroke="#000000" d="..."/>
            // </svg>

            // We will parse the viewBox to find the center
            const viewBoxMatch = svgString.match(/viewBox="0 0 (\d+) (\d+)"/);
            let width = 100, height = 100;
            if (viewBoxMatch) {
                width = parseInt(viewBoxMatch[1], 10);
                height = parseInt(viewBoxMatch[2], 10);
            }

            const cx = width / 2;
            const cy = height / 2;

            // Calculate font size & background box size based on SVG dimensions
            // The box needs to cover some code blocks in the center
            // Assuming a 29x29 or similar module matrix, a center box of ~20% width works well for 'H' level
            const boxSize = Math.max(width * 0.25, 12);
            const fontSize = boxSize * 0.5;

            // Box coords
            const boxX = cx - boxSize / 2;
            const boxY = cy - boxSize / 2;

            // Group for the injected text and its background
            // Matching the website:
            // --primary-color: #642e7c;
            // --accent-color: #a68ba3;
            // Using a simpler, cleaner design with the website's purple
            const injectedElement = `
        <g id="website-decorations">
          <!-- Outer border matching website accent line -->
          <rect x="1" y="1" width="${width - 2}" height="${height - 2}" fill="none" stroke="#a68ba3" stroke-width="1.5" rx="3" ry="3"/>
          <rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="none" stroke="#4a215c" stroke-width="0.5" rx="2" ry="2"/>
          
          <!-- Center Label -->
          <g id="center-label">
            <rect x="${boxX}" y="${boxY}" width="${boxSize}" height="${boxSize}" fill="#ffffff" stroke="#a68ba3" stroke-width="1" rx="2" ry="2"/>
            <text x="${cx}" y="${cy}" 
                  font-family="system-ui, -apple-system, sans-serif" 
                  font-weight="bold" 
                  font-size="${fontSize}px" 
                  fill="#4a215c" 
                  text-anchor="middle" 
                  dominant-baseline="central"
                  >${romanNumeral}</text>
          </g>
        </g>
      `;

            // Insert before the closing </svg> tag
            const modifiedSvg = svgString.replace('</svg>', `${injectedElement}\n</svg>`);

            fs.writeFileSync(outputFile, modifiedSvg);
            console.log(`✓ Generated ${outputFile}`);

            // -----------------------------------------------------------------
            // Generate PDF Version
            // -----------------------------------------------------------------
            const pdfOutputFile = path.join(OUT_DIR, `estacao-${i}.pdf`);
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50 // Standard margins
            });

            // Stream output to the file
            doc.pipe(fs.createWriteStream(pdfOutputFile));

            // Extract Saint Name and H2 Title from markdown file
            let saintName = "Santo Desconhecido";
            let stationTitle = `${romanNumeral} Estação`;

            try {
                const mdFilePath = path.join(STATIONS_DIR, `${i}.md`);
                if (fs.existsSync(mdFilePath)) {
                    const mdContent = fs.readFileSync(mdFilePath, 'utf8');

                    // Extract H2
                    const h2Match = mdContent.match(/^##\s+(.*)/m);
                    if (h2Match && h2Match[1]) {
                        stationTitle = h2Match[1].trim();
                    }

                    // Extract Saint
                    const match = mdContent.match(/### Meditamos com (.*)/);
                    if (match && match[1]) {
                        // Strip leading "a ", "o ", "o exemplo da " from the name
                        saintName = match[1].trim().replace(/^(o exemplo da|exemplo da|a|o|as|os)\s+/i, '');
                    }
                }
            } catch (err) {
                console.error(`Failed to read markdown for station ${i}`, err);
            }

            // QR Code dimensions and perfectly centering it on the page
            const qrSize = Math.min(doc.page.width - 100, doc.page.height - 300); // 300 max or scaled
            const finalQrSize = Math.max(qrSize, 300); // minimum 300 for visibility

            const xPos = (doc.page.width - finalQrSize) / 2;
            const yPos = (doc.page.height - finalQrSize) / 2;

            // Render SVG string onto the PDF canvas EXACTLY in the center
            SVGtoPDF(doc, modifiedSvg, xPos, yPos, {
                width: finalQrSize,
                height: finalQrSize,
                preserveAspectRatio: 'xMidYMid meet'
            });

            // Title above the QR code
            doc.font('Helvetica-Bold')
                .fontSize(32) // Slightly smaller to accommodate longer titles
                .fillColor('#4a215c') // Slightly Darker Purple
                .text(stationTitle, 40, yPos - 80, { align: 'center', width: doc.page.width - 80 });

            // Saint name below the QR code (Darkened for B&W printing)
            doc.font('Helvetica-Oblique')
                .fontSize(24)
                .fillColor('#4a215c') // Slightly Darker Purple
                .text(saintName, 0, yPos + finalQrSize + 60, { align: 'center', width: doc.page.width });

            // Finalize PDF file
            doc.end();
            console.log(`✓ Generated ${pdfOutputFile}`);


        } catch (err) {
            console.error(`X Failed to generate QR code for station ${i}:`, err);
        }
    }

    console.log('Done!');
}

generateQRCodes();
