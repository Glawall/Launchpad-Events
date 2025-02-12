import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./common/Button";
import { useAuth } from "../context/AuthContext";

export default function TermsOfService() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="wrapper">
      <div className="privacy-policy">
        <h1>Terms of Service</h1>
        <p className="last-updated">Effective Date: 5th February 2025</p>

        <p>
          Welcome to The Events Hive! By accessing or using our service (the
          "Service"), you agree to comply with and be bound by the following
          Terms of Service ("Terms"). If you do not agree to these Terms, you
          must not use the Service.
        </p>

        <section>
          <h2>1. Service Overview</h2>
          <p>
            The Events Hive is a platform where admin users can create, manage,
            and delete events. Registered users can log in to the platform to
            view events and, after confirming their registration, add events to
            their Google Calendar using a provided link.
          </p>
        </section>

        <section>
          <h2>2. Account Creation and Registration</h2>
          <ul>
            <li>
              <strong>User Registration:</strong> To access and use the Service,
              users must create an account and complete the registration
              process. After confirming their registration, users will be able
              to log in and view available events.
            </li>
            <li>
              <strong>Admin Users:</strong> Admin users have the ability to
              create, modify, and delete events on the platform. Once an event
              is created, a unique link will be provided to users, allowing them
              to add the event to their Google Calendar.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. User Responsibilities</h2>
          <ul>
            <li>
              <strong>Account Security:</strong> You are responsible for
              maintaining the security of your account credentials and for all
              activities that occur under your account. You agree to notify us
              immediately of any unauthorized use of your account.
            </li>
            <li>
              <strong>Event Interaction:</strong> Users are responsible for the
              events they choose to add to their Google Calendar. Once you
              confirm your registration and log in, you can view events and add
              them to your Google Calendar using the provided link.
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Event Management</h2>
          <ul>
            <li>
              <strong>Admin Users:</strong> Admin users can create, edit, and
              delete events within the platform. Each event created will
              generate a unique link for users to add the event to their Google
              Calendar.
            </li>
            <li>
              <strong>Event Accuracy:</strong> Admin users are responsible for
              ensuring the accuracy and legality of event details. The platform
              does not alter or verify event details beyond creation.
            </li>
          </ul>
        </section>

        <section>
          <h2>5. Google Calendar Integration</h2>
          <p>
            After confirming your registration and logging in, you will be able
            to view events on the platform. When you click on an event, a link
            will be provided to add the event directly to your Google Calendar.
          </p>
          <p>
            This action will require you to grant permission for the Service to
            interact with your Google Calendar account to add or remove the
            event. We do not access or store any other personal data from your
            Google account.
          </p>
        </section>

        <section>
          <h2>6. Data Privacy and Security</h2>
          <p>
            We take the privacy and security of your data seriously. By using
            the Service, you agree to our{" "}
            <Link to="/privacy-policy">Privacy Policy</Link>, which explains how
            we collect, store, and protect your personal information.
          </p>
          <p>
            We do not sell or share your personal information with third
            parties, except as necessary to provide the Service or comply with
            legal obligations.
          </p>
        </section>

        <section>
          <h2>7. Limitation of Liability</h2>
          <p>
            The Service is provided "as is" and without warranties of any kind,
            either express or implied. We do not guarantee that the Service will
            always be available, free of errors, or meet your specific
            requirements.
          </p>
          <p>
            We are not responsible for any loss, damage, or unauthorized access
            to your Google Calendar or any data stored therein, except to the
            extent caused by our gross negligence or willful misconduct.
          </p>
        </section>

        <section>
          <h2>8. Modifications to the Terms</h2>
          <p>
            We may update or modify these Terms from time to time. Any changes
            will be posted on this page, and the "Effective Date" will be
            updated accordingly. By continuing to use the Service, you agree to
            the updated Terms.
          </p>
        </section>

        <section>
          <h2>9. Termination of Access</h2>
          <p>
            We reserve the right to suspend or terminate access to the Service
            for any user who violates these Terms or engages in fraudulent,
            harmful, or unlawful activities.
          </p>
        </section>

        <section>
          <h2>10. Governing Law</h2>
          <p>
            These Terms are governed by the laws of the United Kingdom. Any
            disputes will be handled in the appropriate courts in the UK.
          </p>
        </section>

        <section>
          <h2>11. Contact Information</h2>
          <p>
            If you have any questions or concerns about these Terms of Service,
            please contact us at:{" "}
            <a href="mailto:glawall217@gmail.com">glawall217@gmail.com</a>
          </p>
        </section>

        {!user && (
          <div className="btn-group">
            <Button variant="blue" onClick={() => navigate("/login")}>
              Return to Login
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
