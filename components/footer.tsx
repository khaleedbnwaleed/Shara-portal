'use client';

import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer id="contact" className="bg-neutral-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Shara_Eco_Logo-removebg-preview-IYf68Ar8OlgVfTfTzRTuBGH0Uxvcqu.png"
              alt="Shara Eco Solutions - Transforming Waste, Empowering Communities"
              width={160}
              height={50}
              className="h-12 sm:h-14 w-auto mb-4 sm:mb-6 brightness-0 invert"
            />
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Transforming Waste, Empowering Communities. Tech-driven waste management for a sustainable future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4">Company</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="#about" className="hover:text-accent transition-colors py-1 block">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-accent transition-colors py-1 block">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors py-1 block">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors py-1 block">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-accent transition-colors py-1 block">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors py-1 block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors py-1 block">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors py-1 block">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-base sm:text-lg mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-3 group">
                <Phone size={18} className="text-accent flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <a href="tel:+234123456789" className="hover:text-accent transition-colors">+234 8169525295</a>
              </li>
              <li className="flex items-start gap-3 group">
                <Mail size={18} className="text-accent flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <a href="mailto:info@sharaecosolutions.com" className="hover:text-accent transition-colors break-all">sharaecosolutions@gmail.com</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-accent flex-shrink-0 mt-1" />
                <span>Jigawa, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex justify-between items-center flex-col md:flex-row gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2026 Shara Eco Solutions Ltd. All rights reserved.
            </p>

            <div className="flex gap-4">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
                { icon: Linkedin, href: '#' },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="p-2 bg-primary/20 rounded-full hover:bg-accent hover:text-neutral-dark transition-colors"
                    aria-label="Social media link"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
