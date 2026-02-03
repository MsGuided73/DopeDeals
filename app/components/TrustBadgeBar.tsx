"use client";

import { Shield, FlaskConical, UserCheck, Lock } from "lucide-react";

const trustBadges = [
  {
    icon: FlaskConical,
    label: "Lab-Tested",
    description: "3rd Party Verified",
  },
  {
    icon: UserCheck,
    label: "Age 21+ Verified",
    description: "Compliant Sales",
  },
  {
    icon: Shield,
    label: "2018 Farm Bill",
    description: "Federally Compliant",
  },
  {
    icon: Lock,
    label: "Secure Checkout",
    description: "Encrypted Payments",
  },
];

export default function TrustBadgeBar() {
  return (
    <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-y border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-6">
          {trustBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-3 px-4 py-2"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <badge.icon className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">
                  {badge.label}
                </p>
                <p className="text-xs text-gray-400">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
