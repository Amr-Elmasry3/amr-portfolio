// Contact channels shown in the contact section's info column.
// Labels are translated in the messages (Contact.contactInfo
// .info, matched by key); values and links live here. The email
// link fixes the old site's stray "www." in the mailto.
interface ContactInfoItem {
	key: string;
	value: string;
	icon: string;
	link: string;
}

export const contactInfo: ContactInfoItem[] = [
	{
		key: "email",
		value: "amrelmasry66@gmail.com",
		icon: "envelopeFill",
		link: "mailto:amrelmasry66@gmail.com",
	},
	{
		key: "phone",
		value: "+20 1026567600",
		icon: "whatsapp",
		link: "https://wa.me/+201026567600",
	},
	{
		key: "linkedin",
		value: "linkedin.com/in/amr-elmasry66",
		icon: "linkedin",
		link: "https://www.linkedin.com/in/amr-elmasry66",
	},
	{
		key: "github",
		value: "github.com/Amr-Elmasry3",
		icon: "github",
		link: "https://github.com/Amr-Elmasry3",
	},
];
