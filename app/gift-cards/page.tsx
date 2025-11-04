"use client";
import { useState } from 'react';
import AgeVerification from '../components/AgeVerification';
import GlobalMasthead from '../components/GlobalMasthead';
import { Gift, CreditCard, Mail, Calendar, CheckCircle } from 'lucide-react';

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('email');
  const [recipientInfo, setRecipientInfo] = useState({
    name: '',
    email: '',
    message: ''
  });

  const predefinedAmounts = [25, 50, 100, 150, 200];

  return (
    <>
      <AgeVerification />
      <GlobalMasthead />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h1 className="dope-city-title text-5xl md:text-6xl mb-4">
              GIFT CARDS
            </h1>
            <div className="w-24 h-1 bg-dope-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Give the perfect gift with Highway 420 gift cards - let them choose their favorites
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-12">
          
          {/* Gift Card Builder */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden mb-12">
            <div className="grid lg:grid-cols-2 gap-0">
              
              {/* Gift Card Preview */}
              <div className="bg-gradient-to-br from-dope-orange-500 to-orange-600 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <Gift className="w-8 h-8 mr-3" />
                    <span className="text-2xl font-bold dope-city-title">Highway 420</span>
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-lg mb-2">Gift Card</p>
                    <div className="text-4xl font-bold mb-4">
                      ${customAmount || selectedAmount}
                    </div>
                    <p className="text-sm opacity-90">
                      {recipientInfo.name ? `For ${recipientInfo.name}` : 'For Someone Special'}
                    </p>
                  </div>
                  
                  <div className="text-xs opacity-75">
                    <p>Valid for 12 months from purchase date</p>
                    <p>Card Number: XXXX-XXXX-XXXX-1234</p>
                  </div>
                </div>
              </div>

              {/* Gift Card Form */}
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Create Your Gift Card
                </h2>
                
                {/* Amount Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Select Amount
                  </label>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {predefinedAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                        className={`p-3 rounded-lg border-2 font-semibold transition-colors ${
                          selectedAmount === amount && !customAmount
                            ? 'border-dope-orange-500 bg-dope-orange-50 dark:bg-dope-orange-900/20 text-dope-orange-600'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-dope-orange-300'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Or enter custom amount ($10 - $500)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="500"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setSelectedAmount(0);
                      }}
                      placeholder="Enter amount"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Delivery Method */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Delivery Method
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="delivery"
                        value="email"
                        checked={deliveryMethod === 'email'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="text-dope-orange-500 focus:ring-dope-orange-500"
                      />
                      <Mail className="w-5 h-5 ml-3 mr-2 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">Email Delivery (Instant)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="delivery"
                        value="physical"
                        checked={deliveryMethod === 'physical'}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="text-dope-orange-500 focus:ring-dope-orange-500"
                      />
                      <CreditCard className="w-5 h-5 ml-3 mr-2 text-gray-500" />
                      <span className="text-gray-700 dark:text-gray-300">Physical Card (5-7 days)</span>
                    </label>
                  </div>
                </div>

                {/* Recipient Information */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Recipient Information
                  </label>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Recipient's name"
                      value={recipientInfo.name}
                      onChange={(e) => setRecipientInfo({...recipientInfo, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Recipient's email"
                      value={recipientInfo.email}
                      onChange={(e) => setRecipientInfo({...recipientInfo, email: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent"
                    />
                    <textarea
                      placeholder="Personal message (optional)"
                      rows={3}
                      value={recipientInfo.message}
                      onChange={(e) => setRecipientInfo({...recipientInfo, message: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Purchase Button */}
                <button className="w-full bg-dope-orange-500 hover:bg-dope-orange-600 text-white py-4 rounded-lg font-bold text-lg transition-colors">
                  Purchase Gift Card - ${customAmount || selectedAmount}
                </button>
              </div>

            </div>
          </div>

          {/* Gift Card Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-dope-orange-100 dark:bg-dope-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-dope-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Perfect Gift</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Let them choose from our entire collection of premium products
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-dope-orange-100 dark:bg-dope-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-dope-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">12 Month Validity</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gift cards are valid for 12 months from the purchase date
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-dope-orange-100 dark:bg-dope-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-dope-orange-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Easy to Use</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Simple redemption process at checkout with unique gift card code
              </p>
            </div>
          </div>

          {/* Gift Card FAQ */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Gift Card FAQ</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">How do I redeem a gift card?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Enter your gift card code at checkout. The gift card amount will be applied to your order total. 
                  If your order exceeds the gift card value, you can pay the difference with another payment method.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Do gift cards expire?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, gift cards are valid for 12 months from the purchase date. You can check your gift card 
                  balance and expiration date on our gift card balance page.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Can I use multiple gift cards on one order?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, you can apply multiple gift cards to a single order. Enter each gift card code separately 
                  at checkout and the amounts will be combined.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Can I get a refund for a gift card?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Gift cards are non-refundable and cannot be exchanged for cash. However, if you received a 
                  defective gift card, please contact our customer service team for assistance.
                </p>
              </div>
            </div>
          </div>

          {/* Check Balance Section */}
          <div className="bg-gradient-to-r from-dope-orange-500 to-orange-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">Check Gift Card Balance</h2>
            <p className="text-xl mb-6">
              Enter your gift card code to check your remaining balance
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="text"
                placeholder="Enter gift card code"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
              <button className="bg-white text-dope-orange-500 hover:bg-gray-100 px-6 py-3 rounded-lg font-bold transition-colors">
                Check Balance
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
