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
  "nuclear-stress-test", "pacemaker-interrogation", "transesophageal-echocardiography",
  "transthoracic-echocardiography",
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

/**
 * Which comparison pages are relevant to a given service or condition page.
 * Rendered as a related block by the catch-all, so the link exists without
 * every clinical page having to hand-maintain it in prose.
 */
const COMPARE: Record<string, string[]> = {
  "angioplasty-vs-bypass-surgery": ["services/angioplasty", "services/coronary-stenting", "services/ptca", "conditions/coronary-artery-disease"],
  "stent-vs-medication": ["services/coronary-stenting", "services/angioplasty", "conditions/coronary-artery-disease", "conditions/chest-pain"],
  "echocardiogram-vs-ekg": ["services/echocardiogram", "services/electrocardiogram-ecg-ekg", "services/transthoracic-echocardiography", "conditions/heart-murmur"],
  "ct-angiography-vs-invasive-angiogram": ["services/coronary-ct-angiography", "services/transradial-angiogram", "services/transfemoral-angiogram", "conditions/chest-pain"],
  "treadmill-vs-nuclear-stress-test": ["services/treadmill-stress-test", "services/nuclear-stress-test", "services/advanced-stress-testing", "conditions/chest-pain"],
  "holter-vs-event-monitor": ["services/holter-monitoring", "services/7-10-day-ambulatory-rhythm-monitor", "services/loop-recorder-implantation-and-interrogation", "conditions/heart-palpitations", "conditions/arrhythmias"],
  "transradial-vs-transfemoral-angiogram": ["services/transradial-angiogram", "services/transfemoral-angiogram", "services/angioplasty"],
  "watchman-vs-blood-thinners": ["services/left-atrial-appendage-closure", "conditions/atrial-fibrillation"],
  "venous-ablation-vs-vein-stripping": ["services/venous-ablation", "services/venous-ultrasound"],
  "cardiologist-vs-interventional-cardiologist": ["services/cardiology-services", "services/ihd-evaluation"],
};

/**
 * Leaf pages under a clinical section that are catalogues rather than a single
 * procedure. They get a plain MedicalWebPage instead of a MedicalProcedure node.
 */
export const NOT_A_PROCEDURE = new Set(["cardiology-services"]);

/** On-site entities each comparison page weighs, for schema `mentions`. */
export const COMPARE_ENTITIES: Record<string, string[]> = {
  "angioplasty-vs-bypass-surgery": ["/services/angioplasty", "/services/coronary-stenting"],
  "stent-vs-medication": ["/services/coronary-stenting", "/services/angioplasty"],
  "echocardiogram-vs-ekg": ["/services/echocardiogram", "/services/electrocardiogram-ecg-ekg"],
  "ct-angiography-vs-invasive-angiogram": ["/services/coronary-ct-angiography", "/services/transradial-angiogram", "/services/transfemoral-angiogram"],
  "treadmill-vs-nuclear-stress-test": ["/services/treadmill-stress-test", "/services/nuclear-stress-test"],
  "holter-vs-event-monitor": ["/services/holter-monitoring", "/services/7-10-day-ambulatory-rhythm-monitor"],
  "transradial-vs-transfemoral-angiogram": ["/services/transradial-angiogram", "/services/transfemoral-angiogram"],
  "watchman-vs-blood-thinners": ["/services/left-atrial-appendage-closure"],
  "venous-ablation-vs-vein-stripping": ["/services/venous-ablation"],
  "cardiologist-vs-interventional-cardiologist": ["/services/cardiology-services"],
};

/** Comparison pages relevant to a route, e.g. "/services/angioplasty". */
export function comparesFor(route: string): { slug: string; title: string }[] {
  const key = route.replace(/^\//, "");
  const TITLES: Record<string, string> = {
    "angioplasty-vs-bypass-surgery": "Angioplasty vs Bypass Surgery",
    "stent-vs-medication": "Stent vs Medication Alone",
    "echocardiogram-vs-ekg": "Echocardiogram vs EKG",
    "ct-angiography-vs-invasive-angiogram": "CT Angiography vs Invasive Angiogram",
    "treadmill-vs-nuclear-stress-test": "Treadmill vs Nuclear Stress Test",
    "holter-vs-event-monitor": "Holter vs Event Monitor",
    "transradial-vs-transfemoral-angiogram": "Transradial vs Transfemoral Angiogram",
    "watchman-vs-blood-thinners": "Left Atrial Appendage Closure vs Blood Thinners",
    "venous-ablation-vs-vein-stripping": "Venous Ablation vs Vein Stripping",
    "cardiologist-vs-interventional-cardiologist": "Cardiologist vs Interventional Cardiologist",
  };
  return Object.entries(COMPARE)
    .filter(([, routes]) => routes.includes(key))
    .map(([slug]) => ({ slug, title: TITLES[slug] }));
}
