import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./common/Button";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="wrapper">
      <div className="privacy-policy">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: 5th February 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Launchpad Events ("we," "our," "us"). We respect your
            privacy and are committed to protecting your personal data. This
            Privacy Policy explains how we collect, use, and share your
            information when you use our event creation and management
            application.
          </p>
        </section>

        <section>
          <h2>2. Data We Collect</h2>
          <p>We collect the following types of data:</p>
          <ul>
            <li>
              <strong>Personal Information:</strong> Your name, email address,
              and any other details you provide when signing in.
            </li>
            <li>
              <strong>Event Data:</strong> Details of events you create,
              including event name, time, date, and attendees.
            </li>
            <li>
              <strong>Google Calendar Integration:</strong> If you choose to add
              events to Google Calendar, we may request access to your calendar
              data.
            </li>
            <li>
              <strong>Usage Data:</strong> Information on how you interact with
              our application (e.g., login times, feature usage).
            </li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Data</h2>
          <p>We use your data for the following purposes:</p>
          <ul>
            <li>To allow you to create, manage, and share events.</li>
            <li>To integrate with Google Calendar (with your permission).</li>
            <li>
              To improve our application's functionality and user experience.
            </li>
            <li>To provide customer support and respond to inquiries.</li>
          </ul>
        </section>

        <section>
          <h2>4. How We Share Your Data</h2>
          <p>
            We do not sell or rent your personal data. However, we may share it
            with:
          </p>
          <ul>
            <li>
              Google Services: To enable event creation and syncing with Google
              Calendar.
            </li>
            <li>
              Service Providers: Third-party tools that help us maintain and
              improve our services.
            </li>
            <li>
              Legal Authorities: If required to comply with legal obligations.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Google API Compliance</h2>
          <p>
            Our application complies with Google API Services User Data Policy,
            including the Limited Use Requirements. Your Google Calendar data is
            used only for event management purposes and is not shared or used
            beyond what is necessary to provide this functionality.
          </p>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>
            We retain your data only as long as necessary to provide our
            services or comply with legal requirements. You may request deletion
            of your data at any time by contacting us.
          </p>
        </section>

        <section>
          <h2>7. Your Rights (UK GDPR & Data Protection Act 2018)</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access, update, or delete your personal data.</li>
            <li>
              Withdraw consent for data processing (e.g., Google Calendar
              integration).
            </li>
            <li>Request a copy of the data we hold about you.</li>
          </ul>
          <p>
            To exercise your rights, contact us at:{" "}
            <a href="mailto:glawall217@gmail.com">glawall217@gmail.com</a>
          </p>
        </section>

        <section>
          <h2>8. Security Measures</h2>
          <p>
            We implement reasonable security measures to protect your data.
            However, no system is 100% secure, and we encourage users to take
            precautions when sharing personal information online.
          </p>
        </section>

        <section>
          <h2>9. Third-Party Links</h2>
          <p>
            Our application may contain links to third-party sites. We are not
            responsible for their privacy practices, so we encourage you to
            review their policies.
          </p>
        </section>

        <section>
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Any changes will be
            posted on this page, and significant changes will be communicated to
            users.
          </p>
        </section>

        <section>
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy,
            please contact us at:{" "}
            <a href="mailto:glawall217@gmail.com">glawall217@gmail.com</a>
          </p>
        </section>

        <div className="btn-group">
          <Button variant="blue" onClick={() => navigate("/login")}>
            Return to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
