/** Sample / reference datasets for India utility tools (illustrative, not official). */

export const PIN_CODES = [
  { pin: "110001", office: "New Delhi GPO", district: "New Delhi", state: "Delhi" },
  { pin: "400001", office: "Mumbai GPO", district: "Mumbai", state: "Maharashtra" },
  { pin: "560001", office: "Bangalore GPO", district: "Bengaluru Urban", state: "Karnataka" },
  { pin: "600001", office: "Chennai GPO", district: "Chennai", state: "Tamil Nadu" },
  { pin: "700001", office: "Kolkata GPO", district: "Kolkata", state: "West Bengal" },
  { pin: "500001", office: "Hyderabad GPO", district: "Hyderabad", state: "Telangana" },
  { pin: "380001", office: "Ahmedabad GPO", district: "Ahmedabad", state: "Gujarat" },
  { pin: "302001", office: "Jaipur GPO", district: "Jaipur", state: "Rajasthan" },
  { pin: "226001", office: "Lucknow GPO", district: "Lucknow", state: "Uttar Pradesh" },
  { pin: "682001", office: "Ernakulam", district: "Ernakulam", state: "Kerala" },
];

export const GAS_DISTRIBUTORS = [
  { city: "Mumbai", type: "LPG", brand: "Indane", distributor: "Western Suburban Indane Agency", phone: "1800-233-3555" },
  { city: "Mumbai", type: "PNG", brand: "Mahanagar Gas", distributor: "MGL Consumer Care", phone: "022-6156-4000" },
  { city: "Delhi", type: "LPG", brand: "Bharatgas", distributor: "Delhi Bharatgas Agency", phone: "1800-22-4344" },
  { city: "Delhi", type: "PNG", brand: "IGL", distributor: "Indraprastha Gas Ltd", phone: "011-4607-4607" },
  { city: "Bengaluru", type: "LPG", brand: "HP Gas", distributor: "Bengaluru HP Agency", phone: "1800-2333-555" },
  { city: "Hyderabad", type: "LPG", brand: "Indane", distributor: "Secunderabad Indane", phone: "1800-233-3555" },
  { city: "Chennai", type: "PNG", brand: "AGP City Gas", distributor: "AGP Chennai", phone: "044-4000-4000" },
  { city: "Pune", type: "LPG", brand: "Bharatgas", distributor: "Pune Bharatgas", phone: "1800-22-4344" },
];

export const SCHEMES = [
  { name: "PM-KISAN", category: "Agriculture", level: "Central", note: "Income support for landholding farmer families." },
  { name: "Ayushman Bharat (PM-JAY)", category: "Health", level: "Central", note: "Health cover for eligible families." },
  { name: "PMAY-U", category: "Housing", level: "Central", note: "Urban housing assistance under eligible categories." },
  { name: "PMAY-G", category: "Housing", level: "Central", note: "Rural housing for eligible households." },
  { name: "Ujjwala Yojana", category: "Energy", level: "Central", note: "LPG connections for eligible women." },
  { name: "Sukanya Samriddhi", category: "Savings", level: "Central", note: "Girl-child savings account scheme." },
  { name: "APY", category: "Pension", level: "Central", note: "Atal Pension Yojana for unorganised sector." },
  { name: "NPS", category: "Pension", level: "Central", note: "National Pension System voluntary retirement savings." },
  { name: "Stand-Up India", category: "Business", level: "Central", note: "Bank loans for SC/ST and women entrepreneurs." },
  { name: "Mudra Loan", category: "Business", level: "Central", note: "Micro enterprise financing under PMMY." },
];

export const SCHOLARSHIPS = [
  { name: "National Scholarship Portal (NSP)", level: "School/College", category: "General", deadline: "Oct–Dec window (typical)" },
  { name: "INSPIRE Scholarship", level: "Undergraduate", category: "Science", deadline: "As notified" },
  { name: "Post-Matric Scholarship (SC)", level: "College", category: "SC", deadline: "State/NSP cycle" },
  { name: "Post-Matric Scholarship (OBC)", level: "College", category: "OBC", deadline: "State/NSP cycle" },
  { name: "Prime Minister's Scholarship Scheme", level: "College", category: "Defence", deadline: "As notified" },
  { name: "AICTE Pragati", level: "Engineering", category: "Girl students", deadline: "As notified" },
  { name: "UGC NET JRF", level: "Research", category: "Higher education", deadline: "Exam cycle" },
  { name: "State Merit Scholarship", level: "School", category: "Merit", deadline: "State board cycle" },
];

export const HOLIDAYS_2026 = [
  { date: "2026-01-26", name: "Republic Day", type: "Gazetted" },
  { date: "2026-03-03", name: "Holi", type: "Gazetted" },
  { date: "2026-03-21", name: "Id-ul-Fitr*", type: "Gazetted" },
  { date: "2026-04-03", name: "Good Friday", type: "Gazetted" },
  { date: "2026-04-14", name: "Ambedkar Jayanti", type: "Restricted/State" },
  { date: "2026-05-01", name: "Labour Day", type: "State" },
  { date: "2026-08-15", name: "Independence Day", type: "Gazetted" },
  { date: "2026-08-27", name: "Janmashtami", type: "Restricted/State" },
  { date: "2026-10-02", name: "Gandhi Jayanti", type: "Gazetted" },
  { date: "2026-10-19", name: "Dussehra*", type: "Gazetted" },
  { date: "2026-11-08", name: "Diwali*", type: "Gazetted" },
  { date: "2026-12-25", name: "Christmas", type: "Gazetted" },
];

export const FESTIVALS = [
  { month: "January", name: "Makar Sankranti / Pongal", note: "Harvest festivals across regions." },
  { month: "January", name: "Republic Day", note: "National celebration on 26 January." },
  { month: "March", name: "Holi", note: "Festival of colours (date varies)." },
  { month: "April", name: "Ugadi / Gudi Padwa", note: "Regional new year celebrations." },
  { month: "August", name: "Raksha Bandhan", note: "Sibling festival (date varies)." },
  { month: "August", name: "Independence Day", note: "15 August national holiday." },
  { month: "August/September", name: "Onam", note: "Kerala harvest festival." },
  { month: "September/October", name: "Navratri / Durga Puja", note: "Nine nights / regional observances." },
  { month: "October/November", name: "Diwali", note: "Festival of lights (date varies)." },
  { month: "November", name: "Guru Nanak Jayanti", note: "Sikh observance (date varies)." },
  { month: "December", name: "Christmas", note: "25 December." },
];

export const MARKET_INDICES = [
  { name: "Nifty 50", value: "24,812.40", change: "+0.62%", tone: "up" },
  { name: "Sensex", value: "81,456.20", change: "+0.55%", tone: "up" },
  { name: "Nifty Bank", value: "52,140.10", change: "-0.18%", tone: "down" },
  { name: "Nifty IT", value: "42,890.75", change: "+1.12%", tone: "up" },
  { name: "Nifty Midcap 100", value: "56,210.30", change: "+0.41%", tone: "up" },
  { name: "India VIX", value: "13.28", change: "-2.10%", tone: "down" },
];

export const METAL_RATES = {
  gold24kPerGram: 7450,
  gold22kPerGram: 6830,
  silverPerGram: 96.5,
  asOf: "Sample rates for estimation only",
};

export const POWER_SLABS = {
  Maharashtra: [
    { upto: 100, rate: 4.5 },
    { upto: 300, rate: 7.2 },
    { upto: 500, rate: 10.5 },
    { upto: Infinity, rate: 12.8 },
  ],
  Delhi: [
    { upto: 200, rate: 3.5 },
    { upto: 400, rate: 6.5 },
    { upto: 800, rate: 8.5 },
    { upto: Infinity, rate: 10.0 },
  ],
  Karnataka: [
    { upto: 100, rate: 4.2 },
    { upto: 200, rate: 6.8 },
    { upto: 500, rate: 9.5 },
    { upto: Infinity, rate: 11.2 },
  ],
  "Tamil Nadu": [
    { upto: 100, rate: 0 },
    { upto: 200, rate: 4.5 },
    { upto: 500, rate: 7.5 },
    { upto: Infinity, rate: 10.5 },
  ],
  Gujarat: [
    { upto: 100, rate: 3.8 },
    { upto: 250, rate: 5.5 },
    { upto: 500, rate: 8.0 },
    { upto: Infinity, rate: 10.2 },
  ],
  "Uttar Pradesh": [
    { upto: 100, rate: 4.0 },
    { upto: 300, rate: 6.5 },
    { upto: 500, rate: 8.8 },
    { upto: Infinity, rate: 11.0 },
  ],
  Telangana: [
    { upto: 100, rate: 3.5 },
    { upto: 200, rate: 6.0 },
    { upto: 400, rate: 8.5 },
    { upto: Infinity, rate: 10.5 },
  ],
  "West Bengal": [
    { upto: 100, rate: 5.0 },
    { upto: 300, rate: 7.5 },
    { upto: 500, rate: 9.0 },
    { upto: Infinity, rate: 11.5 },
  ],
};

export const CITIES_GEO = {
  Mumbai: { lat: 19.076, lon: 72.8777 },
  Delhi: { lat: 28.6139, lon: 77.209 },
  Bengaluru: { lat: 12.9716, lon: 77.5946 },
  Hyderabad: { lat: 17.385, lon: 78.4867 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
  Kolkata: { lat: 22.5726, lon: 88.3639 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Ahmedabad: { lat: 23.0225, lon: 72.5714 },
  Jaipur: { lat: 26.9124, lon: 75.7873 },
  Lucknow: { lat: 26.8467, lon: 80.9462 },
};

export const AQI_SAMPLES = [
  { city: "Delhi", aqi: 268, category: "Poor" },
  { city: "Mumbai", aqi: 112, category: "Moderate" },
  { city: "Bengaluru", aqi: 74, category: "Satisfactory" },
  { city: "Kolkata", aqi: 156, category: "Moderate" },
  { city: "Chennai", aqi: 68, category: "Satisfactory" },
  { city: "Lucknow", aqi: 221, category: "Poor" },
];
