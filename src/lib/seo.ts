import type { Metadata } from "next";
import { SITE, DOCTOR, LOCATIONS, OPENING_SPEC, SATURDAY_SPEC, REVIEWED } from "./site";

export function trimDesc(d: string, max = 158): string {
  d = d.replace(/\s+/g, " ").replace(/\s*\.php\s*/g, " / ").trim();
  if (d.length <= max) return d;
  const cut = d.slice(0, max);
  const end = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "));
  return (end > 80 ? cut.slice(0, end + 1) : cut.replace(/\s\S*$/, "") + "…").trim();
}
export const abs = (p: string) => (p.startsWith("http") ? p : SITE.url + p);

export function buildMetadata(opts: {
  title: string;
  description: string;
  route: string;
  image?: string;
  type?: "website" | "article";
  noBrand?: boolean;
}): Metadata {
  const title = opts.noBrand || opts.title.includes(SITE.name) ? opts.title : `${opts.title} | ${SITE.name}`;
  const description = trimDesc(opts.description);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: abs(opts.route) },
    openGraph: {
      title,
      description,
      url: abs(opts.route),
      siteName: SITE.name,
      type: opts.type ?? "website",
      locale: "en_US",
      images: [{ url: abs(opts.image ?? SITE.ogImage), alt: `${DOCTOR.name} — ${SITE.name}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [abs(opts.image ?? SITE.ogImage)] },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  };
}

/* ---------- JSON-LD builders ---------- */
const ID = {
  org: SITE.url + "/#organization",
  doctor: SITE.url + "/#physician",
  website: SITE.url + "/#website",
  loc: (id: string) => `${SITE.url}/locations/${id}#clinic`,
};

export function locationLd(l: (typeof LOCATIONS)[number]) {
  return {
    "@type": ["MedicalClinic", "LocalBusiness"],
    "@id": ID.loc(l.id),
    name: `${SITE.name} — ${l.name}`,
    alternateName: `${SITE.legalName}: Vimal Nanavati, MD`,
    url: abs(`/locations/${l.id}`),
    telephone: l.phone,
    image: abs(SITE.ogImage),
    address: {
      "@type": "PostalAddress",
      streetAddress: l.suite ? `${l.street}, ${l.suite}` : l.street,
      addressLocality: l.city,
      addressRegion: l.state,
      postalCode: l.zip,
      addressCountry: "US",
    },
    ...(l.geo ? { geo: { "@type": "GeoCoordinates", latitude: l.geo.lat, longitude: l.geo.lng } } : {}),
    priceRange: "$$",
    hasMap: l.maps,
    openingHoursSpecification: [
      ...OPENING_SPEC.map((s) => ({ "@type": "OpeningHoursSpecification", ...s })),
      ...(l.saturdays ? [{ "@type": "OpeningHoursSpecification", ...SATURDAY_SPEC }] : []),
    ],
    medicalSpecialty: ["Cardiovascular", "Cardiology", "Interventional Cardiology"],
    parentOrganization: { "@id": ID.org },
    physician: { "@id": ID.doctor },
  };
}

export function organizationLd() {
  return {
    "@type": ["MedicalOrganization", "MedicalBusiness"],
    "@id": ID.org,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: abs(SITE.logo),
    image: abs(SITE.ogImage),
    description: SITE.description,
    foundingDate: String(SITE.founded),
    telephone: LOCATIONS[0].phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: LOCATIONS[0].suite ? `${LOCATIONS[0].street}, ${LOCATIONS[0].suite}` : LOCATIONS[0].street,
      addressLocality: LOCATIONS[0].city,
      addressRegion: LOCATIONS[0].state,
      postalCode: LOCATIONS[0].zip,
      addressCountry: "US",
    },
    medicalSpecialty: ["Cardiovascular", "Cardiology", "Interventional Cardiology"],
    areaServed: ["San Diego County, CA", "Chula Vista, CA", "Bonita, CA", "Redding, CA", "Shasta County, CA", "Northern California", "International patients"],
    sameAs: Object.values(SITE.social),
    founder: { "@id": ID.doctor },
    employee: { "@id": ID.doctor },
    location: LOCATIONS.map((l) => ({ "@id": ID.loc(l.id) })),
    contactPoint: LOCATIONS.map((l) => ({ "@type": "ContactPoint", telephone: l.phone, contactType: "appointments", areaServed: l.city + ", CA", availableLanguage: "English" })),
  };
}

export function physicianLd() {
  return {
    "@type": ["Physician", "Person"],
    "@id": ID.doctor,
    name: DOCTOR.fullName,
    alternateName: [DOCTOR.name, "Vimal Nanavati MD", "Dr. V. Nanavati"],
    givenName: DOCTOR.givenName,
    familyName: DOCTOR.familyName,
    honorificPrefix: "Dr.",
    honorificSuffix: "MD, FACC",
    jobTitle: DOCTOR.jobTitle,
    description: `${DOCTOR.fullName} is ${DOCTOR.boardCertified.toLowerCase()} with ${DOCTOR.yearsExperience} years of experience. Recruited to Northern California from Ohio in 1997, he founded ${SITE.name} (${SITE.legalName}) and practices in Bonita, San Diego and Redding, California.`,
    image: abs(DOCTOR.image),
    url: abs(DOCTOR.route),
    medicalSpecialty: ["Cardiovascular", "Cardiology", "Interventional Cardiology"],
    knowsAbout: ["Coronary artery disease", "Coronary stenting", "Angioplasty", "Left atrial appendage closure", "Atrial fibrillation", "Venous ablation", "Advanced lipid testing", "Echocardiography", "Stress testing", "Preventive cardiology", "Telehealth cardiology second opinions"],
    worksFor: { "@id": ID.org },
    affiliation: { "@id": ID.org },
    // Own clinics belong in workLocation. The schema.org property for external
    // hospitals is intentionally not used here, since no external affiliation is verified.
    workLocation: LOCATIONS.map((l) => ({ "@id": ID.loc(l.id) })),
    hasCredential: DOCTOR.credentials.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      credentialCategory: c.category,
      name: c.name,
      recognizedBy: { "@type": "Organization", name: c.by },
    })),
    ...(DOCTOR.npi
      ? { identifier: { "@type": "PropertyValue", propertyID: "NPI", value: DOCTOR.npi, url: `https://npiregistry.cms.hhs.gov/provider-view/${DOCTOR.npi}` } }
      : {}),
    sameAs: [SITE.social.linkedin, SITE.social.youtube, SITE.social.x, SITE.social.instagram, SITE.social.facebook],
  };
}

export function websiteLd() {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: SITE.url,
    name: SITE.name,
    publisher: { "@id": ID.org },
    inLanguage: "en-US",
  };
}

export function breadcrumbLd(items: { name: string; route: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.route) })),
  };
}

export function webPageLd(opts: { route: string; title: string; description: string; type?: string; about?: object; dateModified?: string; extra?: object }) {
  return {
    "@type": opts.type ?? "MedicalWebPage",
    "@id": abs(opts.route) + "#webpage",
    url: abs(opts.route),
    name: opts.title,
    description: opts.description,
    isPartOf: { "@id": ID.website },
    about: opts.about ?? { "@id": ID.org },
    author: { "@id": ID.doctor },
    reviewedBy: { "@id": ID.doctor },
    publisher: { "@id": ID.org },
    inLanguage: "en-US",
    audience: { "@type": "MedicalAudience", audienceType: "Patient" },
    dateModified: opts.dateModified ?? REVIEWED,
    ...(opts.extra ?? {}),
  };
}

export function faqLd(pairs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: pairs.map((p) => ({ "@type": "Question", name: p.q, acceptedAnswer: { "@type": "Answer", text: p.a } })),
  };
}

export function videoLd(v: { id: string; title: string; channel: string; uploadDate?: string | null; duration?: string | null; description?: string }) {
  return {
    "@type": "VideoObject",
    name: v.title,
    description: v.description || `${v.title} — ${v.channel}`,
    thumbnailUrl: [`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`],
    uploadDate: v.uploadDate ?? "2025-01-01",
    ...(v.duration ? { duration: v.duration } : {}),
    embedUrl: `https://www.youtube.com/embed/${v.id}`,
    contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
    publisher: { "@id": ID.org },
    author: { "@id": ID.doctor },
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export { ID };
