"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  // Mock user data for now - no backend integration
  const mockUser = {
    email: "user@example.com",
    name: "John Doe",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

        {/* Compliance Placeholder */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Compliance Note:</strong> Age verification and zipcode eligibility confirmed. CBD/Hemp products only. No nicotine/tobacco products in cart.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="First Name" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Last Name" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St" />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="City" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="State" />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="ZIP Code" />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input type="radio" id="kajapay" name="payment" defaultChecked />
                  <Label htmlFor="kajapay">KajaPay (Compliant Payment Processor)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="radio" id="card" name="payment" disabled />
                  <Label htmlFor="card">Credit Card (Coming Soon)</Label>
                </div>
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">
                  <strong>KajaPay Placeholder:</strong> Integration with KajaPay for compliant transactions will be implemented here.
                </p>
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <section className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$114.97</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$9.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>$9.20</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>$134.16</span>
                </div>
              </div>
              <Button className="w-full mt-6">Place Order</Button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}