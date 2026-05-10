import Navbar from "@/app/components/layout/Navbar";
import ContactClient from "./ContactClient";
import Footer from "@/app/components/layout/Footer";

export const metadata = {
  title: "Contact Us — Suba Daily",
  description: "Hubungi kami untuk pertanyaan, keluhan, atau bantuan.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Header */}
      <div className="py-12 mt-10 text-center">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white sm:text-4xl">
          Contact Us
        </h1>
      </div>

      {/* Form + Info */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20">
        <ContactClient />
      </div>

      <Footer />
    </main>
  );
}
