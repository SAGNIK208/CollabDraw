import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-2xl font-bold">CollabDraw</h2>
          <p className="text-gray-400 mt-2">Collaborate and create seamlessly.</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Our Team</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white">Join Us</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Contact</h3>
          <p className="text-gray-400 mt-2">info@collabdraw.com</p>
        </div>
      </div>
      <p className="text-center text-gray-500 mt-8">© 2025 CollabDraw. All Rights Reserved.</p>
    </footer>
  );
};