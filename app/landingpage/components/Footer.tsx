'use client'

import { Facebook, Instagram, Twitter, ArrowUp } from 'lucide-react';

export function Footer() {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="relative bg-gray-800 text-white py-12" id="contact">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-3xl font-bold mb-4">Findymfirst</h3>
                <p className="mb-2">123 Gourmet Avenue, Culinary City, FC 12345</p>
                <p className="mb-4">Phone: (123) 456-7890</p>
                <div className="flex justify-center space-x-6 mb-6">
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center group"
                    >
                        <Facebook className="h-6 w-6 text-gray-400 group-hover:text-red-400 transition-colors duration-200" />
                        <span className="mt-2 text-sm text-gray-400 group-hover:text-red-400 transition-colors duration-200">Facebook</span>
                    </a>
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center group"
                    >
                        <Instagram className="h-6 w-6 text-gray-400 group-hover:text-red-400 transition-colors duration-200" />
                        <span className="mt-2 text-sm text-gray-400 group-hover:text-red-400 transition-colors duration-200">Instagram</span>
                    </a>
                    <a
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center group"
                    >
                        <Twitter className="h-6 w-6 text-gray-400 group-hover:text-red-400 transition-colors duration-200" />
                        <span className="mt-2 text-sm text-gray-400 group-hover:text-red-400 transition-colors duration-200">Twitter</span>
                    </a>
                </div>
                <button
                    onClick={scrollToTop}
                    className="absolute bottom-8 right-8 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition duration-300"
                    aria-label="Scroll to Top"
                >
                    <ArrowUp className="h-6 w-6" />
                </button>
                <p className="mt-8 text-gray-500">&copy; 2025 Findymfirst. All rights reserved.</p>
            </div>
        </footer>
    );
}
