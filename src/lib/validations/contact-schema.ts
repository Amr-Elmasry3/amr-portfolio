import { useTranslations } from "next-intl";
import * as Yup from "yup";

// Yup schema for the contact form, with the translated
// validation messages. Ported from the previous version.
export const useContactSchema = () => {
	const t = useTranslations("Contact.contactForm");

	return Yup.object({
		name: Yup.string()
			.min(2, t("validation.nameMin"))
			.required(t("validation.nameRequired")),
		email: Yup.string()
			.email(t("validation.emailInvalid"))
			.required(t("validation.emailRequired")),
		message: Yup.string()
			.min(10, t("validation.messageMin"))
			.required(t("validation.messageRequired")),
	});
};
