import { useQuery } from "@tanstack/react-query";
import { Crown, Zap, Gift, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Membership } from "@shared/schema";

export default function VIPMembership() {
  const { data: memberships } = useQuery<Membership[]>({
    queryKey: ["/api/memberships"],
  });

  return (
    <section className="py-16 dark-gradient">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 mx-auto gold-gradient rounded-full flex items-center justify-center mb-6">
            <Crown className="w-10 h-10 text-steel-900" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-yellow-400 mb-6">Join the VIP Club</h2>
          <p className="text-xl text-steel-300 mb-8">
            Unlock exclusive benefits, early access to new products, and premium rewards
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-steel-800/50 p-6 rounded-xl border border-steel-700">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h4 className="font-semibold text-white mb-2">Early Access</h4>
              <p className="text-steel-400 text-sm">Get first dibs on new arrivals and limited editions</p>
            </div>
            <div className="bg-steel-800/50 p-6 rounded-xl border border-steel-700">
              <Gift className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h4 className="font-semibold text-white mb-2">Exclusive Rewards</h4>
              <p className="text-steel-400 text-sm">Earn points on every purchase and unlock special perks</p>
            </div>
            <div className="bg-steel-800/50 p-6 rounded-xl border border-steel-700">
              <Truck className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
              <h4 className="font-semibold text-white mb-2">Free Shipping</h4>
              <p className="text-steel-400 text-sm">Complimentary shipping on all orders, no minimum</p>
            </div>
          </div>

          <Button className="gold-gradient text-steel-900 px-8 py-4 text-lg font-bold hover:opacity-90 transition-opacity">
            Become a VIP Member
          </Button>
        </div>
      </div>
    </section>
  );
}
