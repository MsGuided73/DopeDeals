"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  // Mock cart data for now - no backend integration
  const mockCartItems = [
    {
      id: 1,
      name: "Premium Glass Bong",
      price: 89.99,
      quantity: 1,
      imageUrl: null,
      description: "High-quality borosilicate glass compliant with CBD/Hemp regulations",
    },
    {
      id: 2,
      name: "THCA Pre-Roll Pack",
      price: 24.99,
      quantity: 2,
      imageUrl: null,
      description: "Lab-tested premium THCA - age restricted",
    },
  ];

  const subtotal = mockCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>

        {/* Compliance Placeholder */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Compliance Note:</strong> Cart contents filtered for CBD/Hemp only. Age verification and zipcode eligibility checked at checkout.
              </p>
            </div>
          </div>
        </div>

        {mockCartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
            <Button variant="outline" onClick={() => router.push('/products')}>Continue Shopping</Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {mockCartItems.map((item) => (
                <Card key={item.id} className="flex flex-col md:flex-row">
                  <CardHeader className="flex flex-row items-center space-x-4 flex-shrink-0 w-full md:w-48">
                    <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-2">
                    <CardTitle className="text-lg">
                      <Link href={`/product/${item.id}`} className="hover:underline">
                        {item.name}
                      </Link>
                    </CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">${item.price.toFixed(2)}</span>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => { /* Decrease quantity */ }}>-</Button>
                        <span>{item.quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => { /* Increase quantity */ }}>+</Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50" size="sm" onClick={() => { /* Remove item */ }}>
                      Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>Tax (8%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold mt-4 border-t pt-4">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => router.push('/products')}>Continue Shopping</Button>
                <Button onClick={() => router.push('/checkout')}>Proceed to Checkout</Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}