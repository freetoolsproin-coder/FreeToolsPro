import {
  User,
  Gauge,
  Droplet,
  Brain,
  Percent,
  IndianRupee,
  ReceiptIndianRupee,
  CircleGauge,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    path: "/age-calculator",
    label: "Age",
    fullLabel: "Age Calculator",
    description: "Calculate exact age, next birthday and total time lived",
    icon: User,
  },
  {
    path: "/bmi-calculator",
    label: "BMI",
    fullLabel: "BMI Calculator",
    description: "Check your Body Mass Index instantly",
    icon: Gauge,
  },
  {
    path: "/calorie-calculator",
    label: "Calories",
    fullLabel: "Calorie Calculator",
    description: "Calculate daily calorie needs",
    icon: Droplet,
  },
  {
    path: "/sip-calculator",
    label: "SIP",
    fullLabel: "SIP Calculator",
    description: "Estimate SIP mutual fund returns",
    icon: Brain,
  },
  {
    path: "/emi-calculator",
    label: "EMI",
    fullLabel: "EMI Calculator",
    description: "Calculate loan EMI instantly",
    icon: Percent,
  },
  {
    path: "/salary-calculator",
    label: "Salary",
    fullLabel: "Salary Calculator",
    description: "Calculate in-hand salary from CTC",
    icon: IndianRupee,
  },
  {
    path: "/gst-calculator",
    label: "GST",
    fullLabel: "GST Calculator",
    description: "Calculate GST amount easily",
    icon: ReceiptIndianRupee,
  },
  {
    path: "/speed-test",
    label: "Speed",
    fullLabel: "Internet Speed Test",
    description: "Check download & upload speed",
    icon: CircleGauge,
  },
];
