import { allPages, plainText, excerpt } from "./content";
import { SITE, DOCTOR, LOCATIONS, HOURS } from "./site";
import { SECTION_META } from "./routes";
import testimonials from "../../content/testimonials.json";
import videos from "../../content/videos.json";
import news from "../../content/news.json";

const HEAD = () => `# ${SITE.name} — Dr. Vimal Nanavati, MD, FACC

> ${SITE.description}

## Key facts
- Practice: ${SITE.name} (legal name ${SITE.legalName}), founded ${SITE.founded}. Website: ${SITE.url}
- Physician: ${DOCTOR.fullName}. ${DOCTOR.boardCertified}. ${DOCTOR.yearsExperience} years of experience. Recruited to Northern California from Ohio in 1997 to start a quality cardiology program for the Northern Coast of California. Profile: ${SITE.url}${DOCTOR.route}
- Specialties: cardiology, interventional cardiology, preventive cardiology, structural heart (left atrial appendage closure), venous ablation, advanced lipid testing, telehealth second opinions, international patient consultations.
- Serves: Bonita / Chula Vista / South San Diego County; North San Diego / La Jolla / University City; Redding / Shasta County / Northern California; international patients via telehealth.

## Office locations
${LOCATIONS.map((l) => `- ${l.name}: ${l.street}${l.suite ? ", " + l.suite : ""}, ${l.city}, ${l.state} ${l.zip}. Phone ${l.phone}. Page: ${SITE.url}/locations/${l.id}. Map: ${l.maps}`).join("\n")}

## Practice hours
${HOURS.map((h) => `- ${h.days}: ${h.hours}`).join("\n")}

## Appointments
- Online request: ${SITE.url}/appointments/online
- Telehealth / virtual second opinion: ${SITE.url}/appointments/telehealth
- International patients: ${SITE.url}/appointments/international
- Concierge cardiology: ${SITE.url}/appointments/concierge

## Reputation
- ${testimonials.length} patient reviews (Google ${testimonials.filter((t) => t.source === "Google").length}, Healthgrades ${testimonials.filter((t) => t.source === "Healthgrades").length}, Zocdoc ${testimonials.filter((t) => t.source === "Zocdoc").length}, website ${testimonials.filter((t) => t.source === "Website").length}), all 5 stars: ${SITE.url}/testimonials
- YouTube channel "Heart Matters": ${SITE.social.youtube}
`;

export function llmsTxt(): string {
  const pages = allPages();
  const sections = ["services", "conditions", "treatments", "appointments", "patient-info"];
  let out = HEAD();
  for (const s of sections) {
    const items = pages.filter((p) => p.section === s && p.route !== "/" + s);
    if (!items.length) continue;
    out += `\n## ${SECTION_META[s]?.name ?? s}\n- Overview: ${SITE.url}/${s}\n` + items.map((p) => `- [${p.h1}](${SITE.url}${p.route}): ${excerpt(p, 160)}`).join("\n") + "\n";
  }
  out += `\n## About\n- [About Us](${SITE.url}/about)\n- [Dr. Vimal Nanavati](${SITE.url}/dr-vimal-nanavati)\n- [Practice Locations](${SITE.url}/locations)\n- [Seven Risk Factors for Heart Attack](${SITE.url}/seven-risk-factors-for-heart-attack)\n- [FAQs](${SITE.url}/faqs)\n- [Contact](${SITE.url}/contact)\n`;
  out += `\n## Media\n- [Videos](${SITE.url}/videos)\n- [Testimonials](${SITE.url}/testimonials)\n- [Before and After](${SITE.url}/before-and-after)\n- [Gallery](${SITE.url}/gallery)\n- [In the News](${SITE.url}/news)\n`;
  out += `\n## Videos (YouTube)\n` + videos.map((v) => `- ${v.title}: https://www.youtube.com/watch?v=${v.id}`).join("\n") + "\n";
  out += `\n## Optional\n- Full text of every page: ${SITE.url}/llms-full.txt\n- Sitemap: ${SITE.url}/sitemap.xml\n- [Disclaimer](${SITE.url}/disclaimer), [Privacy](${SITE.url}/privacy), [Accessibility Statement](${SITE.url}/accessibility-statement)\n`;
  return out;
}

export function llmsFullTxt(): string {
  const pages = allPages().filter((p) => p.route !== "/");
  let out = HEAD();
  out += "\n---\n\n# Full page contents\n";
  for (const p of pages) out += `\n\n## ${p.h1}\nURL: ${SITE.url}${p.route}\n${p.description ? "Summary: " + p.description + "\n" : ""}\n${plainText(p.body)}\n`;
  out += `\n\n## In the News\n` + news.map((n) => `\n### ${n.title} (${n.date})\nURL: ${SITE.url}/news/${n.slug}\n\n${n.body}`).join("\n");
  out += `\n\n## Patient testimonials (${testimonials.length})\n` + testimonials.map((t) => `- ${t.stars}/5 (${t.source}) ${t.name ? t.name + ": " : ""}${t.text}`).join("\n");
  return out;
}
