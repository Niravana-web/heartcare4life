import PageHeader from "@/components/PageHeader";
import Form from "@/components/Form";
import Prose from "@/components/Prose";
import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const page = getPage("/testimonials/submit")!;
export const metadata = buildMetadata({ title: "Submit Your Testimonial", description: page.description, route: "/testimonials/submit" });

export default function Submit() {
  return (
    <>
      <PageHeader eyebrow="Testimonials" title="Submit Your Testimonial" crumbs={[{ name: "Home", route: "/" }, { name: "Patient Testimonials", route: "/testimonials" }, { name: "Submit", route: "/testimonials/submit" }]} />
      <div className="container-x max-w-[880px] py-14">
        <Prose body={page.body} className="mb-10" />
        <Form kind="testimonial" submitLabel="Submit testimonial" fields={[{ name: "name", label: "Name (initials are fine)", required: true }, { name: "email", label: "Email", type: "email" }, { name: "rating", label: "Rating", type: "select", options: ["5 stars", "4 stars", "3 stars", "2 stars", "1 star"] }, { name: "testimonial", label: "Your testimonial", type: "textarea", required: true }, { name: "consent", label: "May we publish this on our website? (Yes / No)", required: true }]} />
      </div>
    </>
  );
}
