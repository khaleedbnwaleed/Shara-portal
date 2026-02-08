'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center gap-2 group">
              <Image
                src="/asset/image/logo.JPG"
                alt="Shara Eco Solutions - Transforming Waste, Empowering Communities"
                width={160}
                height={50}
                className="h-10 sm:h-14 w-auto transition-transform group-hover:scale-105"
                priority
              />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-primary hover:text-accent transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-colors text-sm min-h-10">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-primary hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="flex flex-col gap-1 py-4 px-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-primary hover:text-accent hover:bg-gray-50 px-4 py-3 rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button className="text-sm font-semibold bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:opacity-90 transition-colors mt-2 min-h-12">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
