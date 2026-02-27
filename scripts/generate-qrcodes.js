import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
import PptxGenJS from 'pptxgenjs';

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

    // Initialize PPTX presentation
    const pres = new PptxGenJS();
    pres.layout = 'LAYOUT_16x9';

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

            // PPTX SVG renderer ignores dominant-baseline, manually calculate vertical center offset
            const textY = cy + (fontSize * 0.37);

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
            <text x="${cx}" y="${textY}" 
                  font-family="Arial, Helvetica, sans-serif" 
                  font-weight="bold" 
                  font-size="${fontSize}px" 
                  fill="#4a215c" 
                  text-anchor="middle" 
                  >${romanNumeral}</text>
          </g>
        </g>
      `;

            // Insert before the closing </svg> tag, and set explicit high-res width/height for PowerPoint compatibility
            // We also add stroke-width="1.05" to the QR code path to prevent PowerPoint's subpixel white-gap rendering bugs between modules
            const modifiedSvg = svgString
                .replace('<svg ', '<svg width="2000" height="2000" ')
                .replace('<path stroke="#4a215c" d="', '<path stroke="#4a215c" stroke-width="1.05" d="')
                .replace('</svg>', `${injectedElement}\n</svg>`);

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
            const pdfQrSize = Math.min(doc.page.width - 100, doc.page.height - 300); // 300 max or scaled
            const finalQrSize = Math.max(pdfQrSize, 300); // minimum 300 for visibility

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
            doc.font('Helvetica-BoldOblique')
                .fontSize(28)
                .fillColor('#4a215c') // Slightly Darker Purple
                .text(saintName, 0, yPos + finalQrSize + 60, { align: 'center', width: doc.page.width });

            // Finalize PDF file
            doc.end();
            console.log(`✓ Generated ${pdfOutputFile}`);

            // -----------------------------------------------------------------
            // Add to PPTX Presentation
            // -----------------------------------------------------------------
            const slide = pres.addSlide();

            // LAYOUT_16x9 is 10 x 5.625 inches
            const slideWidth = 10;

            // Title
            slide.addText(stationTitle, {
                x: 0, y: 0.3, w: '100%', h: 0.8,
                align: 'center',
                fontSize: 36,
                bold: true,
                color: '4a215c'
            });

            // QR Code dimensions
            const pptxQrSize = 3.5;
            const pptxQrX = (slideWidth - pptxQrSize) / 2;
            const pptxQrY = 1.2;

            slide.addImage({
                path: outputFile,
                x: pptxQrX, y: pptxQrY, w: pptxQrSize, h: pptxQrSize
            });

            // Saint Name
            slide.addText(saintName, {
                x: 0, y: pptxQrY + pptxQrSize + 0.1, w: '100%', h: 0.8,
                align: 'center',
                fontSize: 28,
                italic: true,
                color: '4a215c'
            });

        } catch (err) {
            console.error(`X Failed to generate QR code for station ${i}:`, err);
        }
    }

    // Save PPTX presentation
    const pptxFile = path.join(OUT_DIR, 'via-sacra-qrcodes.pptx');
    await pres.writeFile({ fileName: pptxFile });
    console.log(`✓ Generated PPTX presentation: ${pptxFile}`);

    console.log('Done!');
}

generateQRCodes();
