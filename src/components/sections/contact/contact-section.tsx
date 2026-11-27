import ContactForm from "@/components/sections/contact/contact-form";
import ContactInfo from "@/components/sections/contact/contact-info";
import SectionHeading from "@/components/shared/section-heading";

// Contact section: heading, the info column and the message
// form side by side on desktop, stacked on mobile.
const ContactSection = () => {
	return (
		<section className="contact-section" id="contact">
			<SectionHeading sectionName="contact" />

			<div className="contact-content flex flex-col md:flex-row gap-6">
				<ContactInfo />

				<ContactForm />
			</div>
		</section>
	);
};

export default ContactSection;
