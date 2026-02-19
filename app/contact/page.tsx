"use client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Utiliser mailto comme fallback, mais vous pouvez intégrer EmailJS, Resend, etc.
      const mailtoLink = `mailto:wangny.ouangni@gmail.com?subject=Contact depuis le portfolio - ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(`Nom: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
      window.location.href = mailtoLink;
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: "", email: "", message: "" });
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen text-white pt-24" style={{ background: "#080C14" }}>
        {/* Hero Section */}
        <section className="relative py-24 px-6 overflow-hidden">
          <div className="absolute inset-0 hero-grid opacity-30" />
          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 fade-up">
              Travaillons <span className="gradient-text">Ensemble</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto fade-up" style={{ animationDelay: "0.1s" }}>
              Je suis ouvert aux opportunités de freelance, aux postes à temps plein et aux projets innovants.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: "#F59E0B22", border: "1px solid #F59E0B44" }}>
                      📧
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Email</h3>
                      <a href="mailto:wangny.ouangni@gmail.com" className="text-amber-400 text-sm hover:underline">
                        wangny.ouangni@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: "#EF444422", border: "1px solid #EF444444" }}>
                      📱
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Téléphone</h3>
                      <a href="tel:+2250788323276" className="text-amber-400 text-sm hover:underline">
                        +225 07 88 32 32 76
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: "#8B5CF622", border: "1px solid #8B5CF644" }}>
                      📍
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Localisation</h3>
                      <p className="text-slate-400 text-sm">Abidjan, Cocody, Côte d&apos;Ivoire</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-6 backdrop-blur-sm transition-all duration-300 hover:scale-105" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <h3 className="text-white font-semibold mb-4">Réseaux sociaux</h3>
                  <div className="flex items-center gap-4">
                    <a
                      href="https://www.linkedin.com/in/romaric-ouangni-7460972a5/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-white/5"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span className="text-slate-300 text-sm">LinkedIn</span>
                    </a>
                    <a
                      href="https://github.com/eymryc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 hover:bg-white/5"
                      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                      </svg>
                      <span className="text-slate-300 text-sm">GitHub</span>
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl p-6 backdrop-blur-sm" style={{ background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.1))", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Disponible pour des projets passionnants. N&apos;hésitez pas à me contacter pour discuter de vos besoins en développement.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="rounded-2xl p-8 backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <h2 className="text-2xl font-bold mb-6">Envoyez un message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors resize-none"
                      placeholder="Votre message..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-lg font-semibold text-black transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)" }}
                  >
                    {submitted ? "Message envoyé ! ✓" : "Envoyer le message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
