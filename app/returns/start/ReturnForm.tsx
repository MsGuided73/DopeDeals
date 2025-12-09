'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, AlertTriangle, CheckCircle, Upload, FileText } from 'lucide-react';

interface ReturnItem {
  productName: string;
  quantity: number;
  reason: string;
  condition: string;
}

export default function ReturnForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    orderNumber: '',
    email: '',
    phone: '',
    fullName: '',
    returnReason: '',
    additionalNotes: '',
    preferredRefundMethod: 'original_payment',
    agreeToPolicy: false,
  });

  const [returnItems, setReturnItems] = useState<ReturnItem[]>([
    { productName: '', quantity: 1, reason: '', condition: '' }
  ]);

  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index: number, field: keyof ReturnItem, value: string | number) => {
    const updatedItems = [...returnItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setReturnItems(updatedItems);
  };

  const addReturnItem = () => {
    setReturnItems([...returnItems, { productName: '', quantity: 1, reason: '', condition: '' }]);
  };

  const removeReturnItem = (index: number) => {
    if (returnItems.length > 1) {
      setReturnItems(returnItems.filter((_, i) => i !== index));
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 5)); // Max 5 photos
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const generateEmailContent = () => {
    const subject = `Return Request - Order ${formData.orderNumber}`;

    const body = `
Return Request Form Submission

ORDER INFORMATION:
Order Number: ${formData.orderNumber}
Email: ${formData.email}

CONTACT INFORMATION:
Name: ${formData.fullName}
Phone: ${formData.phone || 'Not provided'}

RETURN ITEMS:
${returnItems.map((item, index) =>
  `Item ${index + 1}:
  Product: ${item.productName}
  Quantity: ${item.quantity}
  Reason: ${item.reason}
  Condition: ${item.condition}
`).join('\n')}

RETURN DETAILS:
Primary Reason: ${formData.returnReason}
Additional Notes: ${formData.additionalNotes || 'None provided'}

REFUND PREFERENCES:
Preferred Method: ${formData.preferredRefundMethod === 'original_payment' ? 'Original Payment Method' :
                   formData.preferredRefundMethod === 'store_credit' ? 'Store Credit' : 'Gift Card'}

POLICY AGREEMENT:
${formData.agreeToPolicy ? 'Customer has agreed to return policy and terms.' : 'Customer has NOT agreed to policy.'}

PHOTOS ATTACHED:
${photos.length > 0 ? `${photos.length} photo(s) attached to this email` : 'No photos provided'}

---
This return request was submitted through the Highway 420 website return form.
Please process this return request and provide a Return Authorization (RA) number.
    `.trim();

    return { subject, body };
  };

  const handleEmailForm = () => {
    // Basic validation
    if (!formData.orderNumber || !formData.email || !formData.fullName) {
      alert('Please fill in all required fields before emailing');
      return;
    }

    if (!formData.agreeToPolicy) {
      alert('Please agree to the return policy before emailing');
      return;
    }

    const { subject, body } = generateEmailContent();
    const mailtoLink = `mailto:bmbwholesale2025@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open email client
    window.location.href = mailtoLink;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.orderNumber || !formData.email || !formData.fullName) {
      alert('Please fill in all required fields');
      return;
    }

    if (!formData.agreeToPolicy) {
      alert('Please agree to the return policy');
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your API
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      setSubmitSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        router.push('/returns');
      }, 3000);

    } catch (error) {
      console.error('Error submitting return:', error);
      alert('There was an error submitting your return. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Return Request Submitted!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We've received your return request and will process it within 24 hours.
          You'll receive a confirmation email with your Return Authorization (RA) number and next steps.
        </p>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Order Number: <strong>{formData.orderNumber}</strong>
          </p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
          Redirecting to returns page...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">

        {/* Return Policy Reminder */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Return Policy Reminder
              </h3>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Returns must be initiated within 30 days of delivery</li>
                <li>• Items must be in original condition and packaging</li>
                <li>• Free return shipping for defective items or our mistakes</li>
                <li>• Refunds processed within 5-7 business days after receipt</li>
              </ul>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Order Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Package className="w-6 h-6 mr-3" />
              Order Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Order Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.orderNumber}
                  onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                  placeholder="e.g., HW420-12345"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Return Items */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Items to Return
            </h2>

            <div className="space-y-6">
              {returnItems.map((item, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Item {index + 1}
                    </h3>
                    {returnItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeReturnItem(index)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={item.productName}
                        onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                        placeholder="Enter product name"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reason for Return *
                      </label>
                      <select
                        required
                        value={item.reason}
                        onChange={(e) => handleItemChange(index, 'reason', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      >
                        <option value="">Select a reason</option>
                        <option value="defective">Defective/Damaged</option>
                        <option value="wrong_item">Wrong Item Sent</option>
                        <option value="not_as_described">Not as Described</option>
                        <option value="changed_mind">Changed Mind</option>
                        <option value="late_delivery">Late Delivery</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Item Condition *
                      </label>
                      <select
                        required
                        value={item.condition}
                        onChange={(e) => handleItemChange(index, 'condition', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      >
                        <option value="">Select condition</option>
                        <option value="unopened">Unopened/Sealed</option>
                        <option value="opened_unused">Opened but Unused</option>
                        <option value="used">Used</option>
                        <option value="damaged">Damaged</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addReturnItem}
                className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-dope-orange-500 hover:text-dope-orange-500 transition-colors"
              >
                + Add Another Item
              </button>
            </div>
          </div>

          {/* Return Reason & Notes */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Return Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Reason for Return
                </label>
                <select
                  value={formData.returnReason}
                  onChange={(e) => handleInputChange('returnReason', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                >
                  <option value="">Select primary reason</option>
                  <option value="defective">Defective/Damaged Product</option>
                  <option value="wrong_item">Wrong Item Received</option>
                  <option value="quality">Quality Issues</option>
                  <option value="packaging">Packaging Damage</option>
                  <option value="satisfaction">Not Satisfied</option>
                  <option value="duplicate">Duplicate Order</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  placeholder="Please provide any additional details about your return..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-dope-orange-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Upload className="w-6 h-6 mr-3" />
              Upload Photos (Optional)
            </h2>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload photos of the item(s) and packaging to help process your return faster
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-block bg-dope-orange-500 hover:bg-dope-orange-600 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors"
                >
                  Choose Photos
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Up to 5 photos, max 10MB each
                </p>
              </div>

              {/* Photo Preview */}
              {photos.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Refund Preferences */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Refund Preferences
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Preferred Refund Method
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="refundMethod"
                    value="original_payment"
                    checked={formData.preferredRefundMethod === 'original_payment'}
                    onChange={(e) => handleInputChange('preferredRefundMethod', e.target.value)}
                    className="text-dope-orange-500 focus:ring-dope-orange-500"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">
                    Original payment method (recommended)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="refundMethod"
                    value="store_credit"
                    checked={formData.preferredRefundMethod === 'store_credit'}
                    onChange={(e) => handleInputChange('preferredRefundMethod', e.target.value)}
                    className="text-dope-orange-500 focus:ring-dope-orange-500"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">
                    Store credit
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="refundMethod"
                    value="gift_card"
                    checked={formData.preferredRefundMethod === 'gift_card'}
                    onChange={(e) => handleInputChange('preferredRefundMethod', e.target.value)}
                    className="text-dope-orange-500 focus:ring-dope-orange-500"
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-300">
                    Gift card
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="policy-agreement"
                checked={formData.agreeToPolicy}
                onChange={(e) => handleInputChange('agreeToPolicy', e.target.checked)}
                className="mt-1 text-dope-orange-500 focus:ring-dope-orange-500"
                required
              />
              <label htmlFor="policy-agreement" className="ml-3 text-sm text-gray-700 dark:text-gray-300">
                I agree to the{' '}
                <a href="/returns" className="text-dope-orange-500 hover:underline">
                  Return Policy
                </a>{' '}
                and{' '}
                <a href="/terms-and-conditions" className="text-dope-orange-500 hover:underline">
                  Terms & Conditions
                </a>
                . I understand that returns must be in original condition and packaging.
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-dope-orange-500 hover:bg-dope-orange-600 disabled:bg-gray-400 text-white px-12 py-4 rounded-lg font-bold text-lg transition-colors disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Return Request'
              )}
            </button>

            <button
              type="button"
              onClick={handleEmailForm}
              className="bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-lg font-bold text-lg transition-colors border-2 border-blue-500"
            >
              📧 Email Return Form
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click "Email Return Form" to open your email client with all form details pre-filled and send directly to our returns team.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}
