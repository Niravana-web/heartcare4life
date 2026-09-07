export const SITE = {
  name: "HeartCare4life",
  legalName: "Advanced Heart Care, Inc.",
  url: "https://www.heartcare4life.com",
  tagline: "Board Certified in Cardiology and Interventional Cardiology",
  description:
    "Dr. Vimal Nanavati, MD, FACC, is a board-certified interventional cardiologist serving Bonita (South San Diego), Redding (Northern California) and North San Diego, CA. Diagnostic cardiology, coronary stenting, left atrial appendage closure, venous ablation, advanced lipid testing and telehealth second opinions.",
  logo: "/images/heartcare4life-logo.png",
  ogImage: "/images/dr-vimal-nanavati-hme.png",
  founded: 1997,
  social: {
    facebook: "https://www.facebook.com/people/Vimal-Nanavati-MD-Advanced-Heart-Care-Inc/100092422823918/",
    x: "https://x.com/heartdoc530",
    linkedin: "https://www.linkedin.com/in/dr-v-nanavati-74a13591/",
    instagram: "https://www.instagram.com/heartdoc530/",
    youtube: "https://www.youtube.com/@drvnanavati",
  },
};

export const DOCTOR = {
  name: "Dr. Vimal Nanavati",
  fullName: "Vimal Nanavati, MD, FACC",
  givenName: "Vimal",
  familyName: "Nanavati",
  honorific: "Dr.",
  jobTitle: "Interventional Cardiologist",
  specialty: ["Cardiology", "Interventional Cardiology"],
  boardCertified: "Board Certified in Cardiology and Interventional Cardiology",
  yearsExperience: 32,
  image: "/images/dr-vimal-nanavati-prfle.jpg",
  route: "/dr-vimal-nanavati",
  // TODO: practice to supply the 10-digit NPI. Once set, it is emitted as a schema
  // identifier and linked to the CMS NPI Registry. Left undefined so nothing is invented.
  npi: undefined as string | undefined,
  /** Only credentials already asserted in site copy. Do not add unverified ones. */
  credentials: [
    { name: "Board Certified in Cardiovascular Disease", by: "American Board of Internal Medicine", category: "certification" },
    { name: "Board Certified in Interventional Cardiology", by: "American Board of Internal Medicine", category: "certification" },
    { name: "Fellow of the American College of Cardiology (FACC)", by: "American College of Cardiology", category: "membership" },
  ],
};

export type Location = {
  id: string;
  name: string;
  shortName: string;
  street: string;
  suite?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  phoneHref: string;
  maps: string;
  mapEmbed?: string;
  geo?: { lat: number; lng: number };
  saturdays?: boolean;
};

export const LOCATIONS: Location[] = [
  {
    id: "south-san-diego",
    name: "South San Diego (Bonita)",
    shortName: "South San Diego",
    street: "180 Otay Lakes Rd",
    suite: "Ste 110",
    city: "Bonita",
    state: "CA",
    zip: "91902",
    phone: "(619) 585-0476",
    phoneHref: "tel:+16195850476",
    maps: "https://maps.app.goo.gl/ETjFky7KpD1aCHZRA",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1679.5042096214336!2d-117.02975443965836!3d32.65922010000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d94fd518ad25f1%3A0x595f71d90031ba65!2sAdvanced%20Heart%20Care%2C%20Inc.%3A%20Vimal%20Nanavati%2C%20MD!5e0!3m2!1sen!2sin!4v1768637506533!5m2!1sen!2sin",
    geo: { lat: 32.65915, lng: -117.03099 },
  },
  {
    id: "northern-california",
    name: "Northern California (Redding)",
    shortName: "Northern California",
    street: "2510 Airpark Drive",
    suite: "Ste 205",
    city: "Redding",
    state: "CA",
    zip: "96001",
    phone: "(530) 433-5427",
    phoneHref: "tel:+15304335427",
    maps: "https://maps.app.goo.gl/Kr3rajp4NSxJSA8t6",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1515.3391269051044!2d-122.40046133965836!3d40.57078190000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54d2ed9b53e64a5f%3A0x61210bcf801709f1!2sVimal%20Nanavati%2C%20MD%3A%20Advanced%20Heart%20Care%2C%20Inc.!5e0!3m2!1sen!2sin!4v1768637553515!5m2!1sen!2sin",
    geo: { lat: 40.57262, lng: -122.40523 },
    saturdays: true,
  },
  {
    id: "north-san-diego",
    name: "North San Diego",
    shortName: "North San Diego",
    street: "5190 Governor Dr",
    city: "San Diego",
    state: "CA",
    zip: "92122",
    phone: "(619) 585-0476",
    phoneHref: "tel:+16195850476",
    maps: "https://maps.app.goo.gl/6vNxnMM3yZousjau6",
    geo: { lat: 32.85698, lng: -117.18575 },
  },
];

export const HOURS = [
  { days: "Monday – Thursday", hours: "9:00 am – 5:00 pm" },
  { days: "Friday", hours: "9:00 am – 12:00 pm" },
  { days: "Saturday", hours: "Redding office only, by appointment on selected Saturdays — call (530) 433-5427" },
  { days: "Sunday", hours: "Closed" },
];

export const OPENING_SPEC = [
  { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"], opens: "09:00", closes: "17:00" },
  { dayOfWeek: ["Friday"], opens: "09:00", closes: "12:00" },
];

/** Redding only: selected Saturdays by appointment. Mirrors the Saturday row in HOURS. */
export const SATURDAY_SPEC = { dayOfWeek: ["Saturday"], opens: "09:00", closes: "12:00" };

export const NAV = [
  { label: "About", href: "/about", children: [
    { label: "About Us", href: "/about" },
    { label: "Dr. Vimal Nanavati", href: "/dr-vimal-nanavati" },
    { label: "Practice Locations", href: "/locations" },
    { label: "Seven Risk Factors for Heart Attack", href: "/seven-risk-factors-for-heart-attack" },
  ]},
  { label: "Services", href: "/services" },
  { label: "Conditions", href: "/conditions" },
  { label: "Treatments", href: "/treatments" },
  { label: "Compare", href: "/compare" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQs", href: "/faqs" },
  { label: "Media", href: "/media", children: [
    { label: "Videos", href: "/videos" },
    { label: "Before and After", href: "/before-and-after" },
    { label: "Gallery", href: "/gallery" },
    { label: "In the News", href: "/news" },
    { label: "Patient Testimonials", href: "/testimonials" },
  ]},
  { label: "Patient Info", href: "/patient-info" },
  { label: "Contact", href: "/contact" },
];

export const UTILITY_NAV = [
  { label: "International Clients", href: "/appointments/international" },
  { label: "Telehealth", href: "/appointments/telehealth" },
  { label: "Appointments", href: "/appointments" },
];

/** Date the clinical content was last reviewed. Bump when content changes. */
export const REVIEWED = "2026-09-07";
