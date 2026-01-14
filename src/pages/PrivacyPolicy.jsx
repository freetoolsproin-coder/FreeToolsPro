import { Link } from "react-router-dom";
import { useState } from "react";
import Seo from "../components/Seo";

export default function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy – Free Tools"
        description="Read how Free Tools collects, uses, and protects your data. We respect your privacy and do not store personal information."
      />
      <section>
        <Link to="/tools">
          <img src="../../images/freetools-hero.jpg" />
        </Link>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-10 text-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Privacy Policy
        </h1>

        <p className="mb-4">
          At <strong>Free Tools</strong>, your privacy is important to us. This
          Privacy Policy explains how we collect, use, and safeguard your
          information when you use our website and online tools.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          1. Information We Collect
        </h2>
        <p className="mb-4">
          We do <strong>not</strong> collect personally identifiable information
          such as your name, email address, phone number, or location.
          All calculations performed using our tools happen directly in your
          browser.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          2. Usage Data
        </h2>
        <p className="mb-4">
          We may collect anonymous usage data such as page views, device type,
          browser type, and general usage patterns to improve website
          performance and user experience. This data cannot be used to identify
          individual users.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          3. Cookies
        </h2>
        <p className="mb-4">
          Free Tools may use cookies to enhance user experience, analyze traffic,
          and serve relevant advertisements. You can choose to disable cookies
          through your browser settings.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          4. Third-Party Services
        </h2>
        <p className="mb-4">
          We may use trusted third-party services such as Google Analytics or
          Google AdSense. These services may use cookies or similar technologies
          to collect anonymous data in accordance with their own privacy
          policies.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          5. Data Security
        </h2>
        <p className="mb-4">
          We take reasonable measures to protect your information. Since no
          personal data is stored on our servers, the risk of data misuse is
          minimal.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          6. Children’s Information
        </h2>
        <p className="mb-4">
          Free Tools does not knowingly collect any personal information from
          children under the age of 13.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          7. Changes to This Policy
        </h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Any changes will
          be posted on this page with an updated effective date.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-2">
          8. Contact Us
        </h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please <a className="font-bold" href="mailto:freetoolsproin@gmail.com">contact us</a> through the website.
        </p>

      </main>
    </>
  );

}
