// Document templates. Fields fill the {{name}} slots; every template also compiles in the LaTeX to PDF tool,
// and uses only standard packages so it builds unchanged in TeX Live, MiKTeX or Overleaf.
const R = String.raw;

const NAME = { id: "name", label: "Full name", def: "Priya Sharma" };
const EMAIL = { id: "email", label: "Email", def: "priya.sharma@example.com" };
const PHONE = { id: "phone", label: "Phone", def: "+91 98765 43210" };
const CITY = { id: "city", label: "City", def: "Bengaluru, India" };
const TITLE = { id: "title", label: "Title", def: "A Study of Numerical Methods" };
const SUBJECT = { id: "subject", label: "Course or subject", def: "Mathematics II" };
const INST = { id: "institution", label: "College or company", def: "Indian Institute of Technology" };

export const TEMPLATES = [
  {
    id: "resume",
    group: "Resume",
    name: "Resume: clean one-page",
    desc: "A plain, ATS-friendly resume for fresher and experienced roles.",
    fields: [NAME, EMAIL, PHONE, CITY, { id: "site", label: "LinkedIn or website", def: "linkedin.com/in/priyasharma" }],
    tex: R`\documentclass[11pt,a4paper]{article}
\usepackage[margin=0.75in]{geometry}
\usepackage[hidelinks]{hyperref}

\newcommand{\resumesection}[1]{\vspace{4pt}\textbf{\large #1}\hrule\vspace{2pt}}
\newcommand{\entry}[4]{\textbf{#1} \hfill #2 \\ \textit{#3} \hfill \textit{#4}}

\begin{document}

\begin{center}
{\LARGE \textbf{{{name}}}} \\
{{city}} | {{phone}} | \href{mailto:{{email}}}{{{email}}} | {{site}}
\end{center}

\resumesection{Summary}

Software engineer with three years of experience building web services. Comfortable owning a feature from design to production.

\resumesection{Experience}

\entry{Software Engineer}{June 2023 -- Present}{Acme Technologies}{Bengaluru}
\begin{itemize}
  \item Reduced API response time by 40\% by adding caching to the three busiest endpoints.
  \item Led the migration of 12 services to containers with no customer-facing downtime.
\end{itemize}

\entry{Software Engineering Intern}{Jan 2023 -- May 2023}{Northwind Systems}{Pune}
\begin{itemize}
  \item Built an internal dashboard used daily by a team of 30.
\end{itemize}

\resumesection{Education}

\entry{B.Tech in Computer Science}{2019 -- 2023}{National Institute of Technology}{CGPA 8.6/10}

\resumesection{Projects}

\begin{itemize}
  \item \textbf{Expense Tracker}: a mobile-first app with 2,000 monthly users.
  \item \textbf{Exam Scheduler}: a timetable generator used by two college departments.
\end{itemize}

\resumesection{Skills}

\textbf{Languages:} Python, JavaScript, SQL, C++ \\
\textbf{Tools:} Git, Docker, AWS, Linux

\end{document}
`,
  },
  {
    id: "resume-academic",
    group: "Resume",
    name: "Academic CV",
    desc: "For research, PhD and faculty applications, with publications.",
    fields: [NAME, EMAIL, { id: "dept", label: "Department", def: "Department of Physics" }, INST],
    tex: R`\documentclass[11pt,a4paper]{article}
\usepackage[margin=1in]{geometry}

\newcommand{\cvsection}[1]{\section*{#1}\vspace{-6pt}\hrule\vspace{4pt}}

\begin{document}

\begin{center}
{\LARGE \textbf{{{name}}}} \\[4pt]
{{dept}}, {{institution}} \\
{{email}}
\end{center}

\cvsection{Research Interests}

Condensed matter physics, numerical simulation, machine learning for materials.

\cvsection{Education}

\textbf{Ph.D. in Physics} \hfill 2021 -- Present \\
{{institution}}

\textbf{M.Sc. in Physics} \hfill 2019 -- 2021 \\
University of Delhi

\cvsection{Publications}

\begin{enumerate}
  \item P. Sharma and A. Rao, Title of the paper, \textit{Journal Name} \textbf{12}, 345 (2025).
  \item P. Sharma, Title of the second paper, \textit{Journal Name} \textbf{8}, 101 (2024).
\end{enumerate}

\cvsection{Teaching}

\begin{itemize}
  \item Teaching assistant, Quantum Mechanics, 2023 and 2024.
\end{itemize}

\cvsection{Awards}

\begin{itemize}
  \item CSIR Junior Research Fellowship, 2021.
\end{itemize}

\end{document}
`,
  },
  {
    id: "cover-letter",
    group: "Letters",
    name: "Cover letter",
    desc: "A formal one-page job application letter.",
    fields: [NAME, EMAIL, PHONE, { id: "company", label: "Company", def: "Acme Technologies" }, { id: "role", label: "Role", def: "Software Engineer" }],
    tex: R`\documentclass[11pt,a4paper]{article}
\usepackage[margin=1in]{geometry}

\begin{document}

\noindent \textbf{{{name}}} \\
{{email}} | {{phone}}

\bigskip

\noindent \today

\bigskip

\noindent Hiring Manager \\
{{company}}

\bigskip

\noindent Dear Hiring Manager,

\medskip

\noindent I am writing to apply for the {{role}} position at {{company}}. Your work on reliable, well-designed products is what draws me to this role.

\medskip

\noindent In my current position I reduced API response times by 40\% and led a migration of twelve services with no downtime. I enjoy clear problem statements, careful engineering and working closely with the people who use what I build.

\medskip

\noindent I would welcome the chance to discuss how I can contribute to your team. Thank you for your time.

\bigskip

\noindent Sincerely, \\
{{name}}

\end{document}
`,
  },
  {
    id: "article",
    group: "Papers",
    name: "Article or research paper",
    desc: "Sections, abstract, equations, a table and references.",
    fields: [TITLE, { id: "author", label: "Author", def: "Priya Sharma" }, INST],
    tex: R`\documentclass[11pt,a4paper]{article}
\usepackage[margin=1in]{geometry}
\usepackage{amsmath,amssymb}
\usepackage{booktabs}

\title{{{title}}}
\author{{{author}} \\ {{institution}}}
\date{\today}

\begin{document}

\maketitle

\begin{abstract}
State the problem, the method and the main result in a few sentences.
\end{abstract}

\section{Introduction}

Introduce the topic and explain why it matters. Earlier work includes the classic text by Press et al.~\cite{press}.

\section{Method}

We solve the equation
\begin{equation}\label{eq:main}
\frac{dy}{dt} = -k y, \qquad y(0) = y_0,
\end{equation}
whose exact solution is $y(t) = y_0 e^{-kt}$.

\section{Results}

Table~\ref{tab:results} compares the error of two methods applied to Equation~\eqref{eq:main}.

\begin{table}[htbp]
  \centering
  \caption{Error by method}
  \label{tab:results}
  \begin{tabular}{lrr}
    \toprule
    Method & Step size & Error \\
    \midrule
    Euler & 0.1 & 0.052 \\
    RK4 & 0.1 & 0.00001 \\
    \bottomrule
  \end{tabular}
\end{table}

\section{Conclusion}

Summarise what was found and what could be done next.

\begin{thebibliography}{9}
\bibitem{press} W. H. Press et al., \textit{Numerical Recipes}, Cambridge University Press, 2007.
\end{thebibliography}

\end{document}
`,
  },
  {
    id: "report",
    group: "Papers",
    name: "Project or lab report",
    desc: "A college project report with a title block and numbered sections.",
    fields: [TITLE, { id: "author", label: "Student name", def: "Priya Sharma" }, { id: "roll", label: "Roll number", def: "21CS1042" }, INST],
    tex: R`\documentclass[12pt,a4paper]{article}
\usepackage[margin=1in]{geometry}
\usepackage{amsmath}

\title{{{title}}}
\author{{{author}} (Roll No. {{roll}}) \\ {{institution}}}
\date{\today}

\begin{document}

\maketitle

\tableofcontents

\section{Aim}

State the aim of the project or experiment.

\section{Theory}

Give the background. For a simple pendulum the period is
\begin{equation}
T = 2\pi \sqrt{\frac{L}{g}}.
\end{equation}

\section{Procedure}

\begin{enumerate}
  \item Set up the apparatus.
  \item Record ten readings.
  \item Repeat for each length.
\end{enumerate}

\section{Observations}

\begin{table}[htbp]
  \centering
  \caption{Readings}
  \begin{tabular}{|c|c|c|}
    \hline
    Length (m) & Time for 10 swings (s) & Period (s) \\
    \hline
    0.50 & 14.2 & 1.42 \\
    1.00 & 20.1 & 2.01 \\
    \hline
  \end{tabular}
\end{table}

\section{Conclusion}

State the result and the main sources of error.

\end{document}
`,
  },
  {
    id: "thesis",
    group: "Papers",
    name: "Thesis outline",
    desc: "A chapter-by-chapter outline for a thesis or dissertation.",
    fields: [TITLE, { id: "author", label: "Author", def: "Priya Sharma" }, { id: "guide", label: "Supervisor", def: "Dr. Anil Kumar" }, INST],
    tex: R`\documentclass[12pt,a4paper]{report}
\usepackage[margin=1.25in]{geometry}
\usepackage{amsmath,amssymb}

\title{{{title}}}
\author{{{author}} \\ Supervisor: {{guide}} \\ {{institution}}}
\date{\today}

\begin{document}

\maketitle

\begin{abstract}
Summarise the thesis in about 300 words.
\end{abstract}

\tableofcontents

\chapter{Introduction}

Set out the problem, the research questions and the structure of the thesis.

\chapter{Literature Review}

Survey the work this thesis builds on.

\chapter{Methodology}

Describe the methods used.

\chapter{Results}

Present the findings.

\chapter{Conclusion}

Summarise the contribution and suggest future work.

\end{document}
`,
  },
  {
    id: "assignment",
    group: "Coursework",
    name: "Assignment or homework",
    desc: "Numbered questions with worked answers and maths.",
    fields: [{ id: "author", label: "Name", def: "Priya Sharma" }, { id: "roll", label: "Roll number", def: "21CS1042" }, SUBJECT, { id: "number", label: "Assignment number", def: "3" }],
    tex: R`\documentclass[11pt,a4paper]{article}
\usepackage[margin=1in]{geometry}
\usepackage{amsmath,amssymb}

\title{{{subject}}: Assignment {{number}}}
\author{{{author}} (Roll No. {{roll}})}
\date{\today}

\begin{document}

\maketitle

\section*{Question 1}

Solve $x^2 - 5x + 6 = 0$.

\medskip

\noindent \textbf{Answer.} Factorising gives
\begin{equation*}
(x - 2)(x - 3) = 0,
\end{equation*}
so $x = 2$ or $x = 3$.

\section*{Question 2}

Evaluate $\int_0^1 x^2 \, dx$.

\medskip

\noindent \textbf{Answer.}
\begin{equation*}
\int_0^1 x^2 \, dx = \left[\frac{x^3}{3}\right]_0^1 = \frac{1}{3}.
\end{equation*}

\end{document}
`,
  },
  {
    id: "exam",
    group: "Coursework",
    name: "Question paper",
    desc: "An exam paper with sections and marks, for teachers and tutors.",
    fields: [INST, SUBJECT, { id: "time", label: "Time allowed", def: "2 hours" }, { id: "marks", label: "Maximum marks", def: "50" }],
    tex: R`\documentclass[11pt,a4paper]{article}
\usepackage[margin=1in]{geometry}
\usepackage{amsmath}

\begin{document}

\begin{center}
{\Large \textbf{{{institution}}}} \\[4pt]
\textbf{{{subject}}} \\[4pt]
Time: {{time}} \hfill Maximum marks: {{marks}}
\end{center}

\hrule

\section*{Section A (2 marks each)}

\begin{enumerate}
  \item Define a continuous function.
  \item Find the derivative of $\sin(3x)$.
\end{enumerate}

\section*{Section B (5 marks each)}

\begin{enumerate}
  \item Evaluate $\displaystyle\int_0^{\pi} \sin x \, dx$.
  \item Solve the system $x + y = 5$, $x - y = 1$.
\end{enumerate}

\end{document}
`,
  },
  {
    id: "letter",
    group: "Letters",
    name: "Formal letter",
    desc: "A plain formal letter, such as an application to a principal or office.",
    fields: [NAME, { id: "to", label: "Addressed to", def: "The Principal" }, INST, { id: "subject", label: "Subject", def: "Request for a bonafide certificate" }],
    tex: R`\documentclass[12pt,a4paper]{article}
\usepackage[margin=1in]{geometry}

\begin{document}

\noindent \today

\bigskip

\noindent To, \\
{{to}} \\
{{institution}}

\bigskip

\noindent \textbf{Subject: {{subject}}}

\bigskip

\noindent Respected Sir or Madam,

\medskip

\noindent State your request in one or two short paragraphs, including any dates and details the reader will need.

\medskip

\noindent Thank you.

\bigskip

\noindent Yours faithfully, \\
{{name}}

\end{document}
`,
  },
  {
    id: "beamer",
    group: "Coursework",
    name: "Presentation slides (Beamer)",
    desc: "A short slide deck. Best built in Overleaf or TeX Live for the full Beamer look.",
    fields: [TITLE, { id: "author", label: "Presenter", def: "Priya Sharma" }, INST],
    tex: R`\documentclass{beamer}
\usepackage{amsmath}

\title{{{title}}}
\author{{{author}}}
\institute{{{institution}}}
\date{\today}

\begin{document}

\begin{frame}
  \titlepage
\end{frame}

\begin{frame}{Outline}
  \begin{itemize}
    \item The problem
    \item Our approach
    \item Results
  \end{itemize}
\end{frame}

\begin{frame}{The key equation}
  \begin{equation*}
    E = mc^2
  \end{equation*}
\end{frame}

\begin{frame}{Conclusion}
  Summarise the main message in one line.
\end{frame}

\end{document}
`,
  },
];

/** Fill {{slots}}, escaping LaTeX special characters in what the user typed. */
export function fillTemplate(t, values) {
  const esc = (s) => String(s ?? "").replace(/\\/g, "\\textbackslash{}").replace(/([%&#_$])/g, "\\$1").replace(/([{}])/g, "\\$1");
  return t.tex.replace(/\{\{(\w+)\}\}/g, (m, k) => (t.fields.some((f) => f.id === k) ? esc(values[k]) : m));
}
