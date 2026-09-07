import PageHeader from "@/components/PageHeader";
import Prose from "@/components/Prose";
import Form from "@/components/Form";
import LocationsBlock from "@/components/LocationsBlock";
import JsonLd from "@/components/JsonLd";
import { getPage } from "@/lib/content";
import { buildMetadata, graph, webPageLd } from "@/lib/seo";

const page = getPage("/appointments/general")!;
export const metadata = buildMetadata({ title: "General Appointment | What to Expect", description: page.description, route: "/appointments/general" });
const LOCS = ["South San Diego (Bonita)", "North San Diego", "Northern California (Redding)", "Telehealth / virtual"];

export default function GeneralAppointment() {
  return (
    <>
      <JsonLd data={graph(webPageLd({ route: "/appointments/general", title: page.h1, description: page.description }))} />
      <PageHeader eyebrow="Appointments" title={page.h1} crumbs={[{ name: "Home", route: "/" }, { name: "Appointments", route: "/appointments" }, { name: page.h1, route: "/appointments/general" }]} />
      <div className="container-x grid gap-14 py-14 lg:grid-cols-2">
        <Prose body={page.body} />
        <div>
          <h2 className="display mb-6 text-[1.75rem]">Request an appointment</h2>
          <Form kind="general-appointment" submitLabel="Request appointment" fields={[
            { name: "name", label: "Full name", required: true },
            { name: "phone", label: "Phone", type: "tel", required: true },
            { name: "email", label: "Email", type: "email" },
            { name: "location", label: "Preferred office", type: "select", options: LOCS },
            { name: "message", label: "Message", type: "textarea" },
          ]} />
        </div>
      </div>
      <LocationsBlock compact />
    </>
  );
}
