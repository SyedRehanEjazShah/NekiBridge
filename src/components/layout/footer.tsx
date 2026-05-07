import Link from "next/link";
import { Heart, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  platform: [
    { href: "/about", label: "About Us" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/ngos", label: "Partner NGOs" },
    { href: "/contact", label: "Contact" },
  ],
  donors: [
    { href: "/register/donor", label: "Register as Donor" },
    { href: "/donor/donate", label: "Make a Donation" },
    { href: "/track", label: "Track Donation" },
    { href: "/donor/impact", label: "Impact Report" },
  ],
  ngos: [
    { href: "/register/ngo", label: "Register Your NGO" },
    { href: "/ngo/dashboard", label: "NGO Dashboard" },
    { href: "/campaigns", label: "Active Campaigns" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 relative overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 pattern-bg opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand column */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <span className="text-xl font-bold font-heading text-white">
                  Neki<span className="text-emerald-400">Bridge</span>
                </span>
                <p className="text-xs text-gray-500 -mt-0.5">نیکی بریج</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Bridging the gap between donors and those in need. Smart clothing
              donation matching across Pakistan.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-emerald-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform links */}
          <div>
            <h4 className="text-white font-semibold font-heading mb-5">
              Platform
            </h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Donor links */}
          <div>
            <h4 className="text-white font-semibold font-heading mb-5">
              For Donors
            </h4>
            <ul className="space-y-3">
              {footerLinks.donors.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-emerald-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold font-heading mb-5">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                <span>Islamabad, Pakistan</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>contact@nekibridge.pk</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+92 300 1234567</span>
              </li>
            </ul>
            {/* Urdu tagline */}
            <div className="mt-6 p-4 rounded-xl bg-gray-800/50 border border-gray-800">
              <p className="urdu-text text-emerald-400 text-base text-center">
                نیکی کا پل بنائیں — ہر لباس ایک دعا
              </p>
              <p className="text-xs text-gray-500 text-center mt-1">
                Build a bridge of kindness — every garment is a prayer
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} NekiBridge. All rights reserved. Made
            with <Heart className="w-3 h-3 inline text-red-500 fill-red-500" />{" "}
            in Pakistan.
          </p>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link href="#" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
