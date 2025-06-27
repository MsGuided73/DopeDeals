import { Crown, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-steel-800 border-t border-steel-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-steel-900" />
              </div>
              <div>
                <h1 className="text-xl font-serif font-bold text-yellow-400">VIP Smoke</h1>
                <p className="text-xs text-steel-400">Premium Accessories</p>
              </div>
            </div>
            <p className="text-steel-400 text-sm mb-4">
              Your premier destination for luxury smoking accessories and premium quality products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-steel-400 text-sm">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">VIP Membership</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2 text-steel-400 text-sm">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-steel-400 text-sm">
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Age Verification</a></li>
              <li><a href="#" className="hover:text-yellow-400 transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-steel-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-steel-400 text-sm">&copy; 2024 VIP Smoke. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-steel-400 hover:text-yellow-400 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-steel-400 hover:text-yellow-400 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-steel-400 hover:text-yellow-400 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
