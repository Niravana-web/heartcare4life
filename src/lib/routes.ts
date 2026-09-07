/** Routes that have a hand-built page and must not be rendered by the catch-all. */
export const CUSTOM_ROUTES = new Set([
  "/", "/testimonials", "/testimonials/submit", "/videos", "/news", "/contact", "/locations",
  "/appointments/online", "/appointments/general", "/feedback", "/tell-a-friend", "/faqs", "/site-map", "/media", "/patient-info",
]);

export const SECTION_META: Record<string, { name: string; eyebrow: string; schemaType?: "MedicalProcedure" | "MedicalCondition" | "MedicalTherapy" }> = {
  services: { name: "Services", eyebrow: "Diagnostic & interventional cardiology", schemaType: "MedicalProcedure" },
  conditions: { name: "Conditions", eyebrow: "Heart conditions we diagnose and treat", schemaType: "MedicalCondition" },
  treatments: { name: "Treatments", eyebrow: "Treatment options", schemaType: "MedicalTherapy" },
  appointments: { name: "Appointments", eyebrow: "Visit options" },
  "patient-info": { name: "Patient Info", eyebrow: "Education & resources" },
  media: { name: "Media", eyebrow: "Videos, news and stories" },
  compare: { name: "Compare", eyebrow: "Weighing your options" },
};

/**
 * Non-invasive diagnostic services. Everything else under /services is treated as
 * an interventional (percutaneous) procedure for schema.org procedureType.
 */
export const DIAGNOSTIC_SLUGS = new Set([
  "7-10-day-ambulatory-rhythm-monitor", "advanced-lipid-testing", "advanced-stress-testing",
  "ankle-brachial-index-abi", "arterial-ultrasound", "cardiac-rehabilitation",
  "carotid-ultrasound-doppler", "coronary-ct-angiography", "defibrillator-interrogation",
  "echocardiogram", "electrocardiogram-ecg-ekg", "holter-monitoring", "ihd-evaluation",
  "nuclear-stress-test", "pacemaker-interrogation", "transthoracic-echocardiography",
  "treadmill-stress-test", "vascular-ultrasound", "venous-ultrasound",
]);

export function crumbsFor(route: string, h1: string) {
  const parts = route.split("/").filter(Boolean);
  const crumbs = [{ name: "Home", route: "/" }];
  if (parts.length > 1) {
    const s = SECTION_META[parts[0]];
    crumbs.push({ name: s?.name ?? parts[0], route: "/" + parts[0] });
  }
  crumbs.push({ name: h1, route });
  return crumbs;
}
