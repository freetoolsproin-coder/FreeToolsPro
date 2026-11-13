// Long-form guides for LaTeX tools. Each entry: [heading, ...paragraphs].
export default {
  "latex-equation-editor": [
    "Writing equations in LaTeX",
    "LaTeX describes an equation in plain text. A caret raises the next item, an underscore lowers it, and curly braces group several items together, so x^{n+1} puts the whole of n+1 in the exponent, while x^n+1 raises only the n. Most structures are commands with arguments in braces: \\frac{a}{b} for a fraction, \\sqrt{x} for a root and \\sum_{i=1}^{n} for a sum with limits.",
    "Brackets do not grow on their own. Write \\left( and \\right) around tall content such as a fraction, and they will stretch to fit. For several lines lined up on the equals sign, use the aligned environment, with an & before each sign and \\\\ at the end of each line. The Layout buttons above insert these for you.",
  ],
  "latex-symbol-generator": [
    "Finding the right command",
    "Most symbol commands are named after what they mean, so it pays to search by meaning: 'implies' finds \\Rightarrow, and 'element' finds \\in. Pasting the character itself also works when you only have the symbol from a document or web page.",
    "Watch out for look-alikes. Use \\to for the arrow in a limit, \\cdot for multiplication rather than a full stop, and \\mid for 'such that' or 'given', which spaces itself correctly where a plain vertical bar does not. Blackboard capitals such as \\mathbb{R} need the amssymb package.",
  ],
  "latex-matrix-generator": [
    "Choosing the right brackets",
    "The brackets carry meaning as well as style. Round or square brackets are both used for a matrix, and you should simply stay consistent through a document. Single bars mean a determinant, and double bars usually mean a norm.",
    "Every row must have the same number of cells, and the & between cells and the \\\\ between rows must be in the right place, which is what makes long matrices fiddly by hand. Here the grid takes care of that, and the padding in the code keeps the columns lined up so the matrix stays easy to edit in your .tex file.",
  ],
  "latex-equation-to-image": [
    "Getting a sharp equation image",
    "A screenshot of an equation looks blurry as soon as it is enlarged. Rendering it directly gives you clean edges at the size you need. For a PNG, the resolution multiplier matters most: a 40 px equation at 3× is 120 px tall in the file, so it stays crisp on a high-resolution screen and on a projector.",
    "Use a transparent background so an equation sits cleanly on a coloured slide, and pick a text colour that suits the slide. On a dark background, remember to change the text to white. SVG is the best choice for web pages, because it scales to any size and is usually a smaller file than a large PNG.",
  ],
  "latex-table-generator": [
    "Tables that look professional",
    "Good tables rely on spacing more than lines. The booktabs style uses three horizontal rules and no vertical ones, which is what most journals expect. Right-align columns of numbers so that digits line up, and left-align text.",
    "A table inside the table environment can float to a better position on the page and carry a caption and a label. You can then refer to it with \\ref{tab:name}, and the number stays correct if tables move. If you want the table to stay exactly where it is in the text, turn off 'Table with caption' to get a plain tabular.",
  ],
  "latex-code-formatter": [
    "Why formatting LaTeX helps",
    "LaTeX ignores most spacing in your source, so a messy file compiles the same as a tidy one. The value of formatting is for you and your co-authors: indented environments make a missing \\end easy to spot, and aligned columns make a wrong number of cells obvious.",
    "Tidy files also give cleaner diffs in version control, because each \\item and each environment sits on its own line. Run the formatter before you start editing, so that your later changes are not mixed in with spacing changes.",
  ],
  "image-to-latex": [
    "Getting the best result from an image",
    "The reader separates the image into individual symbols, compares each one with reference shapes, and then works out the structure from where the symbols sit: a raised, smaller symbol is a superscript, and items above and below a line form a fraction. So it needs clear symbols with clean gaps between them.",
    "Zoom in on the equation before taking the screenshot, and crop close to it. Look-alike characters are the most common errors: l, 1 and I, or O and 0, can be identical in print. Always compare the preview with your image before using the result. The message under the preview names the symbols it was least sure of.",
  ],
  "latex-templates": [
    "Using a template",
    "A LaTeX document has two parts. The preamble, before \\begin{document}, sets the page, the packages and any custom commands. The body, after it, holds your content. In these templates, the repeated layout is defined once in the preamble, so you only need to change the content.",
    "For a resume, keep each entry short and lead with what you achieved, with numbers where you can. For papers and reports, use \\section for structure, and let LaTeX number the sections, tables and equations, so that references stay correct as the document changes.",
  ],
  "latex-formula-library": [
    "Reusing formulas in your documents",
    "Copied formulas go inside maths mode. Use \\[ and \\] for an unnumbered equation on its own line, or an equation environment if you want a number. If a formula uses commands such as \\binom or \\begin{bmatrix}, add \\usepackage{amsmath} to your preamble.",
    "Symbols differ between textbooks. Finance and physics in particular use the same letter for different things, so check that a formula's variables match the ones in your own work, and define them in the text around the equation.",
  ],
  "mathml-to-latex": [
    "MathML and LaTeX",
    "MathML is the XML language browsers use to display equations, and it is what many tools export. It describes each symbol and structure with a tag, so it is precise but long. LaTeX says the same thing in a fraction of the space, which makes it easier to read and edit.",
    "Conversion goes tag by tag: mfrac becomes \\frac, msqrt becomes \\sqrt, msup a superscript, and mtable a matrix or cases environment, depending on the brackets around it. Spacing and fonts may come out slightly differently from the original, so check the preview.",
  ],
  "latex-to-pdf": [
    "What this compiler does",
    "Full LaTeX needs a large installation of programs, fonts and packages. This tool takes a lighter route: it reads your document's structure, typesets it with its own layout engine and writes the PDF on your device. Numbering, cross-references, tables of contents and bibliographies in the file all work, but the look will be close to, not identical to, what pdfLaTeX produces.",
    "The log is the key part. Unlike a normal LaTeX run, a problem does not stop the compile: an unknown command is skipped and listed, and a broken equation is printed in red, so you can always see a result. For a journal submission or anything that needs a specific class or package, do your final build with TeX Live, MiKTeX or Overleaf.",
  ],
  "latex-equation-to-word": [
    "Native equations rather than images",
    "A picture of an equation in Word cannot be edited, is not read out by screen readers, and looks poor when resized. This tool writes real Office Math instead, the format Word's Insert Equation feature uses, so each equation behaves as if you had typed it in Word.",
    "Most structures convert directly: fractions, roots, matrices, sums and integrals with limits, accents, and brackets that stretch. LaTeX layout commands do not always have a Word equivalent, so aligned equations become a small matrix, for example. Open the .docx and check long or unusual equations before submitting your document.",
  ],
};
