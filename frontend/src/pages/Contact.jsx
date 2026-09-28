import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Contact() {
  return (
    <main className="page">
      <div className="container contact-grid">
        <div>
          <p className="eyebrow">SAY HELLO</p>
          <h1>Let's make someone's day.</h1>
          <p>
            Questions about an order, a special request, or just want to talk
            flowers? We're here.
          </p>
          <div className="contact-details">
            <p>
              <FiMail />
              <a href="mailto:hello@petalyn.in">hello@petalyn.in</a>
            </p>
            <p>
              <FiPhone />
              <a href="tel:+916307275065">+91 98765 43210</a>
            </p>
            <p>
              <FiMapPin /> Sherwani Nagar, Lucknow, Uttar Pradesh
            </p>
          </div>
        </div>
        <div className="contact-card">
          <p className="eyebrow">GET IN TOUCH</p>
          <h2>We'd love to hear from you.</h2>
          <p>
            For order questions and special requests, email us directly. We aim
            to reply as soon as possible.
          </p>
          <a className="btn primary" href="mailto:hello@petalyn.in">
            Email Petalyn
          </a>
        </div>
      </div>
    </main>
  );
}
