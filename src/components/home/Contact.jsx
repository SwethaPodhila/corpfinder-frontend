import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Clock3 } from "lucide-react";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/user/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        alert("Message sent successfully!");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        alert("Failed to send message");
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <section id="contact" className="py-24 bg-background min-h-screen">
      <div className="container mx-auto px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="mb-4 inline-block rounded-full bg-accent px-4 py-1.5 text-xs font-semibold">
            Contact
          </span>

          <h2 className="text-3xl font-bold md:text-4xl">
            Get In Touch
          </h2>

          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Have questions, feedback, or need assistance? We'd love to hear
            from you. Fill out the form and our team will get back to you.
          </p>
        </motion.div>

        {/* Content */}
        <div className="grid gap-8 lg:grid-cols-3">

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl border bg-card p-8 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-8">
              Contact Information
            </h3>

            <div className="space-y-8">

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Mail className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h4 className="font-semibold">
                    Email Support
                  </h4>

                  <p className="text-sm text-muted-foreground mt-1">
                    support@corpfinder.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Phone className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h4 className="font-semibold">
                    Phone
                  </h4>

                  <p className="text-sm text-muted-foreground mt-1">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-3">
                  <Clock3 className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h4 className="font-semibold">
                    Business Hours
                  </h4>

                  <p className="text-sm text-muted-foreground mt-1">
                    Monday - Friday
                  </p>

                  <p className="text-sm text-muted-foreground">
                    9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-10 rounded-xl bg-primary/5 border p-5">
              <h4 className="font-semibold mb-2">
                Quick Response
              </h4>

              <p className="text-sm text-muted-foreground">
                We typically respond to all inquiries within 24 hours.
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 rounded-2xl border bg-card p-8 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-bold mb-8">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
                  />
                </div>

              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="Enter subject"
                  className="w-full rounded-xl border bg-background px-4 py-3 outline-none focus:border-primary"
                />
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-sm font-medium">
                  Message
                </label>

                <textarea
                  rows="4"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Write your message..."
                  className="w-full rounded-xl border bg-background px-4 py-3 outline-none resize-none focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="btn-primary1 mt-8 w-full rounded-xl py-3 font-semibold"
              >
                Send Message
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;