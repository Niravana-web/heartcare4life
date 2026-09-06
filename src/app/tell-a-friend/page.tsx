import PageHeader from "@/components/PageHeader";
import Form from "@/components/Form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: "Tell a Friend", description: "Tell a friend about Dr. Vimal Nanavati, interventional cardiologist at HeartCare4life in Bonita, San Diego and Redding, CA.", route: "/tell-a-friend" });

export default function TellAFriend() {
  return (
    <>
      <PageHeader title="Tell a Friend" lede="Know someone who could use a good cardiologist? Send them a note about HeartCare4life." crumbs={[{ name: "Home", route: "/" }, { name: "Tell a Friend", route: "/tell-a-friend" }]} />
      <div className="container-x max-w-[880px] py-14">
        <Form kind="tell-a-friend" submitLabel="Send" fields={[{ name: "yourName", label: "Your name", required: true }, { name: "yourEmail", label: "Your email", type: "email", required: true }, { name: "friendName", label: "Friend's name", required: true }, { name: "friendEmail", label: "Friend's email", type: "email", required: true }, { name: "message", label: "Message", type: "textarea" }]} />
      </div>
    </>
  );
}
