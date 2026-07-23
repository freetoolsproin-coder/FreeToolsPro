import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { Check, Mail } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import Seo from "./Seo";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  SITE_NAME,
  SITE_PURPOSE,
} from "../data/siteConstants";

const CONTACT_FAQS = [
  {
    q: "What can I contact you about?",
    a: "Tool bugs, wrong results, feature ideas, broken pages, privacy questions, and partnership notes. Include the full tool URL and steps to reproduce when reporting a bug.",
  },
  {
    q: "What is your support email?",
    a: `Write to ${CONTACT_EMAIL}. You can also use this form—both reach the FreeToolsPro team.`,
  },
  {
    q: "How quickly do you reply?",
    a: "We aim to respond within a few business days. Complex technical reports may take longer while we reproduce the issue.",
  },
  {
    q: "Do I need an account?",
    a: "No. FreeToolsPro tools do not require signup for standard use. Use a reachable email so we can follow up.",
  },
  {
    q: "Where are your legal pages?",
    a: "See Privacy Policy, Terms & Conditions, Disclaimer, and Cookie Policy linked in the site footer and below.",
  },
];

export default function ContactForm() {
  const form = useRef();
  const recaptchaRef = useRef();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const sendEmail = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const token = await recaptchaRef.current.executeAsync();
      if (!token) {
        setError("Captcha verification failed. Please try again.");
        setLoading(false);
        return;
      }

      await emailjs.sendForm("service_uvfqag8", "template_2zk68ln", form.current, {
        publicKey: "BER8gUFpCxPGuMrsh",
      });

      await emailjs.sendForm("service_uvfqag8", "template_j38zkp3", form.current, {
        publicKey: "BER8gUFpCxPGuMrsh",
      });

      setSuccess("Message sent successfully. We will get back to you soon.");
      form.current.reset();
      recaptchaRef.current.reset();
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      console.log("EMAILJS ERROR:", err);
      setError("Failed to send message. Email us directly at " + CONTACT_EMAIL);
      setTimeout(() => setError(""), 6000);
    }

    setLoading(false);
  };

  return (
    <>
      <Seo page="contact" />
      <section className="contact-section">
        <div className="contact-container">
          <h2>Contact {SITE_NAME}</h2>
          <p className="mb-4 text-left text-[0.95rem] leading-7 text-[var(--ftp-ink-soft)]">
            {SITE_PURPOSE}
          </p>
          <p className="mb-6 text-left text-[0.95rem] leading-7 text-[var(--ftp-ink-soft)]">
            Prefer email? Reach us at{" "}
            <a className="inline-flex items-center gap-1 font-semibold underline underline-offset-2" href={CONTACT_MAILTO}>
              <Mail className="h-4 w-4" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
            . Or send a message with the form below—include the tool URL for the fastest fix.
          </p>

          <form ref={form} onSubmit={sendEmail}>
            <div className="form-group">
              <input type="text" name="user_name" placeholder="Your Name" required autoComplete="name" />
            </div>
            <div className="form-group">
              <input type="email" name="user_email" placeholder="Your Email" required autoComplete="email" />
            </div>
            <div className="form-group">
              <input type="text" name="subject" placeholder="Subject" required />
            </div>
            <div className="form-group">
              <textarea name="message" rows="6" placeholder="Your Message" required />
            </div>

            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey="6Lc3ev4sAAAAAOjQL-PEXY58sdOx7M2Aj4J8ilpV"
              size="invisible"
            />

            <button type="submit" className="btnRegular flex gap-1" disabled={loading}>
              <Check size={18} />
              {loading ? "Sending..." : "Send Message"}
            </button>

            {success && <div className="success-msg">{success}</div>}
            {error && <div className="error-msg">{error}</div>}
          </form>

          <p className="mt-6 text-left text-sm text-[var(--ftp-ink-soft)]">
            Legal:{" "}
            <Link className="underline underline-offset-2" to="/privacy-policy">
              Privacy
            </Link>
            {" · "}
            <Link className="underline underline-offset-2" to="/terms">
              Terms
            </Link>
            {" · "}
            <Link className="underline underline-offset-2" to="/disclaimer">
              Disclaimer
            </Link>
            {" · "}
            <Link className="underline underline-offset-2" to="/cookie-policy">
              Cookies
            </Link>
            {" · "}
            <Link className="underline underline-offset-2" to="/about">
              About
            </Link>
          </p>

          <div className="mt-10 text-left">
            <h3 className="age-display text-xl font-semibold text-[var(--ftp-ink)]">Contact FAQs</h3>
            <div className="mt-4 space-y-2">
              {CONTACT_FAQS.map((item, index) => (
                <div
                  key={item.q}
                  className="rounded-xl border border-[var(--ftp-line)] bg-white/70 px-4 py-3"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 text-left text-sm font-semibold text-[var(--ftp-ink)]"
                    aria-expanded={openFaq === index}
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  >
                    {item.q}
                    <span aria-hidden="true">{openFaq === index ? "−" : "+"}</span>
                  </button>
                  {openFaq === index ? (
                    <p className="mt-2 text-sm leading-6 text-[var(--ftp-ink-soft)]">{item.a}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
