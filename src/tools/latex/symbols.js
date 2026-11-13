// LaTeX symbol table. Each symbol: [command, name, unicode, extra search words].
// Also the source of the Unicode <-> command map used by the MathML converter.
const R = String.raw;

const greek = (rows) => rows.map(([cmd, ch, extra]) => [`\\${cmd}`, cmd.replace(/^var/, "variant "), ch, extra || "greek"]);

export const SYMBOL_GROUPS = [
  {
    id: "greek-lower",
    name: "Greek lowercase",
    items: greek([
      ["alpha", "α"], ["beta", "β"], ["gamma", "γ"], ["delta", "δ"], ["epsilon", "ϵ"], ["varepsilon", "ε"], ["zeta", "ζ"], ["eta", "η"],
      ["theta", "θ", "greek angle"], ["vartheta", "ϑ"], ["iota", "ι"], ["kappa", "κ"], ["lambda", "λ", "greek wavelength"], ["mu", "μ", "greek micro mean"], ["nu", "ν"], ["xi", "ξ"],
      ["pi", "π", "greek circle 3.14"], ["varpi", "ϖ"], ["rho", "ρ", "greek density"], ["varrho", "ϱ"], ["sigma", "σ", "greek standard deviation"], ["varsigma", "ς"], ["tau", "τ"], ["upsilon", "υ"],
      ["phi", "ϕ"], ["varphi", "φ"], ["chi", "χ"], ["psi", "ψ"], ["omega", "ω", "greek angular frequency"],
    ]),
  },
  {
    id: "greek-upper",
    name: "Greek uppercase",
    items: greek([["Gamma", "Γ"], ["Delta", "Δ", "greek change"], ["Theta", "Θ"], ["Lambda", "Λ"], ["Xi", "Ξ"], ["Pi", "Π"], ["Sigma", "Σ"], ["Upsilon", "Υ"], ["Phi", "Φ"], ["Psi", "Ψ"], ["Omega", "Ω", "greek ohm"]]),
  },
  {
    id: "binary",
    name: "Operators",
    items: [
      [R`\times`, "times", "×", "multiply cross product"], [R`\div`, "divide", "÷", "division"], [R`\pm`, "plus or minus", "±", "plus minus"], [R`\mp`, "minus or plus", "∓", ""], [R`\cdot`, "centred dot", "⋅", "multiply dot product"],
      [R`\ast`, "asterisk", "∗", "star"], [R`\star`, "star", "⋆", ""], [R`\circ`, "composition", "∘", "ring degree"], [R`\bullet`, "bullet", "∙", ""], [R`\oplus`, "circled plus", "⊕", "xor direct sum"],
      [R`\otimes`, "circled times", "⊗", "tensor"], [R`\ominus`, "circled minus", "⊖", ""], [R`\odot`, "circled dot", "⊙", ""], [R`\dagger`, "dagger", "†", ""], [R`\ddagger`, "double dagger", "‡", ""],
      [R`\wedge`, "wedge", "∧", "and logic"], [R`\vee`, "vee", "∨", "or logic"], [R`\setminus`, "set minus", "∖", "difference"], [R`\wr`, "wreath", "≀", ""], [R`\diamond`, "diamond", "⋄", ""],
    ],
  },
  {
    id: "relations",
    name: "Relations",
    items: [
      [R`\leq`, "less than or equal", "≤", "le"], [R`\geq`, "greater than or equal", "≥", "ge"], [R`\neq`, "not equal", "≠", "ne"], [R`\approx`, "approximately equal", "≈", "almost"], [R`\equiv`, "equivalent", "≡", "identical congruent"],
      [R`\sim`, "similar", "∼", "tilde distributed"], [R`\simeq`, "similar or equal", "≃", ""], [R`\cong`, "congruent", "≅", ""], [R`\propto`, "proportional to", "∝", ""], [R`\ll`, "much less than", "≪", ""],
      [R`\gg`, "much greater than", "≫", ""], [R`\prec`, "precedes", "≺", ""], [R`\succ`, "succeeds", "≻", ""], [R`\perp`, "perpendicular", "⊥", "orthogonal"], [R`\parallel`, "parallel", "∥", ""],
      [R`\mid`, "divides", "∣", "such that"], [R`\asymp`, "asymptotic", "≍", ""], [R`\doteq`, "dot equal", "≐", ""], [R`\models`, "models", "⊨", ""], [R`\vdash`, "proves", "⊢", "turnstile"],
    ],
  },
  {
    id: "arrows",
    name: "Arrows",
    items: [
      [R`\rightarrow`, "right arrow", "→", "to implies"], [R`\leftarrow`, "left arrow", "←", "gets"], [R`\leftrightarrow`, "left right arrow", "↔", ""], [R`\Rightarrow`, "double right arrow", "⇒", "implies"], [R`\Leftarrow`, "double left arrow", "⇐", ""],
      [R`\Leftrightarrow`, "double left right arrow", "⇔", "if and only if iff"], [R`\mapsto`, "maps to", "↦", ""], [R`\longrightarrow`, "long right arrow", "⟶", ""], [R`\longleftarrow`, "long left arrow", "⟵", ""], [R`\Longrightarrow`, "long double right arrow", "⟹", ""],
      [R`\uparrow`, "up arrow", "↑", ""], [R`\downarrow`, "down arrow", "↓", ""], [R`\updownarrow`, "up down arrow", "↕", ""], [R`\Uparrow`, "double up arrow", "⇑", ""], [R`\Downarrow`, "double down arrow", "⇓", ""],
      [R`\nearrow`, "north-east arrow", "↗", ""], [R`\searrow`, "south-east arrow", "↘", ""], [R`\swarrow`, "south-west arrow", "↙", ""], [R`\nwarrow`, "north-west arrow", "↖", ""], [R`\hookrightarrow`, "hook right arrow", "↪", "inclusion"],
      [R`\rightleftharpoons`, "equilibrium", "⇌", "harpoons chemistry reversible"],
    ],
  },
  {
    id: "sets",
    name: "Sets & logic",
    items: [
      [R`\in`, "element of", "∈", "belongs"], [R`\notin`, "not element of", "∉", ""], [R`\ni`, "contains as member", "∋", ""], [R`\subset`, "subset", "⊂", ""], [R`\supset`, "superset", "⊃", ""],
      [R`\subseteq`, "subset or equal", "⊆", ""], [R`\supseteq`, "superset or equal", "⊇", ""], [R`\cup`, "union", "∪", ""], [R`\cap`, "intersection", "∩", ""], [R`\emptyset`, "empty set", "∅", "null"],
      [R`\varnothing`, "empty set, variant", "⌀", "null"], [R`\forall`, "for all", "∀", "universal quantifier"], [R`\exists`, "there exists", "∃", "existential quantifier"], [R`\nexists`, "there does not exist", "∄", ""], [R`\neg`, "not", "¬", "logic negation"],
      [R`\therefore`, "therefore", "∴", ""], [R`\because`, "because", "∵", ""], [R`\mathbb{R}`, "real numbers", "ℝ", "blackboard bold"], [R`\mathbb{Z}`, "integers", "ℤ", "blackboard bold"], [R`\mathbb{N}`, "natural numbers", "ℕ", "blackboard bold"],
      [R`\mathbb{Q}`, "rational numbers", "ℚ", "blackboard bold"], [R`\mathbb{C}`, "complex numbers", "ℂ", "blackboard bold"],
    ],
  },
  {
    id: "calculus",
    name: "Big operators & calculus",
    items: [
      [R`\sum`, "sum", "∑", "sigma summation"], [R`\prod`, "product", "∏", "pi"], [R`\coprod`, "coproduct", "∐", ""], [R`\int`, "integral", "∫", ""], [R`\iint`, "double integral", "∬", ""],
      [R`\iiint`, "triple integral", "∭", ""], [R`\oint`, "contour integral", "∮", "line closed"], [R`\bigcup`, "big union", "⋃", ""], [R`\bigcap`, "big intersection", "⋂", ""], [R`\bigoplus`, "big circled plus", "⨁", ""],
      [R`\bigotimes`, "big circled times", "⨂", ""], [R`\partial`, "partial derivative", "∂", ""], [R`\nabla`, "nabla", "∇", "gradient del"], [R`\infty`, "infinity", "∞", ""], [R`\lim`, "limit", "", "function"],
      [R`\sqrt{x}`, "square root", "√", "radical"], [R`\sqrt[n]{x}`, "nth root", "", "radical"], [R`\frac{a}{b}`, "fraction", "", "divide"], [R`\binom{n}{k}`, "binomial coefficient", "", "choose combination"], [R`\prime`, "prime", "′", "derivative"],
    ],
  },
  {
    id: "functions",
    name: "Functions",
    items: ["sin", "cos", "tan", "cot", "sec", "csc", "arcsin", "arccos", "arctan", "sinh", "cosh", "tanh", "log", "ln", "exp", "lim", "min", "max", "sup", "inf", "det", "gcd", "arg", "deg", "dim", "ker", "hom", "Pr"].map((f) => [`\\${f}`, f, "", "function"]),
  },
  {
    id: "delimiters",
    name: "Brackets",
    items: [
      [R`\left( \right)`, "auto-size parentheses", "", "brackets"], [R`\left[ \right]`, "auto-size square brackets", "", ""], [R`\left\{ \right\}`, "auto-size braces", "", "curly"], [R`\{`, "left brace", "{", "curly"], [R`\}`, "right brace", "}", "curly"],
      [R`\langle`, "left angle bracket", "⟨", ""], [R`\rangle`, "right angle bracket", "⟩", ""], [R`\lfloor`, "left floor", "⌊", ""], [R`\rfloor`, "right floor", "⌋", ""], [R`\lceil`, "left ceiling", "⌈", ""],
      [R`\rceil`, "right ceiling", "⌉", ""], [R`\vert`, "vertical bar", "|", "absolute value"], [R`\Vert`, "double vertical bar", "‖", "norm"], [R`\backslash`, "backslash", "\\", ""],
    ],
  },
  {
    id: "accents",
    name: "Accents",
    items: [
      [R`\hat{a}`, "hat", "", "circumflex"], [R`\widehat{abc}`, "wide hat", "", ""], [R`\bar{a}`, "bar", "", "mean"], [R`\overline{abc}`, "overline", "", ""], [R`\underline{abc}`, "underline", "", ""],
      [R`\tilde{a}`, "tilde", "", ""], [R`\widetilde{abc}`, "wide tilde", "", ""], [R`\vec{a}`, "vector arrow", "", ""], [R`\dot{a}`, "dot", "", "time derivative"], [R`\ddot{a}`, "double dot", "", ""],
      [R`\check{a}`, "check", "", "caron"], [R`\breve{a}`, "breve", "", ""], [R`\acute{a}`, "acute", "", ""], [R`\grave{a}`, "grave", "", ""], [R`\overbrace{a+b}^{n}`, "overbrace", "", ""], [R`\underbrace{a+b}_{n}`, "underbrace", "", ""],
    ],
  },
  {
    id: "misc",
    name: "Dots & misc",
    items: [
      [R`\ldots`, "low dots", "…", "ellipsis"], [R`\cdots`, "centred dots", "⋯", "ellipsis"], [R`\vdots`, "vertical dots", "⋮", ""], [R`\ddots`, "diagonal dots", "⋱", ""], [R`\angle`, "angle", "∠", ""],
      [R`\triangle`, "triangle", "△", ""], [R`\square`, "square", "□", "qed"], [R`\hbar`, "h-bar", "ℏ", "planck reduced"], [R`\ell`, "script l", "ℓ", ""], [R`\Re`, "real part", "ℜ", ""],
      [R`\Im`, "imaginary part", "ℑ", ""], [R`\aleph`, "aleph", "ℵ", ""], [R`\wp`, "Weierstrass p", "℘", ""], [R`^{\circ}`, "degree", "°", "temperature"], [R`\%`, "percent", "%", ""],
      [R`\$`, "dollar", "$", ""], [R`\&`, "ampersand", "&", ""], [R`\#`, "hash", "#", ""], [R`\_`, "underscore", "_", ""], [R`\checkmark`, "check mark", "✓", "tick"],
    ],
  },
  {
    id: "spaces",
    name: "Spacing",
    items: [
      [R`\,`, "thin space", "", "3/18 em"], [R`\:`, "medium space", "", "4/18 em"], [R`\;`, "thick space", "", "5/18 em"], [R`\quad`, "1 em space", "", ""], [R`\qquad`, "2 em space", "", ""], [R`\!`, "negative thin space", "", ""],
    ],
  },
];

// Unicode character to LaTeX command, from the table above plus the few that MathML writes differently.
export const CHAR_TO_TEX = (() => {
  const m = {};
  for (const g of SYMBOL_GROUPS)
    for (const [cmd, , ch] of g.items) {
      if (ch && ch.length <= 2 && !/^\\mathbb/.test(cmd) && !(ch in m)) m[ch] = cmd;
    }
  for (const c of ["%", "$", "&", "#", "_"]) m[c] = `\\${c}`;
  Object.assign(m, {
    "−": "-", "∣": "\\mid", "|": "|", "‖": "\\Vert", "∥": "\\parallel", "ℝ": "\\mathbb{R}", "ℤ": "\\mathbb{Z}", "ℕ": "\\mathbb{N}", "ℚ": "\\mathbb{Q}", "ℂ": "\\mathbb{C}", "′": "'", "″": "''",
    "⁡": "", "⁢": "", "⁣": ",", "⁤": "", " ": "~", "⁡": "", "≦": "\\leqq", "≧": "\\geqq", "⩽": "\\leqslant", "⩾": "\\geqslant", "≤": "\\leq", "≥": "\\geq", "*": "*", "ϵ": "\\epsilon", "∘": "\\circ", "⟨": "\\langle", "⟩": "\\rangle", "〈": "\\langle", "〉": "\\rangle", "…": "\\ldots", "⋯": "\\cdots", "{": "\\{", "}": "\\}", "\\": "\\backslash", "°": "^{\\circ}", "∕": "/",
  });
  return m;
})();
