import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear();
  return (
    <div className="bg-gray-800 text-white py-4">
    <div className="container mx-auto text-center">
      <p className="text-sm">© {currentYear} Chaos Tracker. All rights reserved.</p>
      <div className="flex justify-center space-x-4 mt-2">
        <a href="/privacy-policy" className="text-gray-400 hover:text-white">
          Privacy Policy
        </a>
        <a href="/terms" className="text-gray-400 hover:text-white">
          Terms of Service
        </a>
        <a href="https://github.com/username" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
          GitHub
        </a>
      </div>
    </div>
  </div>
  
  )
}

export default Footer
