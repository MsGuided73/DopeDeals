import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface ShoppingCartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoppingCartSidebar({ isOpen, onClose }: ShoppingCartSidebarProps) {
  // Mock cart data - in real app this would come from state/API
  const cartItems = [
    {
      id: "1",
      name: "Royal Crown Glass Pipe",
      price: 89.99,
      quantity: 1,
      image: "https://pixabay.com/get/geade9202710e1b8d5ac1ab530283dd90be352149b9b78b0c2731a2d2a378c84f82ec9f2e4afcc37144bb37fedc026d963be2a7f91ab75a2e836e43d7bf7bde6a_1280.jpg"
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 w-96 bg-steel-800 border-l border-steel-700 z-50 transform transition-transform">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Shopping Cart</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-steel-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
          
          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 bg-steel-700 rounded-lg">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-white">{item.name}</h4>
                  <p className="text-steel-300 text-sm">{formatPrice(item.price)}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6 bg-steel-600 hover:bg-steel-500 text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-white">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6 bg-steel-600 hover:bg-steel-500 text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Total */}
          <div className="border-t border-steel-700 pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-steel-300">Subtotal</span>
              <span className="text-white font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-steel-300">Shipping</span>
              <span className="text-green-400">Free</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-white">Total</span>
              <span className="text-lg font-bold text-yellow-400">{formatPrice(subtotal)}</span>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 font-semibold">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
