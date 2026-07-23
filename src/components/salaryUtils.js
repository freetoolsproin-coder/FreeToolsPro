// ===============================
// HRA CALCULATION
// ===============================
export function calculateHRA({ basic, hraReceived, rentPaid, isMetro }) {
  const percentBasic = isMetro ? 0.5 : 0.4;

  const option1 = hraReceived;
  const option2 = basic * percentBasic;
  const option3 = rentPaid - 0.1 * basic;

  const exemption = Math.min(option1, option2, option3);

  return {
    exemption: Math.max(0, exemption),
    taxableHRA: hraReceived - Math.max(0, exemption),
  };
}

// ===============================
// TAX CALCULATION
// ===============================
export function calculateTax(income, regime, deductions = 0) {
  let taxableIncome = regime === "old" ? income - deductions : income;

  taxableIncome = Math.max(0, taxableIncome);

  let tax = 0;

  if (regime === "new") {
    if (taxableIncome <= 300000) return 0;
    if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
    else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.1;
    else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15;
    else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.2;
    else tax = 150000 + (taxableIncome - 1500000) * 0.3;
  } else {
    if (taxableIncome <= 250000) return 0;
    if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
    else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2;
    else tax = 112500 + (taxableIncome - 1000000) * 0.3;
  }

  return Math.round(tax);
}

// ===============================
// MAIN SALARY ENGINE
// ===============================
export function calculateSalary({ monthlySalary, rentPaid, isMetro, regime, deductions }) {
  const basic = monthlySalary * 0.4;
  const hra = basic * 0.4;

  const employerPF = basic * 0.12;
  const employeePF = basic * 0.12;

  const hraCalc = calculateHRA({
    basic,
    hraReceived: hra,
    rentPaid,
    isMetro,
  });

  const annualIncome = monthlySalary * 12;

  const taxableIncome = annualIncome - hraCalc.exemption;

  const tax = calculateTax(taxableIncome, regime, deductions);

  const takeHomeAnnual = annualIncome - tax - employeePF * 12;

  return {
    monthly: {
      basic,
      hra,
      employerPF,
    },
    hra: hraCalc,
    annual: {
      income: annualIncome,
      tax,
      takeHome: takeHomeAnnual,
      employeePF: employeePF * 12,
    },
  };
}

// ===============================
// PDF DOWNLOAD
// ===============================
export function downloadPDF(result) {
  import('jspdf').then(jsPDF => {
    const doc = new jsPDF.default();

    doc.text("Salary Report", 20, 20);
    doc.text(`Income: ₹${result.annual.income}`, 20, 40);
    doc.text(`Tax: ₹${result.annual.tax}`, 20, 50);
    doc.text(`Take Home: ₹${result.annual.takeHome}`, 20, 60);

    doc.save("salary.pdf");
  });
}

// ===============================
// EXCEL EXPORT
// =G==============================
export function exportToExcel(result) {
  import('xlsx').then(XLSX => {
    const data = [
      ["Income", result.annual.income],
      ["Tax", result.annual.tax],
      ["Take Home", result.annual.takeHome],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Salary");

    XLSX.writeFile(wb, "salary.xlsx");
  });
}

// ===============================
// SHARE LINK
// ===============================
export function generateShareLink(result) {
  const encoded = btoa(JSON.stringify(result));
  return `${window.location.origin}?data=${encoded}`;
}

// ===============================
// INSIGHTS
// ===============================
export function generateInsights(result) {
  return [
    `You pay ₹${result.annual.tax} in tax yearly`,
    `PF savings: ₹${result.annual.employeePF}`,
    `Monthly take-home: ₹${Math.round(result.annual.takeHome / 12)}`,
  ];
}
