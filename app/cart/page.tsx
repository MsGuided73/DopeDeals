"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EnhancedSearchBar from '../components/EnhancedSearchBar';
import { supabaseBrowser } from '../lib/supabase-browser';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  products: {
    id: string;
    name: string;
    price: number;
    vip_price?: number;
    image_url?: string;
    description?: string;
    sku: string;
    stock_quantity: number;
    is_active: boolean;
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabaseBrowser.auth.getUser();
    setUser(user);
    if (user) {
      fetchCartItems(user.id);
    } else {
      setLoading(false);
    }
  };

  const fetchCartItems = async (userId: string) => {
    try {
      const { data, error } = await supabaseBrowser
        .from('cart_items')
        .select(`
          id,
          product_id,
          quantity,
          created_at,
          products (
            id,
            name,
            price,
            vip_price,
            image_url,
            description,
            sku,
            stock_quantity,
            is_active
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;
      setCartItems(data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    try {
      const { error } = await supabaseBrowser
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId);

      if (error) throw error;

      // Update local state
      setCartItems(items =>
        items.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      const { error } = await supabaseBrowser
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      // Update local state
      setCartItems(items => items.filter(item => item.id !== cartItemId));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = user?.user_metadata?.membership_tier === 'vip' && item.products.vip_price
      ? item.products.vip_price
      : item.products.price;
    return sum + (price * item.quantity);
  }, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-white">
      {/* Masthead */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-normal tracking-[-0.1em]" style={{ fontFamily: 'Chalets, sans-serif' }}>
                DOPE CITY
              </Link>
            </div>

            {/* Enhanced Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <EnhancedSearchBar />
            </div>

            {/* Cart and Account Icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-800 rounded-md">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-md relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-dope-orange text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 h-12">
            <Link href="/brands" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">
              Shop by Brand
            </Link>
            <Link href="/products?category=thca" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">
              THCA & More
            </Link>
            <Link href="/products?category=bongs" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">
              Bongs
            </Link>
            <Link href="/pipes" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">
              Pipes
            </Link>
            <Link href="/products?category=dab-rigs" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">
              Dab Rigs
            </Link>
            <Link href="/products?category=vaporizers" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">
              Vaporizers
            </Link>
            <Link href="/products?category=accessories" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">
              Accessories
            </Link>
            <Link href="/products?category=edibles" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-dope-orange">
              Munchies
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
        <h1 className="text-3xl font-normal text-gray-900" style={{ fontFamily: 'Chalets, sans-serif', letterSpacing: '-0.1em' }}>
          Shopping Cart
        </h1>

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