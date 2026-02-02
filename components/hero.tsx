'use client';

import Image from 'next/image';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function Hero() {
  const [formData, setFormData] = useState({
    fullName: '',
    serviceType: '',
    industryType: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({ fullName: '', serviceType: '', industryType: '' });
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section
      id="home"
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
    >
      {/* Background Image */}
      <Image
        src="/asset/image/00.jpg"
        alt="Waste management background"
        fill
        className="absolute inset-0 object-cover z-0"
        priority
        quality={75}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      <div className="relative z-20 w-full h-full flex items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-5 sm:space-y-7 text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Empowering Responsible Waste Management
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Join us in transforming waste into valuable resources. Tech-driven solutions for a sustainable future.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 justify-center lg:justify-start">
                <button className="px-6 sm:px-8 py-3 sm:py-3.5 bg-accent text-accent-foreground rounded-lg font-semibold hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base min-h-12">
                  Book Now
                  <ArrowRight size={18} className="hidden sm:block" />
                </button>
                <button className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/40 text-sm sm:text-base min-h-12">
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Booking Form */}
            <div className="order-1 lg:order-2 w-full max-w-md mx-auto lg:max-w-none">
              <div className="relative rounded-xl sm:rounded-2xl p-5 sm:p-7 md:p-8 shadow-2xl bg-white">
                {/* Success Message */}
                {showSuccess && (
                  <div className="absolute inset-0 bg-white z-30 flex flex-col items-center justify-center rounded-xl sm:rounded-2xl p-6 sm:p-8">
                    <CheckCircle size={64} className="text-green-500 mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold text-primary mb-3 text-center">Booking Submitted!</h3>
                    <p className="text-gray-600 text-center text-sm sm:text-base px-2">
                      Your booking has been sent and we will get back to you shortly. Thank you for choosing Shara Eco Solutions
                    </p>
                  </div>
                )}

                {/* Form Content */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-primary mb-5 sm:mb-6">Quick Booking</h2>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                        Service Type *
                      </label>
                      <select 
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                        required
                        disabled={isLoading}
                      >
                        <option>Select Service</option>
                        <option>Curbside Collection</option>
                        <option>Dumpster Rental</option>
                        <option>E-Waste Recycling</option>
                        <option>Composting</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-primary mb-2">
                        Industry Type
                      </label>
                      <select 
                        name="industryType"
                        value={formData.industryType}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                        disabled={isLoading}
                      >
                        <option>Select Industry</option>
                        <option>Residential</option>
                        <option>Commercial</option>
                        <option>Industrial</option>
                        <option>Educational</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 sm:py-3.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base mt-6 min-h-12"
                    >
                      {isLoading ? 'Submitting...' : 'Book Service'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
