import PageHeader from "@/components/PageHeader";
import Form from "@/components/Form";
import LocationsBlock from "@/components/LocationsBlock";
import JsonLd from "@/components/JsonLd";
import { buildMetadata, graph, webPageLd } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Request an Appointment Online", description: "Request an appointment online with Dr. Vimal Nanavati, interventional cardiologist at HeartCare4life in Bonita, San Diego and Redding, CA. We will call to confirm your visit.", route: "/appointments/online" });
const LOCS = ["South San Diego (Bonita)", "North San Diego", "Northern California (Redding)", "Telehealth / virtual"];

export default function OnlineAppointment() {
  return (
    <>
      <JsonLd data={graph(webPageLd({ route: "/appointments/online", title: "Online Appointment", description: metadata.description as string, type: "ContactPage" }))} />
      <PageHeader eyebrow="Appointments" title="Online Appointment" lede="To request an appointment, please enter your information and press Submit. Your name and phone number or email are required so that we can contact you to confirm your appointment." crumbs={[{ name: "Home", route: "/" }, { name: "Appointments", route: "/appointments" }, { name: "Online Appointment", route: "/appointments/online" }]} />
      <div className="container-x max-w-[880px] py-14" id="Online-Appointment">
        <Form kind="appointment" submitLabel="Request appointment" fields={[
          { name: "name", label: "Full name", required: true },
          { name: "phone", label: "Phone", type: "tel", required: true },
          { name: "email", label: "Email", type: "email" },
          { name: "dob", label: "Date of birth", type: "date" },
          { name: "location", label: "Preferred office", type: "select", options: LOCS },
          { name: "date", label: "Preferred date", type: "date" },
          { name: "reason", label: "Reason for visit / questions", type: "textarea", placeholder: "Symptoms, referring physician, insurance, or anything we should know." },
        ]} />
      </div>
      <LocationsBlock compact />
    </>
  );
}
