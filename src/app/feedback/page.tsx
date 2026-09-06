import PageHeader from "@/components/PageHeader";
import Form from "@/components/Form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Feedback", description: "We are trying to make our website as helpful and informative as possible. Share your comments or suggestions about heartcare4life.com.", route: "/feedback" });

export default function Feedback() {
  return (
    <>
      <PageHeader title="Feedback" lede="As we constantly endeavor to improve your experience with us, we welcome any comments or suggestions about our website. Your suggestions will be sent to the webmaster for appropriate action." crumbs={[{ name: "Home", route: "/" }, { name: "Feedback", route: "/feedback" }]} />
      <div className="container-x max-w-[880px] py-14">
        <Form kind="feedback" submitLabel="Send feedback" fields={[{ name: "name", label: "Name", required: true }, { name: "email", label: "Email", type: "email", required: true }, { name: "comments", label: "Comments", type: "textarea", required: true }]} />
      </div>
    </>
  );
}
