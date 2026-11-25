"use client";

import emailjs from "@emailjs/browser";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useContactSchema } from "@/lib/validations/contact-schema";

// Formik wiring for the contact form: validates with the Yup
// schema and sends through EmailJS (service/template/key come
// from the NEXT_PUBLIC_EMAILJS_* env vars). Shows a success or
// error status that clears itself after 8 seconds. Ported from
// the previous version of the site.
type ContactFormValues = {
	name: string;
	email: string;
	message: string;
};

const initialValues: ContactFormValues = {
	name: "",
	email: "",
	message: "",
};

type ContactFormStatus = {
	type: "success" | "error";
	message: string;
};

const getEmailJsConfig = () => {
	const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
	const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
	const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

	if (!serviceId || !templateId || !publicKey) {
		throw new Error("EmailJS environment variables are not configured.");
	}

	return { serviceId, templateId, publicKey };
};

export const useContactForm = () => {
	const t = useTranslations("Contact.contactForm");

	const validationSchema = useContactSchema();

	const [status, setStatus] = useState<ContactFormStatus | undefined>();

	const formik = useFormik<ContactFormValues>({
		initialValues,
		validationSchema,
		onSubmit: async (values, { resetForm }) => {
			setStatus(undefined);

			try {
				const { serviceId, templateId, publicKey } = getEmailJsConfig();

				await emailjs.send(serviceId, templateId, values, { publicKey });
				resetForm();
				setStatus({ type: "success", message: t("success") });
			} catch (error) {
				console.error("Failed to send contact form", error);
				setStatus({ type: "error", message: t("error") });
			}
		},
	});

	useEffect(() => {
		if (!status) return;

		const timeoutId = setTimeout(() => {
			setStatus(undefined);
		}, 8000);

		return () => window.clearTimeout(timeoutId);
	}, [status]);

	return { formik, status };
};
