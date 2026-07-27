import { useState } from "react";
import "./ContactForm.css";

function ContactForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const errors = {
    fullName:
      formData.fullName.trim().length < 3
        ? "Enter at least 3 characters."
        : "",

    email:
      formData.email === ""
        ? "Email is required."
        : !emailRegex.test(formData.email)
        ? "Enter a valid email address."
        : "",

    subject:
      formData.subject.trim().length < 5
        ? "Subject should contain at least 5 characters."
        : "",

    message:
      formData.message.trim().length < 20
        ? "Message should contain at least 20 characters."
        : "",
  };

  const isFormValid = Object.values(errors).every((error) => error === "");

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitted(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid) return;

    console.log("Submitted Data");
    console.log(formData);

    setSubmitted(true);

    setFormData({
      fullName: "",
      email: "",
      subject: "",
      message: "",
    });
  }

  return (
    <section className="contact-section">
      <div className="contact-card">
        <div className="left">
          <h1>Contact Us</h1>
          <p>
            Have questions, suggestions, or need assistance? Fill out the form
            and our team will get back to you within 24 hours.
          </p>
          <ul>
            <li>✔ Fast Response</li>
            <li>✔ Professional Support</li>
            <li>✔ Secure Communication</li>
          </ul>
        </div>

        <div className="right">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Smith"
              />
              {errors.fullName && <small>{errors.fullName}</small>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
              />
              {errors.email && <small>{errors.email}</small>}
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
              />
              {errors.subject && <small>{errors.subject}</small>}
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                rows="6"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message..."
              />
              <div className="counter">{formData.message.length}/500</div>
              {errors.message && <small>{errors.message}</small>}
            </div>

            <button disabled={!isFormValid} type="submit">
              Send Message
            </button>

            {submitted && (
              <p className="success">
                Your message has been sent successfully.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;