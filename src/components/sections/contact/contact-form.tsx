"use client";

import {
	CircleAlert,
	CircleCheck,
	Clock,
	Mail,
	MessageSquare,
	Send,
	User,
} from "lucide-react";
import { useTranslations } from "next-intl";

import CustomButton from "@/components/shared/custom-button";
import { useContactForm } from "@/hooks/use-contact-form";

// The contact form (name, email, message) — Formik + Yup
// validation and EmailJS sending via useContactForm.
const ContactForm = () => {
	const t = useTranslations("Contact.contactForm");
	const { formik, status } = useContactForm();

	const getFieldClassName = (fieldName: "name" | "email" | "message") =>
		`w-full border border-solid ${
			formik.touched[fieldName] && formik.errors[fieldName]
				? "border-danger focus:border-danger"
				: "border-border-strong focus:border-primary"
		} rounded-xs shadow-sm bg-surface-secondary py-2 ps-9 pe-3 text-text-primary outline-none transition-colors placeholder:text-[14px] placeholder:text-text-placeholder`;

	return (
		<form
			className="flex-1 p-4 border border-solid border-border-strong rounded-sm shadow-sm flex flex-col gap-4"
			onSubmit={formik.handleSubmit}
			noValidate
		>
			<h3 className="text-[18px] font-bold text-text-primary">{t("title")}</h3>

			{/* Name Field */}
			<div>
				<label
					className="mb-1.5 block text-caption font-medium text-text-secondary"
					htmlFor="name"
				>
					{t("name")}
				</label>

				<div className="relative">
					<span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-placeholder [&_svg]:size-4">
						<User />
					</span>

					<input
						className={getFieldClassName("name")}
						id="name"
						name="name"
						type="text"
						placeholder={t("namePlaceholder")}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.name}
						aria-invalid={Boolean(formik.touched.name && formik.errors.name)}
						aria-describedby="name-error"
					/>
				</div>

				{formik.touched.name && formik.errors.name && (
					<p className="mt-1 text-smallCaption text-danger" id="name-error">
						{formik.errors.name}
					</p>
				)}
			</div>

			{/* Email Field */}
			<div>
				<label
					className="mb-1.5 block text-caption font-medium text-text-secondary"
					htmlFor="email"
				>
					{t("email")}
				</label>

				<div className="relative">
					<span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-text-placeholder [&_svg]:size-4">
						<Mail />
					</span>

					<input
						className={getFieldClassName("email")}
						id="email"
						name="email"
						type="email"
						placeholder={t("emailPlaceholder")}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.email}
						aria-invalid={Boolean(formik.touched.email && formik.errors.email)}
						aria-describedby="email-error"
					/>
				</div>

				{formik.touched.email && formik.errors.email && (
					<p className="mt-1 text-smallCaption text-danger" id="email-error">
						{formik.errors.email}
					</p>
				)}
			</div>

			{/* Message Field */}
			<div>
				<label
					className="mb-1.5 block text-caption font-medium text-text-secondary"
					htmlFor="message"
				>
					{t("message")}
				</label>

				<div className="relative">
					<span className="pointer-events-none absolute start-3 top-3 text-text-placeholder [&_svg]:size-4">
						<MessageSquare />
					</span>

					<textarea
						className={`${getFieldClassName("message")} min-h-32 resize-none`}
						id="message"
						name="message"
						placeholder={t("messagePlaceholder")}
						onChange={formik.handleChange}
						onBlur={formik.handleBlur}
						value={formik.values.message}
						aria-invalid={Boolean(
							formik.touched.message && formik.errors.message,
						)}
						aria-describedby="message-error"
					/>
				</div>

				{formik.touched.message && formik.errors.message && (
					<p className="mt-1 text-smallCaption text-danger" id="message-error">
						{formik.errors.message}
					</p>
				)}
			</div>

			{/* Status After Send: a banner above the button, so the
			    outcome of the send cannot be missed */}
			{status && (
				<p
					className={`flex items-center gap-2 rounded-xs border border-solid px-3 py-2.5 text-caption font-medium ${
						status.type === "error"
							? "border-danger/40 bg-danger/10 text-danger"
							: "border-success/40 bg-success/10 text-success"
					}`}
					role="status"
				>
					{status.type === "error" ? (
						<CircleAlert className="size-4 shrink-0" />
					) : (
						<CircleCheck className="size-4 shrink-0" />
					)}
					{status.message}
				</p>
			)}

			{/* Send Button */}
			<div className="w-full">
				<CustomButton
					type="submit"
					btnTitle={t("submit")}
					btnStyle="primary"
					loading={formik.isSubmitting}
				>
					<Send />
				</CustomButton>
			</div>

			{/* Response time */}
			<p className="flex items-center justify-center gap-1.5 text-smallCaption font-medium text-text-description">
				<Clock className="size-3.5" />
				{t("responseTime")}
			</p>
		</form>
	);
};

export default ContactForm;
