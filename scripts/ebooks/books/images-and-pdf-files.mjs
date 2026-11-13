// Practice material for "Images and PDF Files".
// Sizes are worked out from the formulas in the book. Portal limits differ;
// the figures used here are examples, and readers are told to check the notice.

const px = (cm, dpi) => Math.round((cm / 2.54) * dpi);
const mb = (w, h) => ((w * h * 3) / 1024 / 1024).toFixed(1);

const book = {
  checked: "October 2026",
  welcome:
    "This book is about the image and PDF jobs that fill ordinary days: shrinking a photo to fit an exam portal, turning phone photos of a document into one clean PDF, merging and splitting files for an office, and sending pictures that look right on every screen. It explains just enough about pixels, formats and pages to make those jobs predictable, then works through many real cases. The site's tools do the processing in your browser, so your files stay on your device.",

  chapters: [
    {
      title: "Four numbers that describe an image",
      paragraphs: [
        "Almost every question about an image can be answered with four numbers: its width and height in pixels, its file size in kilobytes, and, for printing, its resolution in dots per inch. Knowing which number a form or a printer is asking for removes most of the confusion.",
      ],
      sections: [
        {
          heading: "Pixels",
          paragraphs: [
            "A digital image is a grid of coloured dots called pixels. A phone photo of 4000 by 3000 pixels has 12 million of them, which is what '12 megapixels' means. Width and height in pixels decide how much detail the image can show and how large it can be displayed or printed before it looks soft.",
          ],
        },
        {
          heading: "File size",
          paragraphs: [
            `File size is how much storage the image takes. Without compression, each pixel needs about three bytes, one each for red, green and blue, so a 4000 by 3000 photo would take about ${mb(4000, 3000)} MB. A JPG of the same photo is usually 2 to 5 MB because JPG compression discards detail the eye barely notices.`,
            "Pixels and file size are related but not the same. Two images with the same pixels can differ greatly in file size depending on format, quality setting and content: a photo of a plain wall compresses far better than a photo of leaves.",
          ],
        },
        {
          heading: "DPI",
          paragraphs: [
            "Dots per inch only matters when an image is printed or when a form specifies a size in centimetres. It says how many pixels go into each inch of paper. The number of pixels needed is the printed size in inches multiplied by the DPI.",
          ],
          codes: [{
            caption: "Pixels for a printed size.",
            code: [
              "pixels = (size in cm / 2.54) x DPI",
              "",
              `3.5 cm at 300 DPI = ${px(3.5, 300)} px`,
              `4.5 cm at 300 DPI = ${px(4.5, 300)} px`,
              `A4 (21 x 29.7 cm) at 300 DPI = ${px(21, 300)} x ${px(29.7, 300)} px`,
              `A4 at 150 DPI = ${px(21, 150)} x ${px(29.7, 150)} px`,
            ].join("\n"),
          }],
        },
        {
          heading: "Which number is the form asking for?",
          table: {
            caption: "Common requirements and what they mean.",
            headers: ["Requirement", "What it controls", "Tool"],
            widths: [2, 2, 1.6],
            rows: [
              ["'Photo must be 20 to 50 KB'", "File size", "Image compressor"],
              ["'200 x 230 pixels'", "Pixel dimensions", "Image resizer"],
              ["'3.5 cm x 4.5 cm'", "Printed size; needs pixels at a DPI", "Resizer in cm"],
              ["'JPG only'", "Format", "Format converter"],
              ["'PDF under 2 MB'", "File size of the PDF", "Compress PDF"],
            ],
          },
        },
      ],
    },
    {
      title: "Formats and when to use each",
      paragraphs: [
        "The format decides how an image is stored and what it can do. Choosing the right one is often the easiest way to make a file smaller or sharper.",
      ],
      sections: [
        {
          table: {
            caption: "The four formats you will meet most.",
            headers: ["Format", "Best for", "Transparency", "Notes"],
            widths: [1, 2, 1.2, 2.4],
            rows: [
              ["JPG", "Photos", "No", "Lossy; small files; quality setting matters"],
              ["PNG", "Screenshots, logos, text", "Yes", "Lossless; large for photos"],
              ["WebP", "Web images of all kinds", "Yes", "Smaller than JPG and PNG at similar quality"],
              ["HEIC", "iPhone photos", "Yes", "Efficient but not accepted by many portals"],
            ],
          },
        },
        {
          heading: "Lossy and lossless",
          paragraphs: [
            "Lossy formats such as JPG throw away some detail to save space; each time a JPG is edited and saved again, a little more is lost. Lossless formats such as PNG keep every pixel exactly. For photos, a JPG at 75 to 85 percent quality usually looks the same as the original at a fraction of the size. For screenshots of text, PNG keeps letters crisp where JPG makes them fuzzy.",
          ],
        },
        {
          heading: "Transparency",
          paragraphs: [
            "PNG and WebP can have transparent areas, which logos need so they sit on any background. JPG cannot; converting a transparent PNG to JPG fills the transparent areas with a colour. The site's format converter lets you choose that colour, usually white.",
          ],
        },
        {
          heading: "HEIC from iPhones",
          paragraphs: [
            "iPhones save photos as HEIC by default. Many government and exam portals accept only JPG. Safari can open HEIC directly and the format converter can then save a JPG; other browsers often cannot read HEIC. On the iPhone you can also set Camera, Formats, to Most Compatible so new photos are saved as JPG.",
          ],
        },
      ],
    },
    {
      title: "Making an image smaller",
      paragraphs: [
        "There are three ways to make an image file smaller: reduce the pixels, lower the quality, or change the format. They work best in that order of thought, because reducing pixels you do not need costs nothing visible.",
      ],
      sections: [
        {
          heading: "Reduce the pixels first",
          paragraphs: [
            "A 4000-pixel-wide phone photo shown on a website at 800 pixels wide carries 25 times more pixels than are seen. Resizing it to 1600 pixels wide, enough for sharp display on high-density screens, cuts the file to roughly a sixth with no visible loss. The compressor's 'Max width' setting does this in the same step.",
          ],
        },
        {
          heading: "Then the quality",
          paragraphs: [
            "Lowering JPG quality from 100 to 80 percent often halves the file size with little visible change. Below about 60 percent, blocky patches and colour bands start to show, especially in skies and skin. Look at the result at full size before using it.",
          ],
        },
        {
          heading: "Or aim for a size in KB",
          paragraphs: [
            "Forms often give a maximum file size. The compressor's target size setting tries lower quality levels, and if needed smaller dimensions, until the file fits. Leave some margin: if the limit is 50 KB, aim for 45 KB, because some portals count a kilobyte as 1000 bytes and others as 1024.",
          ],
        },
        {
          heading: "Too small can also be rejected",
          paragraphs: [
            "Many portals set a minimum as well as a maximum, such as 20 to 50 KB. An image compressed to 8 KB may be refused, or may be accepted but look blurred to the person checking it. If a file is below the minimum, use a higher quality setting or larger dimensions.",
          ],
        },
      ],
    },
    {
      title: "Photos and signatures for forms",
      paragraphs: [
        "Exam, job and government forms are the most common reason people need image tools in India. The notices are specific, and portals reject files that miss them by a few kilobytes or pixels. Always read the current notice for your form; the figures in this chapter are examples, not rules.",
      ],
      sections: [
        {
          heading: "Reading the notice",
          bullets: [
            "Dimensions: in pixels, such as 200 x 230, or in centimetres, such as 3.5 x 4.5 cm.",
            "File size: a range, such as 20 to 50 KB for a photo and 10 to 20 KB for a signature.",
            "Format: usually JPG or JPEG, which are the same thing.",
            "Background: often plain white or light.",
            "Face: often a set share of the photo, ears visible, no cap or dark glasses.",
            "Date: some notices require the photo to be recent, sometimes with the date and name printed below.",
          ],
        },
        {
          heading: "A dependable order of work",
          steps: [
            "Take the photo in daylight against a plain light wall, camera at eye level.",
            "Crop to the required shape with the image cropper; the 35 x 45 mm ratio matches the common Indian passport-photo shape.",
            "Resize to the exact pixels with the image resizer, or use the 'Indian passport / exam photo 3.5 x 4.5 cm' preset, which gives 413 x 531 pixels.",
            "Compress to the file-size range with the compressor's target size.",
            "Open the final file and check it: face clear, nothing cut off, size in range.",
          ],
        },
        {
          heading: "Signatures",
          paragraphs: [
            "Sign with a black pen on plain white paper, in a box a little larger than the required shape. Photograph it in good light from directly above to avoid a slanted signature. Crop tightly, resize to the required pixels, and compress. If the background looks grey, increase brightness slightly before compressing, or use the compressor's black-and-white option where one is offered.",
          ],
        },
        {
          heading: "Passport and visa sizes",
          paragraphs: [
            "Indian passport and many exam photos use 3.5 x 4.5 cm. The United States uses 2 x 2 inches, which is 600 x 600 pixels at 300 DPI; the site's resizer has a separate preset for it. Other countries have their own sizes. Mixing them up is a common reason for rejection, so match the preset to the country of the document.",
          ],
        },
      ],
    },
    {
      title: "Building a clean PDF from photos",
      paragraphs: [
        "Turning phone photos of pages into one PDF is a daily task: marksheets for an admission, bills for a reimbursement, an ID for a bank. A little care in taking the photos saves most of the editing.",
      ],
      sections: [
        {
          heading: "Taking the photos",
          bullets: [
            "Place the page on a dark, plain surface so its edges are clear.",
            "Use daylight from a window, not a flash, to avoid glare.",
            "Hold the phone flat above the page, parallel to it.",
            "Fill the frame with the page, leaving a small border.",
            "Take one photo per page and check each for blur before moving on.",
          ],
        },
        {
          heading: "Putting them together",
          steps: [
            "Crop each photo to the page edges.",
            "Rotate any page that is sideways.",
            "Open JPG to PDF, add the images in page order, and choose A4 portrait with a small margin.",
            "Create the PDF and open it to check the order and that every page is readable.",
            "If the file is too large for the portal, run it through Compress PDF.",
          ],
        },
        {
          heading: "Page size choices",
          paragraphs: [
            "A4 portrait suits most documents in India. 'Same as image' makes each page exactly the size of its photo, which is useful for posters and screenshots but gives uneven pages for documents. US Letter is slightly wider and shorter than A4 and is used in North America.",
          ],
        },
        {
          heading: "One file or several?",
          paragraphs: [
            "Read what the portal asks for. Some want one PDF with all documents; others want a separate file for each, with set names. When sending by email, one PDF per document with a clear file name, such as 'Anita-Sharma-Class12-Marksheet.pdf', is easier for the recipient than a single file of mixed documents.",
          ],
        },
      ],
    },
    {
      title: "Merging, splitting and arranging PDFs",
      paragraphs: [
        "PDF tools mostly move pages around: join files, take some pages out, rotate, reorder. These operations copy pages as they are, so text stays selectable and quality does not change.",
      ],
      sections: [
        {
          heading: "Merge",
          paragraphs: [
            "Merging joins several PDFs into one, in the order you set. Use it to combine an application form with its supporting documents, or monthly statements into one annual file. Check the order before saving; the merged file follows the list exactly.",
          ],
        },
        {
          heading: "Split",
          paragraphs: [
            "Splitting takes pages out. The page box accepts ranges such as '1-3, 5, 8-10'. You can save all selected pages in one PDF, one PDF per range, or every page as its own file. A common use is taking two pages from a long bank statement to submit as proof of address.",
          ],
          codes: [{
            caption: "Range examples for a 12-page file.",
            code: ["1-3        pages 1, 2, 3", "5          page 5 only", "8-10       pages 8, 9, 10", "1-3, 5     pages 1, 2, 3, 5", "10-        pages 10 to the end (10, 11, 12)"].join("\n"),
          }],
        },
        {
          heading: "Rotate and reorder",
          paragraphs: [
            "Rotation fixes pages scanned sideways or upside down; you can rotate all pages, odd or even pages, or a list. Reordering lets you drag pages into a new sequence, which fixes a stack scanned in the wrong order without rescanning.",
          ],
        },
        {
          heading: "Password-protected PDFs",
          paragraphs: [
            "Bank statements and some official PDFs are encrypted with a password. The site's tools cannot open them while encrypted. Open the file in a PDF reader with the password and use its print or save option to create an unprotected copy, if you are entitled to do so, then work on that copy. Keep the protected original.",
          ],
        },
      ],
    },
    {
      title: "Making a PDF smaller",
      paragraphs: [
        "Portals and email limit PDF size. Scanned documents and PDFs made from phone photos are usually large because each page is a full-resolution photo.",
      ],
      sections: [
        {
          heading: "How the site's compressor works",
          paragraphs: [
            "Compress PDF redraws each page as an optimised image at the resolution and quality you choose: high quality at 150 DPI, balanced at 110 DPI, smallest at 80 DPI, or a target size in KB. This shrinks scanned and photo-heavy PDFs dramatically. The catch is that text in the result is no longer selectable or searchable, so keep the original for editing and use the compressed copy for uploads.",
          ],
        },
        {
          heading: "Black and white",
          paragraphs: [
            "For scanned text documents, the black-and-white option removes colour information and often halves the size again. It is not suitable for photographs, coloured stamps or documents where the colour of a signature or seal matters.",
          ],
        },
        {
          heading: "When compression is the wrong tool",
          paragraphs: [
            "A PDF exported from a word processor with selectable text is usually already small. If it is large, the cause is often embedded high-resolution images; resizing those images in the original document and exporting again gives a smaller file that keeps selectable text. Compressing it as images would make it larger or less useful.",
          ],
        },
        {
          heading: "Check readability",
          paragraphs: [
            "After compressing, open the file and zoom to 100 percent on the smallest text, such as figures in a marksheet table or the fine print on a bill. If it is hard to read, choose a higher quality level. A file that fits the limit but cannot be read will be rejected by the person checking it.",
          ],
        },
      ],
    },
    {
      title: "Privacy and safety with images and PDFs",
      paragraphs: [
        "Images and documents often carry more information than you mean to share.",
      ],
      sections: [
        {
          heading: "Location in photos",
          paragraphs: [
            "Phone photos usually store EXIF data: the date, the camera model and often the exact GPS location. Sharing an original photo of your home can reveal where you live. Re-saving an image through the site's tools usually removes this data, because the browser's canvas does not copy it. Many social apps also remove it, but email and file-sharing services usually send the original.",
          ],
        },
        {
          heading: "Redacting in PDFs",
          paragraphs: [
            "Drawing a black box over text in some PDF editors only covers it; the text underneath can still be copied. To remove information properly, use a tool with a real redaction feature, or convert the page to an image after covering the text. Check by trying to select and copy the covered area.",
          ],
        },
        {
          heading: "Masking ID numbers",
          paragraphs: [
            "When you must share a copy of an ID, share only what the recipient needs. UIDAI offers a masked Aadhaar that shows only the last four digits of the number, which is accepted for many purposes. Writing the purpose and date across a photocopy, such as 'For KYC at XYZ Bank only, 20 Oct 2026', reduces the risk of it being reused.",
          ],
        },
        {
          heading: "Where files are processed",
          paragraphs: [
            "Many online tools upload your file to a server. The site's image and PDF tools run in your browser, so the files do not leave your device. Whatever tool you use, think twice before uploading ID documents, statements or medical records to a service you do not know.",
          ],
        },
      ],
    },
    {
      title: "Images for screens and social media",
      paragraphs: [
        "Every platform crops and compresses images in its own way. Uploading at the size it expects gives you control over how the result looks.",
      ],
      sections: [
        {
          table: {
            caption: "Common sizes in pixels. Platforms change these from time to time.",
            headers: ["Use", "Size", "Shape"],
            widths: [2.4, 1.6, 1],
            rows: [
              ["Instagram square post", "1080 x 1080", "1:1"],
              ["Instagram portrait post", "1080 x 1350", "4:5"],
              ["Stories, Reels, WhatsApp status", "1080 x 1920", "9:16"],
              ["YouTube thumbnail", "1280 x 720", "16:9"],
              ["Link preview (Open Graph)", "1200 x 630", "about 1.9:1"],
              ["WhatsApp profile photo", "640 x 640", "1:1, shown in a circle"],
            ],
          },
        },
        {
          heading: "Crop or fit?",
          paragraphs: [
            "When the photo's shape differs from the target, you can crop to fill, which cuts off edges, or fit the whole image with a background, which adds bars. The social media resizer also offers a blurred copy of the image as the background, which looks better than plain bars for photos. Move the crop position so faces and text are not cut.",
          ],
        },
        {
          heading: "Safe areas",
          paragraphs: [
            "Profile photos are shown in circles, and stories have buttons and text over the top and bottom. Keep important content in the central area, away from edges, so it survives cropping and overlays.",
          ],
        },
        {
          heading: "Why platforms make photos look worse",
          paragraphs: [
            "Platforms recompress uploads to save space. Uploading at exactly the expected size, as a good-quality JPG, gives their compressor less to do and usually a better result. WhatsApp compresses photos sent normally; sending as a document, or using its HD option, keeps more quality.",
          ],
        },
      ],
    },
    {
      title: "Images on websites",
      paragraphs: [
        "Images are usually the largest part of a web page. Heavy images make pages slow, especially on mobile data, and slow pages lose visitors and rank lower in search.",
      ],
      sections: [
        {
          heading: "Size for the display",
          paragraphs: [
            "Find the largest width the image is shown at, double it for high-density screens, and resize to that. A blog image shown 800 pixels wide needs about 1600 pixels, not the camera's 4000. Save photos as WebP or JPG at about 75 to 80 percent quality.",
          ],
        },
        {
          heading: "Targets",
          bullets: [
            "Large banner or hero image: aim for under 200 KB.",
            "Content images: aim for under 100 KB each.",
            "Thumbnails and icons: a few KB to 20 KB.",
            "Logos: SVG where possible, otherwise PNG or WebP.",
          ],
        },
        {
          heading: "Alt text",
          paragraphs: [
            "Every meaningful image on a web page needs alt text: a short description read aloud by screen readers and shown if the image fails to load. Describe what the image shows and why it is there, such as 'Bar chart: sales rose from 40 to 65 lakh between 2024 and 2026'. Decorative images can have empty alt text so screen readers skip them.",
          ],
        },
        {
          heading: "Favicons",
          paragraphs: [
            "The small icon in a browser tab is the favicon. Start with a square image of at least 512 x 512 pixels; the favicon generator produces the sizes browsers and phones ask for, including a 180 x 180 icon for Apple devices, with the tags for the page's head.",
          ],
        },
      ],
    },
  ],

  scenarioIntro:
    "Real jobs, mostly from forms, offices and small businesses, with the mistake that caused trouble and the fix that worked.",

  scenarios: [
    {
      title: "The 52 KB photo",
      paragraphs: [
        "Pooja in Patna was filling an exam application that asked for a photo of 20 to 50 KB. Her phone photo was 3.2 MB. She used an app that reduced it to 52 KB, and the portal rejected it without explanation, simply saying 'Invalid file'.",
        "She opened the site's compressor and set the target size to 45 KB, leaving a margin below the limit. The result was 44 KB. The portal accepted it at once.",
        "She later read that some portals count a kilobyte as 1000 bytes rather than 1024, so a file shown as 49 KB on her computer might count as just over 50 KB to the portal. Aiming a few kilobytes under the limit avoids the problem entirely, whichever way the portal counts.",
      ],
      lesson: "Aim a few kilobytes below a file-size limit. Portals differ in how they count kilobytes.",
    },
    {
      title: "A photo too small to be seen",
      paragraphs: [
        "Arjun in Lucknow compressed his application photo to 9 KB to be safe, well under the 50 KB maximum. The portal accepted it, but a month later he received an email saying his photo was unclear and he must upload a new one before the admit card could be issued.",
        "The notice had said 20 to 50 KB. The portal had not enforced the minimum, but the people checking the photos had. His 9 KB image was so compressed that his face was blocky.",
        "He redid it at 40 KB with the correct pixel size, and the face was clear. He realised that a range in a notice exists for a reason at both ends: the minimum protects legibility just as the maximum protects storage.",
      ],
      lesson: "Respect the minimum file size too. Over-compressed photos can be rejected by the person checking.",
    },
    {
      title: "Centimetres, not pixels",
      paragraphs: [
        "Sneha in Bhopal needed a photo of 3.5 x 4.5 cm for a passport application form she would print. She resized her photo to 35 x 45 pixels, thinking the numbers matched. Printed, it was a tiny, blurred square.",
        `A size in centimetres needs a resolution to turn into pixels. At 300 DPI, which print shops use for photos, 3.5 x 4.5 cm is ${px(3.5, 300)} x ${px(4.5, 300)} pixels. She used the resizer's Indian passport preset, which gives exactly that.`,
        "The printed photo was sharp. She noted that the resizer's centimetre option asks for a DPI for this reason: without it, centimetres cannot be turned into pixels.",
      ],
      lesson: "Sizes in centimetres need a DPI. At 300 DPI, 3.5 x 4.5 cm is 413 x 531 pixels.",
    },
    {
      title: "The wrong passport preset",
      paragraphs: [
        "Ritu in Gurugram needed photos for two applications: an Indian passport renewal and a US visa. She used a square passport preset for both. The Indian application was returned asking for a 3.5 x 4.5 cm photo.",
        "The square size, 2 x 2 inches, is the US standard. India uses a taller rectangle. The site's resizer lists both, labelled by country, so she made a second version with the Indian preset.",
        "She now names her files with the country and size, such as 'ritu-photo-IN-35x45.jpg' and 'ritu-photo-US-2x2.jpg', so she does not upload the wrong one later.",
      ],
      lesson: "Photo sizes differ by country. Match the preset to the country issuing the document.",
    },
    {
      title: "Marksheets with glare",
      paragraphs: [
        "Kiran in Mysuru photographed his marksheets for a college admission under a ceiling light. Two pages had a white patch of glare over the marks table, and the admissions office asked for clearer copies.",
        "He retook the photos near a window in daylight, with the phone held flat above each page and the flash off. The glare disappeared. He cropped each photo to the page edges, combined them with JPG to PDF on A4 with a small margin, and the file was clear at full zoom.",
        "His new routine takes ten minutes for five pages and has not been questioned since. The light was the whole difference; no editing could recover marks hidden under glare.",
      ],
      lesson: "Photograph documents in soft daylight, with the phone parallel to the page and the flash off.",
    },
    {
      title: "A PDF that was too big to email",
      paragraphs: [
        "Leela, an accountant in Kochi, needed to email twelve scanned invoices to an auditor. The merged PDF was 38 MB, larger than her email service allowed.",
        "She ran it through Compress PDF on the balanced setting. It came out at 3.1 MB. She opened it and checked the smallest figures on each invoice at full zoom; they were clear.",
        "She kept the original 38 MB file in her records, because the compressed copy's text could no longer be selected or searched, and sent the small one. The auditor never noticed any difference.",
      ],
      lesson: "Compress scanned PDFs for sending, check the smallest text, and keep the original.",
    },
    {
      title: "Compressing a PDF that did not need it",
      paragraphs: [
        "Manoj in Nagpur exported a 40-page report from a word processor. It was 6 MB, and he compressed it to 2 MB to send to a client. The client complained that they could not search the report or copy figures from it.",
        "Compression had turned every page into an image. The 6 MB had come from four large photos in the report. Manoj resized those photos in the original document to the width they were displayed at and exported again. The new PDF was 1.4 MB, with all text selectable.",
        "He learned to ask why a PDF is large before compressing it. For documents with real text, the fix is usually in the source file, not in the PDF.",
      ],
      lesson: "For text documents, shrink the images in the source and export again, rather than compressing the PDF to images.",
    },
    {
      title: "Two pages from a bank statement",
      paragraphs: [
        "Farah in Hyderabad needed to submit proof of address from her bank statement, a 14-page password-protected PDF. The site's split tool could not open it.",
        "She opened the statement in her PDF reader with the password and saved an unprotected copy. In the split tool, she entered '1' for the page with her address and '14' for the last page with the bank's seal, chose 'All selected pages in one PDF', and saved a two-page file.",
        "She deleted the unprotected 14-page copy afterwards, keeping the original protected file. Sharing only the pages needed kept her transaction details private.",
      ],
      lesson: "Share only the pages needed. Remove a password only to work on a copy, then delete it.",
    },
    {
      title: "A scan in the wrong order",
      paragraphs: [
        "A school office in Indore scanned a 30-page admission file through a feeder, and the pages came out in reverse order with three pages upside down.",
        "Instead of rescanning, the clerk opened the file in Reorder PDF pages, reversed the order, then used Rotate PDF on the three page numbers with 180 degrees. The whole job took four minutes.",
        "Because reordering and rotation copy pages without re-encoding them, the text from the scanner's recognition stayed searchable and the quality was unchanged.",
      ],
      lesson: "Fix order and rotation in the PDF tools rather than rescanning. Pages keep their quality.",
    },
    {
      title: "Location in a sale listing",
      paragraphs: [
        "Ajay in Pune listed a used bicycle on a classifieds site, uploading photos straight from his phone through a web form. A friend pointed out that the original photos contained GPS coordinates of his building.",
        "Some sites remove this data on upload; this one, it turned out, offered the original files for download. Ajay replaced the photos with copies he had passed through the image compressor, which drops the location data when it re-saves the image.",
        "He now resizes and compresses photos before sharing them publicly, which makes them smaller and removes location data in one step.",
      ],
      lesson: "Photos can contain your location. Re-save them before posting publicly.",
    },
    {
      title: "A logo with a black background",
      paragraphs: [
        "Divya, who runs a home bakery in Chennai, converted her transparent PNG logo to JPG to meet a marketplace's upload rule. The logo appeared on a black square.",
        "JPG cannot store transparency, and her previous tool had filled the transparent area with black. In the site's format converter she chose white as the background colour for transparent areas and converted again.",
        "The logo now sat on white, matching the marketplace's white pages. For her own website she kept the PNG, so the logo could sit on any background colour.",
      ],
      lesson: "Converting transparent images to JPG fills the transparency with a colour. Choose it deliberately.",
    },
    {
      title: "A blog that loaded slowly",
      paragraphs: [
        "A travel blogger in Shimla noticed her pages took several seconds to load on mobile data. Each post had ten photos straight from the camera, about 5 MB each.",
        "She batch-processed the photos in the compressor with a maximum width of 1600 pixels, WebP format and 75 percent quality. Each photo fell to about 180 KB. A post that had weighed 50 MB now weighed under 2 MB.",
        "Her pages loaded in about a second, and her analytics showed readers staying longer. The photos looked the same on phones and laptops.",
      ],
      lesson: "Resize web images to about twice their display width and save as WebP or JPG at 75 to 80 percent quality.",
    },
    {
      title: "An Instagram post with a cut-off face",
      paragraphs: [
        "Rohit, a photographer in Jaipur, posted a landscape group photo as a square. Instagram cropped the sides, cutting off two people at the edges.",
        "He used the social media resizer with the 4:5 portrait size and the 'fit with blurred background' option. The whole group stayed in the picture with a soft blurred band above and below.",
        "For the next shoot he framed with the final shape in mind, leaving space around the group, so he could crop to 4:5 without losing anyone.",
      ],
      lesson: "When the photo and the platform differ in shape, fit with a background or plan the crop when shooting.",
    },
    {
      title: "A signature that looked grey",
      paragraphs: [
        "Mohan in Varanasi photographed his signature under a yellow bulb. The paper looked grey-brown and the signature faint, and the job portal's reviewer asked for a clearer one.",
        "He signed again with a black gel pen, photographed it near a window, cropped tightly, and resized to the required 140 x 60 pixels. The paper was white and the signature dark.",
        "He compressed it to 15 KB, inside the 10 to 20 KB range. The reviewer accepted it the same day.",
      ],
      lesson: "Sign in black on white paper and photograph in daylight; poor light makes signatures faint.",
    },
    {
      title: "A covered account number that was not covered",
      paragraphs: [
        "Sunita in Delhi sent a landlord a PDF of a bank letter with her account number covered by a black rectangle drawn in a PDF editor. The landlord mentioned, innocently, that he could read the number when he copied the text.",
        "The rectangle had only been drawn on top. The text underneath was still there. She made a new copy by printing the page to an image-based PDF after covering the number, then checked by trying to select the area.",
        "Now she tests every redaction by trying to copy the hidden text before sending. If anything copies, the redaction failed.",
      ],
      lesson: "A box drawn over text in a PDF may not remove it. Test by trying to copy the covered text.",
    },
    {
      title: "Merging in the wrong order",
      paragraphs: [
        "Prakash in Ranchi merged his application form, ID, certificates and fee receipt into one PDF for a government job. The checker asked him to resubmit because the fee receipt, which the notice said must be the first page, was on the last.",
        "He opened the merge tool again, added the files with the receipt first, followed by the form and the rest in the order the notice listed, and checked the page order before saving.",
        "He now copies the notice's document list into a note and ticks off each item in the merged PDF before uploading.",
      ],
      lesson: "Follow the notice's document order exactly, and check the merged file before uploading.",
    },
    {
      title: "An iPhone photo the portal could not read",
      paragraphs: [
        "Megha in Bengaluru tried to upload a photo from her iPhone to a scholarship portal. The file picker would not show it, because the portal accepted only JPG and her photo was HEIC.",
        "She opened the photo in Safari on her iPhone and used the site's format converter to save a JPG, then resized and compressed it to the portal's limits.",
        "She also changed her camera setting to Most Compatible, so later photos for forms are saved as JPG from the start.",
      ],
      lesson: "Convert HEIC to JPG for portals, or set the iPhone camera to Most Compatible.",
    },
    {
      title: "A poster that printed blurred",
      paragraphs: [
        "A college club in Pune designed an A3 event poster at 1080 x 1527 pixels, the size they used for Instagram. Printed at A3, it was visibly soft.",
        `A3 is 29.7 x 42 cm. At 300 DPI it needs about ${px(29.7, 300)} x ${px(42, 300)} pixels; at 150 DPI, which is acceptable for posters seen from a distance, about ${px(29.7, 150)} x ${px(42, 150)}. Their file had under half the pixels needed even at 150 DPI.`,
        "They rebuilt the poster at print size and exported a smaller copy for Instagram. Starting at the larger size and reducing is always better than enlarging later, which cannot add detail.",
      ],
      lesson: "Design print work at print resolution and make smaller copies for screens; enlarging cannot add detail.",
    },
  ],

  problemIntro:
    "Work each problem before reading the working. Sizes are computed with the formula pixels = (cm / 2.54) x DPI, rounded to whole pixels.",

  problems: [
    {
      title: "Pixels for a photo size",
      q: ["How many pixels are needed for a 3.5 x 4.5 cm photo at 300 DPI?"],
      steps: ["3.5 / 2.54 x 300", "4.5 / 2.54 x 300"],
      answer: `${px(3.5, 300)} x ${px(4.5, 300)} pixels.`,
    },
    {
      title: "Pixels at 200 DPI",
      q: ["A form asks for a 3.5 x 4.5 cm photo at 200 DPI. What pixel size is that?"],
      steps: ["3.5 / 2.54 x 200", "4.5 / 2.54 x 200"],
      answer: `${px(3.5, 200)} x ${px(4.5, 200)} pixels.`,
    },
    {
      title: "US photo",
      q: ["A 2 x 2 inch photo at 300 DPI is how many pixels?"],
      steps: ["2 inches x 300 dots per inch on each side."],
      answer: "600 x 600 pixels.",
    },
    {
      title: "A4 at 300 DPI",
      q: ["How many pixels does an A4 page (21 x 29.7 cm) need at 300 DPI?"],
      steps: ["21 / 2.54 x 300", "29.7 / 2.54 x 300"],
      answer: `${px(21, 300)} x ${px(29.7, 300)} pixels.`,
    },
    {
      title: "A4 at 150 DPI",
      q: ["And at 150 DPI?"],
      steps: ["Half of each 300 DPI figure, rounded."],
      answer: `${px(21, 150)} x ${px(29.7, 150)} pixels.`,
    },
    {
      title: "Printed size from pixels",
      q: ["A photo is 1200 x 1800 pixels. How large can it print at 300 DPI, in cm?"],
      steps: ["1200 / 300 = 4 inches = 10.16 cm", "1800 / 300 = 6 inches = 15.24 cm"],
      answer: "About 10.2 x 15.2 cm, a standard 4 x 6 inch print.",
    },
    {
      title: "Uncompressed size",
      q: ["How much memory does a 4000 x 3000 image take uncompressed at 3 bytes per pixel?"],
      steps: ["4000 x 3000 = 12,000,000 pixels", "x 3 bytes = 36,000,000 bytes", "/ 1024 / 1024"],
      answer: `About ${mb(4000, 3000)} MB.`,
    },
    {
      title: "Megapixels",
      q: ["A camera produces 6000 x 4000 pixel images. How many megapixels is that?"],
      steps: ["6000 x 4000 = 24,000,000."],
      answer: "24 megapixels.",
    },
    {
      title: "Pixel saving by resizing",
      q: ["A photo 4000 pixels wide is resized to 1600 pixels wide, keeping the shape. By what factor does the pixel count fall?"],
      steps: ["Width ratio 4000 / 1600 = 2.5", "Both dimensions shrink, so pixels fall by 2.5 x 2.5"],
      answer: "6.25 times fewer pixels.",
    },
    {
      title: "Kilobytes two ways",
      q: ["A file is 51,000 bytes. Is it under a 50 KB limit?"],
      steps: ["51,000 / 1024 = 49.8 KB (binary)", "51,000 / 1000 = 51 KB (decimal)"],
      answer: "It depends how the portal counts: 49.8 KB in binary units, 51 KB in decimal. Aim for under 49,000 bytes to be safe either way.",
    },
    {
      title: "Within range",
      q: ["A notice says photo 20 to 50 KB, signature 10 to 20 KB. Your photo is 18 KB and signature 22 KB. What do you change?"],
      steps: ["Photo below minimum: raise quality or size.", "Signature above maximum: lower quality or size."],
      answer: "Recompress the photo at a higher quality to about 30 to 45 KB, and the signature at a lower quality to about 15 KB.",
    },
    {
      title: "Aspect ratio",
      q: ["Is a 1080 x 1350 image the same shape as 4:5?"],
      steps: ["1080 / 1350 = 0.8", "4 / 5 = 0.8"],
      answer: "Yes, both are 0.8.",
    },
    {
      title: "Height from width",
      q: ["You resize a 4000 x 3000 photo to 1200 pixels wide, keeping the shape. What is the height?"],
      steps: ["3000 / 4000 = 0.75", "1200 x 0.75"],
      answer: "900 pixels.",
    },
    {
      title: "Crop to 16:9",
      q: ["What is the largest 16:9 crop from a 4000 x 3000 photo?"],
      steps: ["Keep full width 4000; height = 4000 x 9 / 16 = 2250, which fits within 3000."],
      answer: "4000 x 2250 pixels.",
    },
    {
      title: "Crop to 1:1",
      q: ["What is the largest square crop from a 4000 x 3000 photo?"],
      steps: ["The smaller side limits a square."],
      answer: "3000 x 3000 pixels.",
    },
    {
      title: "Split ranges",
      q: ["From a 20-page PDF you need pages 1, 2, 3, 7 and 15 to 20. Write the range."],
      steps: ["Group consecutive pages."],
      answer: "'1-3, 7, 15-20' (or '1-3, 7, 15-').",
    },
    {
      title: "Every page",
      q: ["You split a 12-page PDF with 'Every page as its own PDF'. How many files result?"],
      steps: ["One file per page."],
      answer: "12 files.",
    },
    {
      title: "One PDF per range",
      q: ["With ranges '1-3, 5, 8-10' and 'One PDF per range', how many files and pages each?"],
      steps: ["Three ranges."],
      answer: "Three files: 3 pages, 1 page and 3 pages.",
    },
    {
      title: "Email limit",
      q: ["Your email service allows 25 MB attachments. You have three PDFs of 9, 8 and 10 MB. What are your options?"],
      steps: ["Total 27 MB exceeds 25 MB.", "Send in two emails, compress, or share a link."],
      answer: "Send two emails, compress the scanned files, or share them through a cloud link. Compressing scanned PDFs usually brings them well under the limit.",
    },
    {
      title: "Target with margin",
      q: ["A portal limit is 100 KB. What target would you set in the compressor and why?"],
      steps: ["Leave a margin for how the portal counts kilobytes."],
      answer: "About 90 to 95 KB, so the file passes whether the portal counts 1000 or 1024 bytes per KB.",
    },
    {
      title: "Web image width",
      q: ["An image displays at 700 pixels wide on a blog. What width should you save it at?"],
      steps: ["Double for high-density screens."],
      answer: "About 1400 pixels.",
    },
    {
      title: "Page weight",
      q: ["A web page has eight photos of 450 KB each. If each is reduced to 120 KB, how much lighter is the page?"],
      steps: ["8 x 450 = 3600 KB", "8 x 120 = 960 KB", "Difference"],
      answer: "2640 KB lighter, about 2.6 MB, a 73 percent reduction.",
    },
    {
      title: "Poster resolution",
      q: ["How many pixels does an A3 poster (29.7 x 42 cm) need at 150 DPI?"],
      steps: ["29.7 / 2.54 x 150", "42 / 2.54 x 150"],
      answer: `${px(29.7, 150)} x ${px(42, 150)} pixels.`,
    },
    {
      title: "Format choice",
      q: ["Choose a format for each: a phone photo for a website, a screenshot of a spreadsheet, a logo with transparent background, and a photo for an exam portal that accepts only JPEG."],
      steps: ["Photo: WebP or JPG. Screenshot: PNG. Logo: PNG, WebP or SVG. Portal: JPG."],
      answer: "WebP or JPG; PNG; PNG or SVG (WebP also works); JPG.",
    },
    {
      title: "Redaction check",
      q: ["You covered a phone number in a PDF with a black box. How do you check it is really removed?"],
      steps: ["Try to select and copy the covered area; search for the number."],
      answer: "Select the covered area and copy it into a text editor, and search the PDF for part of the number. If anything appears, the text is still there.",
    },
    {
      title: "Compression choice",
      q: ["Which would you compress with Compress PDF: a 30-page scan of handwritten notes, or a 30-page report exported from a word processor with selectable text?"],
      steps: ["Scans are images already; compression helps a lot.", "Text exports are usually small; compression removes selectable text."],
      answer: "The scan. For the exported report, shrink any large images in the source and export again.",
    },
  ],

  exercises: {
    warmup: [
      { q: "What does '12 megapixels' mean?", a: "About 12 million pixels, such as 4000 x 3000." },
      { q: "Which format keeps transparency: JPG or PNG?", a: "PNG." },
      { q: "When does DPI matter?", a: "When printing, or when a size is given in centimetres or inches." },
      { q: "Does merging PDFs reduce quality?", a: "No. Pages are copied as they are." },
      { q: "What is a HEIC file?", a: "The default photo format on iPhones, efficient but not accepted by many portals." },
      { q: "What is EXIF data?", a: "Information stored in a photo such as date, camera and often GPS location." },
    ],
    practice: [
      { q: "Convert 5 x 5 cm at 300 DPI to pixels.", a: `${px(5, 300)} x ${px(5, 300)} pixels.` },
      { q: "A 3000 x 2000 photo is resized to 1500 wide. What is the height?", a: "1000 pixels." },
      { q: "Write a split range for pages 2 to 4 and 9 of a 10-page file.", a: "'2-4, 9'." },
      { q: "A notice says 10 to 20 KB. What target would you set?", a: "About 15 to 18 KB." },
      { q: "Which page size suits most Indian documents?", a: "A4 portrait." },
      { q: "Name two ways to make an image file smaller.", a: "Reduce the pixel dimensions; lower the quality. Changing format, such as to WebP, also helps." },
    ],
    stretch: [
      { q: "Explain why a 9 KB photo might be rejected even under a 50 KB limit.", a: "It may be below a minimum, and heavy compression makes the face unclear to the human checker." },
      { q: "Plan the steps to turn five phone photos of a marksheet into one PDF under 1 MB.", a: "Take photos in daylight; crop and rotate; JPG to PDF on A4 with small margin; check order; Compress PDF on balanced; check smallest text at full zoom; adjust level if needed." },
      { q: "A logo must go on a dark website header and a marketplace that wants JPG. Which files do you make?", a: "A transparent PNG or SVG for the website, and a JPG on white for the marketplace." },
      { q: "Why keep the original after compressing a PDF?", a: "The compressed copy's text is no longer selectable or searchable, and quality is lower; the original is needed for editing and records." },
      { q: "How much lighter is a page if ten 300 KB images become 90 KB each?", a: "2100 KB lighter, from 3000 KB to 900 KB." },
    ],
    challenge: [
      { q: "Write a checklist for an office preparing scanned documents for a government portal.", a: "Read the notice; scan at 150 to 200 DPI; correct order and rotation; one file per document if required, named as instructed; compress to under the limit with margin; check smallest text; remove passwords only on working copies; keep originals." },
      { q: "A client wants a poster for print at A2 and the same design for Instagram. How do you plan the files?", a: "Design at A2 print resolution (about 150 to 300 DPI), keep important content in the centre, then export a 1080 x 1350 crop or fitted version for Instagram." },
      { q: "Explain how to remove location data from photos before posting them on a classifieds site.", a: "Re-save them through a tool that does not copy EXIF, such as the site's compressor, or turn off location in the camera app; check a copy with a metadata viewer if unsure." },
      { q: "Design file-naming rules for a family's document folder.", a: "Person-document-detail-date, such as 'anita-passport-front-2026.pdf'; no spaces; consistent order; originals and compressed copies in separate folders." },
      { q: "Explain the trade-off between the compressor's quality setting and target size.", a: "Quality sets how much detail is kept and lets size vary; target size fixes the size and lets the tool lower quality or dimensions until it fits. Use target size for portals, quality for general use." },
    ],
  },

  faqs: [
    {
      group: "Pixels, sizes and formats",
      items: [
        ["What is the difference between pixels and KB?", "Pixels are the image's width and height in dots; kilobytes are how much storage it takes. Resizing changes pixels; compression changes kilobytes. Forms may ask for either or both."],
        ["What DPI should I use for printing?", "300 DPI for photos and documents viewed up close. 150 DPI is usually enough for posters seen from a distance. Screens do not use DPI; only pixels matter there."],
        ["Is JPEG the same as JPG?", "Yes. They are two spellings of the same format; the shorter one came from old systems that allowed only three-letter file extensions."],
        ["Should I use WebP?", "For websites, yes: it gives smaller files than JPG and PNG at similar quality and is supported by all current browsers. For forms and portals, use the format the notice asks for, usually JPG."],
        ["Why does my screenshot look fuzzy as a JPG?", "JPG compression blurs sharp edges such as text. Save screenshots as PNG to keep letters crisp."],
        ["Can I make a small image larger without losing quality?", "No tool can add real detail. Enlarging a small image makes it softer. Start from the largest original you have."],
        ["How do I open HEIC photos?", "Safari and Apple devices open them directly. On other systems, convert to JPG, or set your iPhone camera to Most Compatible so it saves JPG."],
        ["What does 'keep aspect ratio' mean?", "The width and height change in proportion, so the image is not stretched. Turn it off only when you are cropping or filling to an exact shape."],
      ],
    },
    {
      group: "Forms and portals",
      items: [
        ["Why does the portal reject my photo with no reason?", "Usually the file size, pixel dimensions or format is outside the notice's limits. Check all three, and aim slightly inside each limit."],
        ["What background should a form photo have?", "Usually plain white or a light colour, as the notice states. Stand in front of a plain wall in daylight and avoid shadows behind your head."],
        ["Can I use a selfie for an application photo?", "Front cameras often distort faces at close range and are held at an angle. Ask someone to take the photo from about a metre away at eye level for a better result."],
        ["How do I make my signature image clear?", "Sign in black ink on white paper, photograph it in daylight from directly above, crop tightly, and resize and compress to the required limits."],
        ["What if the notice gives size in centimetres but the portal wants pixels?", "Convert using the DPI the notice states, or 200 to 300 DPI if none is given. The resizer's centimetre option does the arithmetic."],
        ["Should I add my name and date below the photo?", "Only if the notice asks for it. Some exams require it; most forms do not."],
        ["My file is exactly at the limit. Is that safe?", "Not always, because portals count kilobytes differently. Aim a few kilobytes under."],
      ],
    },
    {
      group: "PDFs",
      items: [
        ["How do I combine photos into one PDF?", "Use JPG to PDF: add the images in page order, choose A4 portrait with a small margin, and create the file. Check the order before saving."],
        ["How do I take a few pages out of a PDF?", "Use Split PDF with a range such as '2-4, 7'. Choose whether to save them in one file or one per range."],
        ["Why can't the tools open my bank statement?", "It is password-protected. Open it in a PDF reader with the password and save an unprotected working copy, then delete that copy when you are done."],
        ["Will compressing a PDF make the text unselectable?", "With the site's compressor, yes, because pages are redrawn as images. Keep the original for editing and searching."],
        ["How do I fix pages that are sideways?", "Use Rotate PDF on the affected pages. Rotation keeps the page content and quality unchanged."],
        ["Can I edit the text inside a PDF with these tools?", "No. They move, join, split, rotate, convert and compress pages. To change text, edit the original document and export again, or use a PDF editor."],
        ["How do I get the text out of a PDF?", "Use PDF to Text. It works on PDFs with real text; scanned pages are images and need OCR, which reads the letters from the picture."],
        ["What is OCR?", "Optical character recognition: software that reads text from images of pages. Many scanners and phone scanning apps can add a hidden text layer so a scanned PDF becomes searchable."],
        ["Why is my merged PDF so large?", "Usually because one or more of the files are scans or photos at full resolution. Compress those files before or after merging."],
      ],
    },
    {
      group: "Privacy and safety",
      items: [
        ["Are my files uploaded when I use the site's tools?", "No. The image and PDF tools run in your browser, so the files are processed on your device and are not sent to a server."],
        ["Do photos contain my location?", "Often, yes, when location is enabled in the camera. The data is stored inside the file and travels with it unless removed."],
        ["How do I remove location from a photo?", "Re-save it through a tool that does not copy metadata, such as the site's compressor, or turn off location tagging in your camera settings for future photos."],
        ["Is a black box over text in a PDF safe?", "Not necessarily. Many editors only draw a shape on top. Use a proper redaction tool, or flatten the page to an image, and test by trying to copy the hidden text."],
        ["How should I share copies of ID documents?", "Share only what is needed, use masked versions where available, and write the purpose and date on copies. Avoid uploading IDs to unknown websites."],
        ["Can I trust any free PDF website?", "Check whether files are uploaded and what the privacy policy says. For sensitive documents, prefer tools that work in the browser or on your own device."],
      ],
    },
    {
      group: "Screens and the web",
      items: [
        ["What size should a YouTube thumbnail be?", "1280 x 720 pixels, a 16:9 shape, under the platform's file-size limit. Keep text large enough to read at small sizes."],
        ["Why do my photos look worse after posting on social media?", "Platforms recompress uploads. Upload at the size they expect, as a good-quality JPG, to give them less to change."],
        ["How large should images on my website be?", "About twice the width they are shown at, saved as WebP or JPG at 75 to 80 percent quality. Aim for under 200 KB for large banners and under 100 KB for content images."],
        ["What is alt text?", "A short text description of an image, read by screen readers and shown when the image does not load. Describe what the image shows and why it matters on the page."],
        ["What is a favicon?", "The small icon shown in browser tabs and bookmarks. Start from a square image of at least 512 pixels and generate the standard sizes."],
        ["What is an Open Graph image?", "The picture shown when a link is shared on social media or chat apps, usually 1200 x 630 pixels. Set it in the page's meta tags."],
      ],
    },
  ],

  glossary: [
    ["Pixel", "One dot in the grid that makes up a digital image."],
    ["Megapixel", "One million pixels."],
    ["Resolution", "The pixel dimensions of an image, or, for print, pixels per inch."],
    ["DPI", "Dots per inch: how many pixels are printed in each inch."],
    ["File size", "The storage an image or document takes, in KB or MB."],
    ["KB", "Kilobyte: 1000 or 1024 bytes, depending on the system."],
    ["Compression", "Reducing file size by encoding data more efficiently or discarding detail."],
    ["Lossy", "Compression that discards some detail, such as JPG."],
    ["Lossless", "Compression that keeps every pixel exactly, such as PNG."],
    ["JPG", "A lossy format for photographs; also spelled JPEG."],
    ["PNG", "A lossless format for screenshots, logos and images needing transparency."],
    ["WebP", "A modern format for the web with smaller files than JPG or PNG."],
    ["HEIC", "The default iPhone photo format."],
    ["SVG", "A vector format for logos and icons that scales without losing sharpness."],
    ["Transparency", "Areas of an image with no colour, showing what is behind."],
    ["Aspect ratio", "The ratio of width to height, such as 16:9."],
    ["Crop", "Cut away parts of an image to change its shape or framing."],
    ["Resize", "Change an image's pixel dimensions."],
    ["EXIF", "Metadata stored in photos: date, camera settings, often location."],
    ["Metadata", "Information about a file stored inside it."],
    ["OCR", "Optical character recognition: reading text from images."],
    ["Redaction", "Permanently removing information from a document."],
    ["Merge", "Join several PDFs into one."],
    ["Split", "Take pages out of a PDF into new files."],
    ["Encrypted PDF", "A PDF that needs a password to open."],
    ["Alt text", "A text description of an image for screen readers."],
    ["Favicon", "The small icon in a browser tab."],
    ["Open Graph image", "The preview image shown when a link is shared."],
    ["Safe area", "The central part of an image kept clear of cropping and overlays."],
  ],

  references: [
    { title: "Passport photo specifications", who: "Passport Seva, Ministry of External Affairs", where: "passportindia.gov.in", note: "Official requirements for Indian passport photographs." },
    { title: "Photo requirements for US visas", who: "US Department of State", where: "travel.state.gov", note: "The 2 x 2 inch specification and examples of acceptable photos." },
    { title: "Image file type and format guide", who: "MDN Web Docs", where: "developer.mozilla.org", note: "Clear comparison of JPG, PNG, WebP, AVIF, SVG and others for the web." },
    { title: "Optimize images", who: "web.dev (Google)", where: "web.dev", note: "Guidance on sizing, formats and compression for faster pages." },
    { title: "Images concepts and alt text", who: "W3C Web Accessibility Initiative", where: "w3.org/WAI/tutorials/images", note: "How to write alt text for different kinds of images." },
    { title: "Masked Aadhaar", who: "UIDAI", where: "uidai.gov.in", note: "How to download an Aadhaar that shows only the last four digits." },
    { title: "PDF format overview", who: "PDF Association", where: "pdfa.org", note: "Background on PDF standards, including archival PDF/A." },
    { title: "Image and PDF tools", who: "FreeToolsPro", where: "freetoolspro.in/image-tools and /pdf-tools", note: "Browser-based tools for the tasks in this book." },
  ],
};

// ---------------------------------------------------------------------------
// Second pass: fuller situations and answers, and chapters on scanning,
// colour, file names, print, archiving and batch work.

const scenarioMore = {
  "The 52 KB photo":
    "She also kept the original 3.2 MB photo in a folder named for the exam, in case the portal later asked for a different size, which, for the admit card stage, it did.",
  "Centimetres, not pixels":
    "The print shop owner told her the mistake was common. Customers often bring files sized for a form portal, a few hundred pixels across, and ask for passport prints. He keeps a note on the counter: 'For prints, bring the original photo.' Starting from the original lets the shop crop and size it correctly at print resolution.",
  "The wrong passport preset":
    "She also learned that the US requirement includes a set head size within the square and a white background, while the Indian one has its own rules for face size and background. A preset gives the right outer size; framing the face correctly is still up to the person taking the photo. Reading both notices side by side took five minutes and saved a second trip to the passport office.",
  "A PDF that was too big to email":
    "For the next audit, she scanned at 200 DPI instead of the scanner's default 600, which produced files a quarter of the size from the start with figures still perfectly clear. Choosing a sensible scan resolution meant the files rarely needed compressing at all.",
  "Two pages from a bank statement":
    "When the office later asked for a three-month statement, she knew exactly how to do it: unlock a working copy, split out the needed pages, check them, send them, and delete the unlocked copy. The routine took less time than finding the right branch to request a printed statement.",
  "A scan in the wrong order":
    "The clerk wrote the two steps on a card next to the scanner: 'Reversed? Reorder. Upside down? Rotate 180.' Since then, nobody in the office has rescanned a file because of order or rotation, which had previously happened several times a week during admissions. The time saved during the admission season alone was several hours, and the scanner's feeder, which had been jamming from overuse, lasted longer too.",
  "Location in a sale listing":
    "He also checked the photos he had shared on a neighbourhood group in the past year. Most had come from the gallery app, which kept location data. He could not remove those copies, but he turned off location tagging in his camera for everyday photos and turns it on only when travelling, when he wants to remember where a picture was taken.",
  "A logo with a black background":
    "She also kept a set of logo files in one folder: a transparent PNG for her website, a JPG on white for marketplaces, a square version for her WhatsApp business profile, and a large original. Having the right file ready meant she never had to convert in a hurry again, and the logo looked consistent everywhere her bakery appeared online.",
  "A blog that loaded slowly":
    "She made it a habit to process every batch of photos before uploading, rather than fixing old posts later. For her older posts, she replaced the largest images first, starting with the most visited pages, and saw the biggest gains from the first dozen posts.",
  "An Instagram post with a cut-off face":
    "He also learned that Instagram shows portrait posts larger in the feed than square or landscape ones, because they take up more of the phone screen. For a photographer, that extra space is valuable, so he now favours 4:5 for most posts and leaves landscapes for stories or carousels.",
  "A signature that looked grey":
    "He kept the final signature file on his phone and laptop, named 'mohan-signature-140x60.jpg', because the same size was asked for by two other portals that year. Reusing a good file saved him from repeating the process each time, and the signature looked the same on every application.",
  "A covered account number that was not covered":
    "She also realised that the landlord did not need the account number at all; he only needed to see that she had an account with the bank. Next time, she asked the bank for a letter without the number. The safest information is information you never send.",
  "Merging in the wrong order":
    "He also renamed the files before merging, with numbers at the start such as '01-fee-receipt.pdf', '02-application.pdf' and so on. Sorted by name, the files then appeared in the right order automatically, which made the merge almost impossible to get wrong.",
  "An iPhone photo the portal could not read":
    "A friend using a laptop with Chrome had the same problem with a HEIC photo she had copied from her phone, and the converter could not read it in that browser. The easiest fix there was to export the photo from the phone as JPG, or to use the iPhone's share sheet, which usually converts to JPG when sending to other apps.",
  "A poster that printed blurred":
    "The print shop also asked for a few millimetres of bleed, extra background beyond the trim edge, so that the poster had no thin white line where the paper was cut. The club added that to their print template and has had no complaints since.",
  "Marksheets with glare":
    "A classmate used a free scanning app on her phone, which detected page edges and flattened the perspective automatically. Kiran tried it for his next set and found it even faster. Either way, the light mattered most: the app could straighten a page but could not remove glare.",
};
for (const s of book.scenarios) if (scenarioMore[s.title]) s.paragraphs.push(scenarioMore[s.title]);

const faqMore = {
  "Why does my screenshot look fuzzy as a JPG?": " JPG works by smoothing small changes in colour, which suits photos but blurs the hard edges of letters and lines. PNG keeps them exact.",
  "Should I add my name and date below the photo?": " Where an exam requires it, follow the exact format shown in the notice, including the date format and the position of the text.",
  "My file is exactly at the limit. Is that safe?": " Some systems also add a little overhead when they receive a file, so a margin of five to ten percent below the limit is a good habit.",
  "How do I fix pages that are sideways?": " You can rotate all pages, only odd or even pages, or a list of page numbers, which helps when only some pages in a scan were turned.",
};
for (const g of book.faqs) g.items = g.items.map(([q, a]) => [q, faqMore[q] ? a + faqMore[q] : a]);

book.faqs.push(
  {
    group: "Scanning and printing",
    items: [
      ["What resolution should I scan documents at?", "200 DPI is enough for most text documents and keeps files small. Use 300 DPI for small print, signatures you will reuse, or anything that might be printed again. 600 DPI is rarely needed outside photos and archives."],
      ["Colour, greyscale or black and white scanning?", "Colour for documents with stamps, photos or coloured signatures; greyscale for ordinary printed text with some shading; black and white for plain text where file size matters most. Black and white files are much smaller."],
      ["Is a phone scanning app as good as a scanner?", "For most documents, yes, if the light is good. Scanning apps detect page edges and correct perspective. A flatbed scanner is still better for photos, fragile papers and very small print."],
      ["Why does my print look darker than the screen?", "Screens give off light while paper reflects it, and most screens are set brighter than a print can be. Brighten images slightly for print, and ask the print shop for a test print for important jobs."],
      ["What is bleed in printing?", "Extra background, usually 3 mm, beyond the edge where the paper will be cut. It prevents thin white lines at the edges if the cut is slightly off."],
      ["Why do colours change when I print?", "Screens mix red, green and blue light; printers mix cyan, magenta, yellow and black inks, which cannot reproduce every screen colour, especially bright greens and blues. Expect some difference and test important colours."],
    ],
  },
  {
    group: "Files and organisation",
    items: [
      ["How should I name document files?", "Use a consistent pattern such as person-document-detail-year, with hyphens instead of spaces, for example 'anita-pan-card-front-2026.jpg'. Names like 'IMG_4432.jpg' or 'scan1.pdf' make files hard to find and easy to confuse."],
      ["Should I keep the originals after compressing?", "Yes, for anything important. Compressed copies lose quality and, for PDFs, selectable text. Store originals in one folder and compressed copies for portals in another."],
      ["How can I process many images at once?", "The compressor, resizer and format converter accept several files at a time and apply the same settings to all of them. Check a few results before relying on the batch."],
      ["What is PDF/A?", "A version of PDF for long-term archiving that embeds fonts and avoids features that might not work in future. Some courts and government archives ask for it. Many office programs can export to PDF/A."],
      ["How long should I keep scanned documents?", "Keep identity, property, education and tax documents permanently or as long as the law requires; tax records in India should generally be kept for several years after the relevant year. Back them up in two places."],
    ],
  },
  {
    group: "Common problems",
    items: [
      ["Why is my photo rotated after uploading?", "Phones store rotation as a setting inside the photo rather than turning the pixels. Some systems ignore the setting and show the photo sideways. Re-saving through an image tool usually applies the rotation to the pixels."],
      ["Why does my image have a black or white box where it should be transparent?", "The format or the app does not support transparency, so it filled the transparent area with a colour. Use PNG or WebP to keep transparency, or choose the fill colour deliberately when converting to JPG."],
      ["Why did my compressed image get larger?", "Re-saving an already well-compressed image at a higher quality setting, or converting a JPG photo to PNG, can increase the size. Use JPG or WebP for photos and a quality around 75 to 80 percent."],
    ],
  },
);

book.chapters.push(
  {
    title: "Scanning documents well",
    paragraphs: [
      "A good scan saves work at every later step: it is readable, small enough to send, and needs no fixing. Most poor scans come from the wrong settings or poor light, not from poor equipment.",
    ],
    sections: [
      {
        heading: "Choosing a resolution",
        table: {
          caption: "Scan resolution and typical use.",
          headers: ["DPI", "Use", "Size of an A4 colour page"],
          widths: [0.8, 2.6, 1.6],
          rows: [
            ["150", "Screen viewing, quick records", "Small"],
            ["200", "Most text documents for portals and email", "Small to medium"],
            ["300", "Small print, signatures, documents that may be printed", "Medium"],
            ["600", "Photographs, archives, very fine detail", "Large"],
          ],
        },
        paragraphs: [
          "The file size grows with the square of the resolution: doubling DPI from 300 to 600 makes four times as many pixels. For most office documents, 200 DPI is the sweet spot. Many scanners default to 300 or 600; changing the default once saves compressing every file later.",
        ],
      },
      {
        heading: "Colour mode",
        paragraphs: [
          "Colour scans are three times the data of greyscale before compression. Use colour when it carries meaning: stamps, coloured signatures, photographs, highlighted text. Plain printed text scans well in greyscale or black and white, and the files are far smaller.",
        ],
      },
      {
        heading: "Phone scanning apps",
        bullets: [
          "Place the document on a contrasting background so the app can find the edges.",
          "Let the app detect and correct the perspective, then check the corners.",
          "Choose a document or black-and-white filter for text, and colour for photos and IDs.",
          "Save multi-page documents as one PDF in the app, or export images and use JPG to PDF.",
          "Check the app's privacy settings; some upload scans to their cloud by default.",
        ],
      },
      {
        heading: "Searchable scans",
        paragraphs: [
          "A plain scan is a picture of a page; you cannot search or copy its text. Many scanners and apps can run OCR, which reads the text and adds an invisible layer so the PDF becomes searchable. This is useful for archives and long documents. Remember that the site's Compress PDF redraws pages as images, which removes that text layer, so compress before running OCR or keep a searchable original.",
        ],
      },
    ],
  },
  {
    title: "Colour, brightness and fixing photos",
    paragraphs: [
      "Small adjustments can rescue a document photo or a product picture. Large ones usually make things worse. The aim is a natural look, readable text and true colours.",
    ],
    sections: [
      {
        heading: "Light first",
        paragraphs: [
          "No adjustment fixes a badly lit photo as well as retaking it in good light. Daylight from a window, without direct sun, gives even light and true colours. Indoor bulbs often add a yellow or blue tint that is hard to remove completely.",
        ],
      },
      {
        heading: "Brightness and contrast",
        paragraphs: [
          "Raise brightness slightly to make a grey page look white; raise contrast slightly to make text darker against it. Too much of either loses detail: faint pencil marks disappear and dark areas turn solid black. Make one small change, look, and stop when the page looks like paper.",
        ],
      },
      {
        heading: "Straightening and cropping",
        paragraphs: [
          "A slightly tilted document looks careless and may cut off text at the edges. Straighten it so lines of text are level, then crop to the page edges with a small even margin. For photos, straighten the horizon and crop to remove distractions at the edges.",
        ],
      },
      {
        heading: "Product photos for small sellers",
        bullets: [
          "Use a plain light background and daylight.",
          "Fill most of the frame with the product.",
          "Take several angles and a close-up of any detail buyers care about.",
          "Keep colours true; heavily edited colours lead to returns.",
          "Resize to the marketplace's recommended size before uploading.",
        ],
      },
      {
        heading: "What not to do",
        paragraphs: [
          "Do not use beauty filters on photos for official documents; many authorities reject altered photos. Do not alter documents in any way that changes what they say. Editing for clarity, such as brightness and cropping, is fine; changing content is not.",
        ],
      },
    ],
  },
  {
    title: "A family document kit",
    paragraphs: [
      "Most households fill in the same kinds of forms again and again: school admissions, bank KYC, job applications, passports, insurance claims. Preparing a small kit of ready files saves hours each year and avoids last-minute scanning.",
    ],
    sections: [
      {
        heading: "What to include",
        bullets: [
          "Recent photos of each person at 3.5 x 4.5 cm (413 x 531 pixels) and a square version.",
          "Signatures in black on white, cropped tightly, at a few common sizes.",
          "Identity documents, front and back, scanned at 200 to 300 DPI, with masked versions where available.",
          "Education certificates and marksheets, one PDF per document.",
          "Address proofs, such as a recent utility bill or bank statement pages.",
          "Birth certificates and other key records.",
        ],
      },
      {
        heading: "How to organise it",
        steps: [
          "Create one folder per person, and inside it 'originals' and 'for-upload'.",
          "Name each file person-document-detail-year, such as 'ravi-aadhaar-masked-2026.pdf'.",
          "Keep full-quality originals in 'originals'.",
          "Keep compressed copies sized for common portals in 'for-upload'.",
          "Back up the whole kit to a second place, such as an encrypted drive or a trusted cloud account with two-step sign-in.",
        ],
      },
      {
        heading: "Keeping it current",
        paragraphs: [
          "Photos for forms often need to be recent, typically within six months. Retake them once or twice a year, or before a big application. Replace address proofs when you move. A ten-minute review each January keeps the kit useful.",
        ],
      },
      {
        heading: "Protecting the kit",
        paragraphs: [
          "A folder of ID scans is valuable to fraudsters. Do not store it in a shared family folder that others can access, do not email it to yourself unencrypted, and use a strong password and two-step sign-in on any cloud account that holds it.",
        ],
      },
    ],
  },
  {
    title: "Working in batches",
    paragraphs: [
      "When you have dozens of images or files to process, doing them one by one is slow and inconsistent. The site's image tools accept several files at once and apply the same settings to all of them.",
    ],
    sections: [
      {
        heading: "A batch routine",
        steps: [
          "Copy the originals into a working folder; never batch-process your only copies.",
          "Test your settings on two or three representative files first.",
          "Check the test results at full size: sharpness, colour and file size.",
          "Process the whole batch with the same settings.",
          "Spot-check a few files from the start, middle and end of the batch.",
          "Save the results in a separate folder with a clear name.",
        ],
      },
      {
        heading: "Consistent settings for a website",
        paragraphs: [
          "For a blog or shop, decide one set of settings and use it every time: for example, maximum width 1600 pixels, WebP, quality 75. Images then look consistent and pages load at similar speeds. Write the settings down so anyone updating the site uses the same ones.",
        ],
      },
      {
        heading: "Batches of PDFs",
        paragraphs: [
          "For PDFs, merging a batch is simple, but compressing large numbers of scans is best done file by file with a check of each, since a setting that suits a printed letter may make a handwritten note unreadable. When many similar documents are involved, such as monthly invoices, test once on a typical example and then reuse the setting.",
        ],
      },
      {
        heading: "Large files and slow devices",
        paragraphs: [
          "Because the tools work in your browser, very large batches use your device's memory. On an older phone, process ten or twenty images at a time rather than hundreds. On a laptop with a modern browser, larger batches are usually fine.",
        ],
      },
    ],
  },
  {
    title: "Images in documents and slides",
    paragraphs: [
      "Images make reports and presentations clearer, and also make them heavy. A presentation that is 200 MB because of a few uncompressed photos is hard to email and slow to open.",
    ],
    sections: [
      {
        heading: "Size images before inserting",
        paragraphs: [
          "A slide is usually shown at 1920 pixels wide at most. A photo inserted at 4000 pixels wide carries four times the pixels that can ever be seen. Resize photos to about 1920 pixels wide for full-slide images and smaller for images that take part of a slide. Office programs also have a 'compress pictures' option that does this inside the file.",
        ],
      },
      {
        heading: "Screenshots",
        paragraphs: [
          "Take screenshots at the size they will be shown, crop to the relevant part, and save as PNG. A cropped screenshot showing only the button or figure that matters is clearer than a full-screen capture with a small arrow.",
        ],
      },
      {
        heading: "Charts",
        paragraphs: [
          "Charts made in a spreadsheet are best copied as charts or exported as SVG or high-resolution PNG, so lines and text stay sharp. A chart saved as a low-quality JPG has fuzzy text and coloured blotches around lines.",
        ],
      },
      {
        heading: "Exporting to PDF",
        paragraphs: [
          "When exporting a document or presentation to PDF, choose a setting for screen or email if the file will be read on screens, and for print if it will be printed. The screen setting reduces image resolution and produces much smaller files with text still selectable.",
        ],
      },
    ],
  },
);

book.scenarios.push(
  {
    title: "A presentation too heavy to send",
    paragraphs: [
      "Aditi, a consultant in Mumbai, finished a 25-slide client presentation the night before a meeting. It was 180 MB, and her email would not send it. Uploading it to a file-sharing service took twenty minutes on hotel wifi.",
      "She found that eight slides had photos inserted straight from a camera at 6000 pixels wide. She resized those photos to 1920 pixels with the image resizer, replaced them, and also used the presentation program's compress pictures option. The file fell to 9 MB and looked identical on the projector.",
      "She now resizes photos before inserting them into any document. It takes a minute per batch and prevents the late-night scramble. She also exports a PDF version at screen quality for clients who only need to read the slides, which is usually under 3 MB.",
    ],
    lesson: "Resize photos before putting them into documents and slides; the projector cannot show the extra pixels.",
  },
  {
    title: "A family kit that saved an admission",
    paragraphs: [
      "The Nair family in Thiruvananthapuram had to submit a school admission form with photos, birth certificate, address proof and parents' IDs within 48 hours of a seat being offered. A neighbour had missed a similar deadline the year before while hunting for documents and a scanner.",
      "Mrs Nair had built a document kit the previous January: a folder for each family member with originals and upload-ready copies, named consistently. She found every file in minutes, resized the child's photo to the school's required pixels, merged the documents in the order the school listed, and submitted within an hour.",
      "The only new work was the child's photo, which needed a recent one. She retook it in daylight against a white wall, processed it, and added it to the kit for next time.",
    ],
    lesson: "A prepared document kit turns urgent applications into a short task.",
  },
);

book.problems.push(
  {
    title: "Scan size growth",
    q: ["A page scanned at 300 DPI gives a 1.2 MB file. Roughly how large at 600 DPI with the same settings?"],
    steps: ["Doubling DPI doubles both dimensions.", "Pixels grow 2 x 2 = 4 times."],
    answer: "Roughly 4 times larger, about 4.8 MB, though compression makes the real figure vary.",
  },
  {
    title: "Scan at 200 DPI",
    q: ["How many pixels is an A4 page scanned at 200 DPI?"],
    steps: ["21 / 2.54 x 200", "29.7 / 2.54 x 200"],
    answer: `${px(21, 200)} x ${px(29.7, 200)} pixels.`,
  },
  {
    title: "Slide image",
    q: ["A 6000 x 4000 photo is resized to 1920 pixels wide for a slide. What is the height and how many times fewer pixels does it have?"],
    steps: ["Height = 1920 x 4000 / 6000 = 1280", "Pixels before 24,000,000; after 1920 x 1280 = 2,457,600", "Ratio"],
    answer: "1920 x 1280 pixels, about 9.8 times fewer pixels.",
  },
  {
    title: "Batch total",
    q: ["You compress 40 product photos from 3.5 MB to 150 KB each. What is the total before and after?"],
    steps: ["Before: 40 x 3.5 = 140 MB", "After: 40 x 150 = 6000 KB, about 5.9 MB"],
    answer: "About 140 MB before and about 6 MB after.",
  },
  {
    title: "Bleed",
    q: ["An A4 flyer (210 x 297 mm) needs 3 mm bleed on every side. What size should the design be?"],
    steps: ["Add 3 mm on each side: 6 mm to each dimension."],
    answer: "216 x 303 mm.",
  },
  {
    title: "Print size check",
    q: ["A logo is 600 x 600 pixels. How large can it print at 300 DPI?"],
    steps: ["600 / 300 = 2 inches = 5.08 cm."],
    answer: "About 5 x 5 cm. For a larger print, use a larger original or an SVG.",
  },
  {
    title: "File names",
    q: ["Rename these for a document kit: 'IMG_2231.jpg' (Ravi's PAN card front), 'scan 4.pdf' (Meena's Class 10 marksheet)."],
    steps: ["Person-document-detail, hyphens, no spaces."],
    answer: "'ravi-pan-card-front.jpg' and 'meena-class10-marksheet.pdf'.",
  },
  {
    title: "Merge order by name",
    q: ["How can you make files appear in the right order before merging?"],
    steps: ["Prefix names with two-digit numbers."],
    answer: "Rename them '01-...', '02-...' and so on, so they sort in order by name.",
  },
  {
    title: "Transparent logo on JPG",
    q: ["You must upload a transparent logo as JPG to a site with a light grey (#f2f2f2) background. What fill colour should you choose?"],
    steps: ["Match the page background so the box is invisible."],
    answer: "Light grey #f2f2f2, so the logo appears without a visible box.",
  },
  {
    title: "Rotation fix",
    q: ["In a 10-page scan, pages 4, 7 and 9 are upside down. What do you set in Rotate PDF?"],
    steps: ["Choose specific pages and 180 degrees."],
    answer: "Rotate by 180 degrees, pages '4, 7, 9'.",
  },
);

book.exercises.warmup.push(
  { q: "What DPI is enough for most text document scans?", a: "About 200 DPI." },
  { q: "What is bleed?", a: "Extra background beyond the trim edge of a print, usually 3 mm." },
);
book.exercises.practice.push(
  { q: "Name four things to include in a family document kit.", a: "Recent photos, signatures, ID scans (masked where possible), certificates, address proofs, birth certificates." },
  { q: "Pixels for a 10 x 15 cm print at 300 DPI?", a: `${px(10, 300)} x ${px(15, 300)} pixels.` },
);
book.exercises.stretch.push(
  { q: "Why should you compress a scanned PDF before running OCR rather than after?", a: "The site's compressor redraws pages as images, which removes any OCR text layer; running OCR afterwards keeps the file searchable." },
  { q: "Describe a safe batch routine for 200 product photos.", a: "Copy originals; test settings on a few; check at full size; batch process; spot-check; save to a separate folder." },
);
book.exercises.challenge.push(
  { q: "Write image guidelines for a small online shop.", a: "Daylight and plain background; several angles; true colours; square 2000 x 2000 originals; upload copies at the marketplace's size as JPG or WebP at about 80 percent; consistent file names; originals backed up." },
);

book.glossary.push(
  ["Bleed", "Extra background beyond the trim edge of a printed design."],
  ["Batch processing", "Applying the same settings to many files at once."],
  ["Greyscale", "An image made only of shades of grey."],
  ["PDF/A", "An archival form of PDF for long-term storage."],
);

book.references.push(
  { title: "Record retention for income tax", who: "Income Tax Department, Government of India", where: "incometax.gov.in", note: "Guidance on how long tax-related documents should be kept." },
);

book.chapters.push(
  {
    title: "Sending files: email, chat and links",
    paragraphs: [
      "How you send a file affects its quality, its privacy and whether it arrives at all. Each channel has limits and habits worth knowing.",
    ],
    sections: [
      {
        heading: "Email",
        paragraphs: [
          "Most email services limit attachments to about 20 to 25 MB per message, and the recipient's service may have a lower limit. Large attachments also fill mailboxes and are slow on mobile data. For anything over about 10 MB, consider compressing, splitting across messages, or sharing a link from a cloud drive instead.",
          "Attachments are sent as they are, including any location data in photos. Name files clearly before attaching them; the recipient sees the file name, and 'final-final-v3.pdf' does not inspire confidence.",
        ],
      },
      {
        heading: "WhatsApp and other chat apps",
        paragraphs: [
          "Chat apps compress photos sent in the normal way to save data, reducing their pixels and quality. That is fine for sharing moments but poor for documents and print. Sending a photo as a document, or using the app's HD option where offered, keeps more of the original. PDFs sent as documents arrive unchanged.",
        ],
      },
      {
        heading: "Cloud links",
        bullets: [
          "Share a link to a file in a cloud drive instead of attaching large files.",
          "Set access to specific people where possible, rather than 'anyone with the link'.",
          "Set an expiry date for links to sensitive files, if your service allows it.",
          "Remove access when the recipient no longer needs it.",
          "Remember that anyone who receives a public link can forward it.",
        ],
      },
      {
        heading: "Which to choose",
        table: {
          caption: "A rough guide.",
          headers: ["File", "Best way to send"],
          widths: [2.4, 2.4],
          rows: [
            ["Form photo or signature for someone to upload", "Email attachment or chat as a document"],
            ["Scanned documents under 10 MB", "Email attachment"],
            ["Many photos or files over 25 MB", "Cloud link shared with specific people"],
            ["Photos for casual viewing", "Chat app, normal send"],
            ["Photos for printing", "Cloud link or chat as a document"],
          ],
        },
      },
    ],
  },
  {
    title: "Other formats you will meet",
    paragraphs: [
      "Beyond JPG, PNG, WebP and HEIC, a few other formats turn up often enough to be worth recognising.",
    ],
    sections: [
      {
        heading: "SVG",
        paragraphs: [
          "SVG stores shapes as instructions, such as 'draw a circle here', rather than pixels. It stays sharp at any size, which makes it ideal for logos, icons and simple illustrations on websites. It is unsuitable for photos. Some portals and older programs do not accept SVG, so keep a PNG copy too.",
        ],
      },
      {
        heading: "GIF",
        paragraphs: [
          "GIF is an old format that supports simple animation and only 256 colours. Photos saved as GIF look banded. For animations on the web, short video files or animated WebP are usually much smaller and better looking, but GIF remains widely supported in chat and email.",
        ],
      },
      {
        heading: "AVIF",
        paragraphs: [
          "AVIF is a newer format that can make files even smaller than WebP at similar quality. Current major browsers support it. It is worth considering for large websites, but WebP remains the safer, simpler choice for most small sites, and portals rarely accept either.",
        ],
      },
      {
        heading: "TIFF and RAW",
        paragraphs: [
          "TIFF is a large, often lossless format used in printing and archiving. RAW files come from cameras and keep all the sensor data for editing. Both are far too large for forms and the web; convert them to JPG for sharing.",
        ],
      },
      {
        heading: "Base64 images",
        paragraphs: [
          "Developers sometimes embed small images directly in web pages or emails as Base64 text. The image to Base64 tool converts an image into that text. Base64 makes the data about a third larger, so it suits only very small images such as icons.",
        ],
      },
    ],
  },
  {
    title: "Accessible documents",
    paragraphs: [
      "Many people read documents with screen readers, magnifiers or high-contrast settings. A document that is only a picture of text cannot be read aloud. A few habits make PDFs and images usable by more people, and often easier for everyone.",
    ],
    sections: [
      {
        heading: "Real text over pictures of text",
        paragraphs: [
          "Where possible, share documents created from a word processor with selectable text rather than scans. Screen readers can read real text, users can enlarge it without blur, and search works. When only a scan exists, run OCR to add a text layer.",
        ],
      },
      {
        heading: "Structure",
        paragraphs: [
          "Use the heading styles in your word processor rather than just bold large text, and export to PDF with the option to keep document structure or tags. Screen readers use headings to move around a document, as sighted readers use their eyes.",
        ],
      },
      {
        heading: "Images in documents",
        paragraphs: [
          "Add alternative text to images in documents and presentations, describing what matters about each. A chart needs its main message in words; a decorative line needs none. Do not put essential information only in an image of text.",
        ],
      },
      {
        heading: "Contrast and size",
        bullets: [
          "Dark text on a light background, or the reverse, with strong contrast.",
          "Body text at least 11 to 12 points in print documents.",
          "Do not rely on colour alone to carry meaning in charts and forms.",
          "Avoid text placed over busy photos.",
        ],
      },
    ],
  },
);

book.scenarios.push(
  {
    title: "Photos for a print shop sent by chat",
    paragraphs: [
      "Gaurav in Kanpur sent twenty photos of his sister's wedding to a print shop over a chat app for an album. The prints came back soft and slightly blotchy, and the shop said the files were only about 1600 pixels wide.",
      "The chat app had compressed every photo when he sent them in the normal way. The originals on his phone were 4000 pixels wide and several megabytes each.",
      "He resent the originals as documents, which the app delivers unchanged, and the shop reprinted the album. The second set was sharp. He now uses a cloud link for any batch of photos meant for printing, which also keeps the file names in order.",
    ],
    lesson: "Chat apps compress photos sent normally. For printing, send originals as documents or through a link.",
  },
  {
    title: "A scanned report nobody could search",
    paragraphs: [
      "A district office in Nashik shared a 120-page scanned annual report as a PDF. Staff who needed to find figures had to scroll through page by page, and a visually impaired officer could not use it with his screen reader at all.",
      "The office ran the scan through OCR software, which added a hidden text layer, and kept that searchable version as the master copy. For the website, they also published the original word-processor file exported directly to PDF, which had real text, headings and alternative text for charts.",
      "Searches that had taken minutes now took seconds, and the officer could read the report with his screen reader. The office now asks for documents in their original digital form whenever possible, instead of printing and scanning them.",
    ],
    lesson: "Prefer documents with real text; when only scans exist, add a text layer with OCR.",
  },
  {
    title: "Animated GIF that slowed a newsletter",
    paragraphs: [
      "A small NGO in Bhubaneswar added an animated GIF of a volunteer event to its email newsletter. The GIF was 12 MB, and many readers on mobile data saw a blank space for several seconds, or nothing at all.",
      "The communications volunteer replaced it with a single well-chosen still photo, resized to 1200 pixels wide and compressed to 110 KB, linked to a short video on the NGO's website.",
      "The newsletter loaded quickly, and more readers clicked through to the video than had previously watched the GIF to the end. For email, a light still image with a link turned out to be better than a heavy animation.",
    ],
    lesson: "Large animated GIFs are slow. In email, use a light still image linked to a video.",
  },
);

book.faqs.push({
  group: "Sending and formats",
  items: [
    ["Why are photos blurry after sending on WhatsApp?", "WhatsApp compresses photos sent the normal way to save data. Send them as documents, or use the HD option where available, to keep more of the original quality."],
    ["What is the attachment limit for email?", "Commonly about 20 to 25 MB per message, but limits differ by service and the recipient's limit also applies. For larger files, share a cloud link."],
    ["When should I use SVG?", "For logos, icons and simple illustrations on websites, because SVG stays sharp at any size. Keep a PNG copy for programs and portals that do not accept SVG."],
    ["Is GIF good for photos?", "No. GIF supports only 256 colours, so photos look banded. Use JPG or WebP for photos, and short videos or animated WebP for animations on the web."],
    ["How do I make a PDF accessible?", "Create it from a document with real text, use heading styles, add alternative text to images, and export with tags or structure. For scans, run OCR to add a text layer."],
    ["Should I share files with 'anyone with the link'?", "Only for files you would be happy to see forwarded. For personal or business documents, share with specific people and remove access when it is no longer needed."],
  ],
});

book.problems.push(
  {
    title: "Base64 overhead",
    q: ["A 30 KB icon is converted to Base64. Roughly how large is the text?"],
    steps: ["Base64 adds about one third."],
    answer: "About 40 KB.",
  },
  {
    title: "Attachments split",
    q: ["You must email 46 MB of scanned PDFs with a 20 MB limit per message, without compressing. What is the fewest number of emails, if no single file is over 20 MB?"],
    steps: ["46 / 20 = 2.3, so at least 3 emails, depending on how the files group."],
    answer: "At least 3 emails. Compressing the scans or sharing a link would be simpler.",
  },
  {
    title: "Newsletter image",
    q: ["A newsletter image is shown 600 pixels wide. What width should you save it at, and roughly what file size should you aim for?"],
    steps: ["Double the display width for sharp screens.", "Aim well under 200 KB for email."],
    answer: "About 1200 pixels wide, aiming for roughly 80 to 150 KB as a JPG or WebP.",
  },
);

book.scenarios.find((s) => s.title === "Animated GIF that slowed a newsletter").paragraphs.push(
  "The volunteer also set a rule for future issues: no image in the newsletter over 200 KB, and the whole email under 1 MB.",
);

book.chapters.push(
  {
    title: "Getting pages and text out of PDFs",
    paragraphs: [
      "Sometimes you need the opposite of making a PDF: a page as an image to post or insert in a slide, or the text from a PDF to edit or quote.",
    ],
    sections: [
      {
        heading: "PDF to JPG",
        paragraphs: [
          "PDF to JPG turns each page into an image. Choose 72 DPI for small previews, 150 DPI for viewing on screens and inserting into slides, and 300 DPI when the image will be printed or zoomed in. PNG keeps text sharper than JPG for pages that are mostly text and lines; JPG is smaller for pages with photos.",
        ],
        table: {
          caption: "Pixel size of one A4 page at each setting.",
          headers: ["DPI", "Pixels", "Typical use"],
          widths: [0.8, 1.8, 2.4],
          rows: [
            ["72", `${px(21, 72)} x ${px(29.7, 72)}`, "Thumbnails and previews"],
            ["150", `${px(21, 150)} x ${px(29.7, 150)}`, "Screens, slides, chat"],
            ["300", `${px(21, 300)} x ${px(29.7, 300)}`, "Printing, zooming into detail"],
          ],
        },
      },
      {
        heading: "PDF to text",
        paragraphs: [
          "PDF to Text extracts the text layer of a PDF. You can keep the line breaks as they are, which suits addresses and tables, or join lines into paragraphs, which suits running text you want to edit. Page markers show where each page starts, which helps when quoting.",
          "If the extract comes out empty, the PDF is a scan without a text layer. Run OCR first, or retype the parts you need. Tables often come out as lines of words separated by spaces; for complex tables, copying from the original spreadsheet, if you can get it, is far easier.",
        ],
      },
      {
        heading: "Quoting and copyright",
        paragraphs: [
          "Extracting text or images does not change who owns them. Quote briefly with credit, follow the licence of documents you reuse, and ask permission before republishing someone else's work in full.",
        ],
      },
    ],
  },
  {
    title: "Troubleshooting guide",
    paragraphs: [
      "Most image and PDF problems have a short list of causes. Start with the symptom and work across.",
    ],
    sections: [
      {
        table: {
          caption: "Symptom, likely cause, fix.",
          headers: ["Symptom", "Likely cause", "Fix"],
          widths: [1.8, 1.8, 2.2],
          rows: [
            ["Portal says 'invalid file'", "Size, pixels or format outside limits", "Check all three; aim inside each limit"],
            ["Photo looks blocky", "Over-compressed", "Raise quality or target size"],
            ["Print is blurred", "Too few pixels for the print size", "Use the original; check pixels at 300 DPI"],
            ["Logo has a black box", "Transparency lost in JPG", "Use PNG, or choose fill colour"],
            ["Photo appears sideways", "Rotation stored as a setting", "Re-save through an image tool"],
            ["PDF too large", "Full-resolution scans or photos", "Compress PDF; scan at 200 DPI next time"],
            ["Cannot open PDF in tools", "Password protection", "Save an unlocked working copy"],
            ["Text not selectable", "Scan or compressed PDF", "Use the original or run OCR"],
            ["Colours differ in print", "Screen and ink colour ranges differ", "Test print; adjust important colours"],
            ["HEIC not accepted", "Portal needs JPG", "Convert, or set camera to Most Compatible"],
          ],
        },
      },
      {
        heading: "When nothing works",
        paragraphs: [
          "Try a different browser, since support for some formats differs; restart the device to free memory for large files; and try a single file before a batch. If a portal still refuses a file that meets every stated limit, contact its help desk with a screenshot of the error and the file's details: pixel size, file size and format.",
        ],
      },
    ],
  },
  {
    title: "Watermarks and protecting your images",
    paragraphs: [
      "Photographers, designers and small businesses often worry about their images being copied. No method stops copying completely, but some reduce misuse and make ownership clear.",
    ],
    sections: [
      {
        heading: "Visible watermarks",
        paragraphs: [
          "A small, semi-transparent name or logo in a corner identifies the owner without spoiling the image. A large watermark across the middle is harder to remove but also spoils the picture for honest viewers. For portfolios, many photographers use a small corner mark and accept that it can be cropped.",
        ],
      },
      {
        heading: "Share only what is needed",
        paragraphs: [
          "Post images online at the size needed for screens, such as 1600 to 2000 pixels wide, and keep full-resolution originals private. A screen-sized copy is of limited use for large prints, which protects the value of your originals.",
        ],
      },
      {
        heading: "Watermarking copies of documents",
        paragraphs: [
          "When sharing copies of ID or certificates, writing the purpose and date across the copy, such as 'For rental agreement with R. Sharma only, Oct 2026', makes misuse harder. Place the text across the document but not over the key details the recipient needs to read.",
        ],
      },
      {
        heading: "Using other people's images",
        paragraphs: [
          "Images found online are not free to use just because they can be downloaded. Use your own photos, images you have bought a licence for, or images from sources that state a free licence, and follow the licence's conditions, such as giving credit.",
        ],
      },
    ],
  },
);

book.chapters.push({
  title: "One job from start to finish",
  paragraphs: [
    "To pull the book together, here is a complete job as it might happen on an ordinary evening: a scholarship application that asks for a photo, a signature, an income certificate and two marksheets, with strict limits for each.",
  ],
  sections: [
    {
      heading: "The notice",
      codes: [{
        caption: "What the portal asks for (an example).",
        code: [
          "Photo:       JPG, 200 x 230 px, 20-50 KB, white background",
          "Signature:   JPG, 140 x 60 px, 10-20 KB",
          "Income cert: PDF, max 1 MB",
          "Marksheets:  one PDF, Class 10 then Class 12, max 2 MB",
        ].join("\n"),
      }],
    },
    {
      heading: "The photo",
      steps: [
        "Take a new photo in daylight against a white wall, from about a metre away, at eye level.",
        "Crop to the shape of 200 x 230, keeping the face centred with a little space above the head.",
        "Resize to exactly 200 x 230 pixels with the resizer's custom size.",
        "Compress with a target of 40 KB, leaving a margin below 50 KB.",
        "Open the result and check the face is clear.",
      ],
    },
    {
      heading: "The signature",
      steps: [
        "Sign in black gel pen on white paper; photograph from above in daylight.",
        "Crop tightly around the signature with a small border.",
        "Resize to 140 x 60 pixels.",
        "Compress with a target of 15 KB.",
      ],
    },
    {
      heading: "The documents",
      steps: [
        "Photograph or scan the income certificate at about 200 DPI; make it a PDF with JPG to PDF on A4.",
        "Check its size; if over 1 MB, compress on the balanced setting and check the smallest text.",
        "Make each marksheet into a PDF, then merge them with Class 10 first and Class 12 second.",
        "Check the merged file's order and size; compress if over 2 MB.",
      ],
    },
    {
      heading: "Final check",
      paragraphs: [
        "Name the files clearly, put them in a folder for the application, and compare each against the notice one last time: format, pixels, size, order. Upload them one at a time and look at the preview the portal shows, if any. The whole job, done in order, takes about half an hour, most of it on taking good photos.",
      ],
    },
  ],
});

book.scenarios.push(
  {
    title: "A school ID card batch",
    paragraphs: [
      "A school in Agra had to send 640 student photos to a printer for ID cards, each 300 x 375 pixels and named by admission number. Teachers had collected photos by chat in all shapes and sizes.",
      "The office assistant first renamed every file by admission number, then cropped the few landscape photos by hand. She ran the rest through the resizer in batches of fifty with the custom size 300 x 375 and 'crop to fill', checked a few from each batch, and fixed the handful where the crop had cut a forehead.",
      "The printer received a consistent set in one day. The assistant wrote down the settings and the steps so that next year's batch could start from the same routine, and asked teachers to collect photos against a plain wall in future.",
    ],
    lesson: "For large batches, standardise names first, test settings, then process in manageable groups with spot checks.",
  },
  {
    title: "A rent agreement with a stranger's details",
    paragraphs: [
      "Vinay in Bengaluru received a rent agreement template as a PDF from a broker. It contained the full names, phone numbers and ID numbers of a previous tenant and landlord, covered only by white boxes that disappeared when he copied the text.",
      "He told the broker, who had not realised the details were still there, and asked for a clean template. He also deleted his copy.",
      "The broker started making templates from a fresh document instead of editing old agreements. Vinay's check, copying a little text from the covered area, took a few seconds and protected two strangers' details.",
    ],
    lesson: "Covered details in PDFs can still be present. Make templates from clean documents, not edited old ones.",
  },
);

book.problems.push(
  {
    title: "ID card batch time",
    q: ["Processing 50 photos takes 3 minutes plus 4 minutes of checking. How long for 640 photos?"],
    steps: ["640 / 50 = 12.8, so 13 batches.", "13 x 7 minutes = 91 minutes."],
    answer: "About an hour and a half.",
  },
  {
    title: "Shape match",
    q: ["Is 200 x 230 the same shape as 3.5 x 4.5 cm?"],
    steps: ["200 / 230 = 0.870", "3.5 / 4.5 = 0.778"],
    answer: "No. 200 x 230 is a little wider in proportion, so crop to the exact pixel shape the notice gives.",
  },
  {
    title: "Pages to images",
    q: ["A 6-page PDF is converted to JPG at 150 DPI. How many images, and what pixel size for A4 pages?"],
    steps: ["One image per page.", `A4 at 150 DPI = ${px(21, 150)} x ${px(29.7, 150)}.`],
    answer: `6 images, each about ${px(21, 150)} x ${px(29.7, 150)} pixels.`,
  },
);

book.faqs.push({
  group: "A few more",
  items: [
    ["How do I make all photos the same size for ID cards?", "Rename them first, then use the resizer's custom size with 'crop to fill' in batches, and check a few from each batch for faces cut at the edges."],
    ["Can I convert a PDF page to an image for a slide?", "Yes, use PDF to JPG at 150 DPI for screens or 300 DPI for print. Choose PNG for pages that are mostly text and lines."],
    ["Why is the extracted text from my PDF jumbled?", "PDFs store text positioned on the page, not in reading order, so columns and tables can come out mixed. Use the line-break options, or copy from the original document if you have it."],
    ["Do I need permission to use images from the internet?", "Usually yes. Use your own images, licensed images or images under a free licence, and follow the licence's conditions such as giving credit."],
  ],
});

book.scenarios.find((s) => s.title === "A rent agreement with a stranger's details").paragraphs.push(
  "When Vinay later shared his own signed agreement with his employer for a house rent allowance claim, he sent only the pages the employer needed and checked that his landlord's ID number was not visible beyond what the claim required. The habit of looking at what a document reveals, before sending it, had stuck.",
);

book.chapters.push({
  title: "Quick reference",
  paragraphs: [
    "The figures and settings used most often in this book, gathered in one place. Portal limits are examples; always check the notice for your form.",
  ],
  sections: [
    {
      table: {
        caption: "Sizes in pixels for common jobs.",
        headers: ["Job", "Pixels", "Notes"],
        widths: [2.2, 1.4, 2.2],
        rows: [
          ["Indian passport / exam photo, 3.5 x 4.5 cm", "413 x 531", "At 300 DPI"],
          ["US passport / visa, 2 x 2 in", "600 x 600", "At 300 DPI"],
          ["Signature (common)", "140 x 60", "Check the notice"],
          ["A4 page at 150 DPI", `${px(21, 150)} x ${px(29.7, 150)}`, "Screen viewing"],
          ["A4 page at 200 DPI", `${px(21, 200)} x ${px(29.7, 200)}`, "Document scans"],
          ["A4 page at 300 DPI", `${px(21, 300)} x ${px(29.7, 300)}`, "Printing"],
          ["4 x 6 in print at 300 DPI", "1200 x 1800", "Standard photo print"],
          ["Full-slide image", "1920 x 1080", "16:9 presentation"],
          ["Blog image shown at 800 px", "1600 wide", "Double display width"],
        ],
      },
    },
    {
      heading: "Settings that usually work",
      bullets: [
        "Web photos: WebP or JPG, quality 75 to 80, width twice the display width.",
        "Form photos: JPG, exact pixels from the notice, target a few KB under the maximum.",
        "Screenshots: PNG, cropped to what matters.",
        "Document scans: 200 DPI, greyscale or black and white for plain text.",
        "PDF for email: Compress PDF on balanced, then check the smallest text.",
        "Logos: SVG or transparent PNG, plus a JPG on white for places that need JPG.",
      ],
    },
    {
      heading: "The formula",
      paragraphs: [
        "Pixels equal the size in centimetres divided by 2.54, multiplied by the DPI. Printed size in inches equals pixels divided by DPI. Keep these two lines in mind and almost every size question in this book can be answered in a few seconds.",
      ],
    },
  ],
});

book.scenarios.push(
  {
    title: "Insurance claim with forty bills",
    paragraphs: [
      "After a hospital stay, Usha in Coimbatore had to submit forty pharmacy and lab bills for an insurance claim through an online form that accepted one PDF of up to 5 MB. Her phone photos totalled 120 MB.",
      "She sorted the bills by date, photographed any faded ones again in daylight, and made them into a PDF with JPG to PDF on A4. The result was 61 MB. Compress PDF on the balanced setting brought it to 6.2 MB, still too large, so she used the target size option at 4,600 KB.",
      "She opened the compressed file and checked the smallest print, the amounts and dates, on several bills at full zoom. All were readable. The claim was processed without a request for clearer copies, and she kept the full-quality PDF in case the insurer asked for originals later.",
    ],
    lesson: "For large claim bundles, sort first, compress to a target under the limit, and check the smallest figures.",
  },
  {
    title: "A favicon that looked like a smudge",
    paragraphs: [
      "Tanvi, who runs a small yoga studio site in Dehradun, used her full logo, with the studio name in small letters below a lotus, as the favicon. In browser tabs it appeared as an unreadable smudge.",
      "At 16 or 32 pixels, there is room for one simple shape and perhaps a letter. She made a square version of just the lotus on a solid background, started from 512 x 512 pixels, and ran it through the favicon generator.",
      "The new icon was clear in tabs and on phone home screens. She kept the full logo for the website header, where there was space for it.",
    ],
    lesson: "Favicons are tiny. Use one simple shape, not a full logo with text.",
  },
);

book.scenarios.find((s) => s.title === "A favicon that looked like a smudge").paragraphs.push(
  "She also checked the icon against both light and dark browser themes, since a dark lotus on a transparent background vanished against a dark tab bar. The solid background solved that too.",
);

book.problems.push(
  {
    title: "Claim bundle target",
    q: ["A form accepts one PDF of up to 5 MB. Compression on balanced gives 6.2 MB. What target size would you set, and what do you check afterwards?"],
    steps: ["5 MB is 5120 KB in binary units or 5000 KB in decimal.", "Leave a margin of about 8 to 10 percent below the smaller figure."],
    answer: "About 4,500 to 4,600 KB. Afterwards, open the file and check the smallest figures, such as amounts and dates, at full zoom.",
  },
  {
    title: "Favicon pixels",
    q: ["A favicon is shown at 32 x 32 pixels. If your logo has text 8 percent of the logo's height, how tall would that text be in the favicon?"],
    steps: ["32 x 0.08 = 2.56 pixels."],
    answer: "About 2.5 pixels, far too small to read. Use a simple shape without the text.",
  },
  {
    title: "Kit refresh",
    q: ["A notice requires photos taken within the last six months. Your kit photos were taken in March. Can you use them for an application in October of the same year?"],
    steps: ["March to October is seven months."],
    answer: "No. Retake the photo before applying.",
  },
);

book.faqs.push({
  group: "Last questions",
  items: [
    ["What size should a favicon start from?", "A square image of at least 512 x 512 pixels with one simple shape. The generator makes the smaller sizes browsers and phones need."],
    ["How do I check the pixel size of an image?", "On a computer, open the file's properties or information panel; on a phone, many gallery apps show details. The site's image tools also show the size of each file you load."],
    ["Should insurance or tax documents be compressed?", "Compress copies for uploading, but keep full-quality originals. Insurers and tax officers may ask for clearer copies or originals later."],
  ],
});

export default book;
