import Link from 'next/link';
import AgeVerification from '../components/AgeVerification';
import GlobalMasthead from '../components/GlobalMasthead';

interface Review {
  id: string;
  customerName: string;
  customerInitials: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  productName?: string;
  productCategory?: string;
  helpful: number;
}

export default function ReviewsPage() {
  const reviews: Review[] = [
    {
      id: '1',
      customerName: 'Michael R.',
      customerInitials: 'MR',
      rating: 5,
      title: 'Outstanding Quality and Service!',
      content: 'I\'ve been shopping with Highway 420 for over a year now, and they never disappoint. The glass quality is top-notch, shipping is always fast, and customer service is incredibly helpful. My recent dab rig purchase exceeded all expectations.',
      date: '2024-01-15',
      verified: true,
      productName: 'Premium Glass Dab Rig',
      productCategory: 'Dab Rigs',
      helpful: 23
    },
    {
      id: '2',
      customerName: 'Sarah L.',
      customerInitials: 'SL',
      rating: 5,
      title: 'Best THCA Flower I\'ve Tried',
      content: 'The THCA flower from Highway 420 is absolutely incredible. Great taste, perfect cure, and the effects are exactly what I was looking for. Will definitely be ordering again soon!',
      date: '2024-01-12',
      verified: true,
      productName: 'Premium THCA Flower',
      productCategory: 'THCA Products',
      helpful: 18
    },
    {
      id: '3',
      customerName: 'David K.',
      customerInitials: 'DK',
      rating: 4,
      title: 'Great Selection, Fast Shipping',
      content: 'Love the variety of products available. Found exactly what I was looking for and it arrived in perfect condition. Only minor complaint is I wish there were more payment options.',
      date: '2024-01-10',
      verified: true,
      productCategory: 'Accessories',
      helpful: 15
    },
    {
      id: '4',
      customerName: 'Jessica M.',
      customerInitials: 'JM',
      rating: 5,
      title: 'Excellent Customer Support',
      content: 'Had an issue with my order and the customer support team went above and beyond to make it right. They replaced my item quickly and even threw in a little extra. This is how you do business!',
      date: '2024-01-08',
      verified: true,
      helpful: 31
    },
    {
      id: '5',
      customerName: 'Robert T.',
      customerInitials: 'RT',
      rating: 5,
      title: 'Premium Products, Fair Prices',
      content: 'The quality-to-price ratio here is unbeatable. I\'ve compared with other sites and Highway 420 consistently offers better value. The packaging is also very discreet and professional.',
      date: '2024-01-05',
      verified: true,
      productCategory: 'Vaporizers',
      helpful: 27
    },
    {
      id: '6',
      customerName: 'Amanda C.',
      customerInitials: 'AC',
      rating: 4,
      title: 'Good Experience Overall',
      content: 'My first order with Highway 420 was smooth. Product arrived as described and packaging was secure. Website is easy to navigate. Looking forward to trying more products.',
      date: '2024-01-03',
      verified: true,
      helpful: 12
    }
  ];

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / totalReviews) * 100
  }));

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <GlobalMasthead />
      <AgeVerification />
      
      <div className="max-w-7xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-chalets-legweb text-gray-900 mb-4" style={{ letterSpacing: '-0.02em' }}>
            DOPE FEEDBACK
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real reviews from real customers. See what the Highway 420 community has to say about their experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Rating Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
              
              {/* Overall Rating */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(averageRating))}
                </div>
                <p className="text-sm text-gray-600">Based on {totalReviews} reviews</p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2 mb-6">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 w-8">{rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                ))}
              </div>

              {/* Write Review Button */}
              <button className="w-full bg-dope-orange text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium">
                Write a Review
              </button>

              {/* Filter Options */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Filter Reviews</h4>
                <div className="space-y-2">
                  <button className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    All Reviews ({totalReviews})
                  </button>
                  <button className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    5 Stars ({ratingDistribution[0].count})
                  </button>
                  <button className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    4 Stars ({ratingDistribution[1].count})
                  </button>
                  <button className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    Verified Purchases
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-dope-orange text-white rounded-full flex items-center justify-center font-medium">
                        {review.customerInitials}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">{review.customerName}</h4>
                          {review.verified && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Verified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                    <p className="text-gray-700 leading-relaxed">{review.content}</p>
                  </div>

                  {/* Product Info */}
                  {(review.productName || review.productCategory) && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Product:</span>{' '}
                        {review.productName || review.productCategory}
                      </p>
                    </div>
                  )}

                  {/* Review Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-dope-orange">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      <span>Helpful ({review.helpful})</span>
                    </button>
                    <button className="text-sm text-gray-600 hover:text-dope-orange">
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-8">
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-dope-orange hover:text-dope-orange transition-colors">
                Load More Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Review Guidelines */}
        <div className="mt-16 bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-chalets-legweb text-gray-900 mb-6" style={{ letterSpacing: '-0.02em' }}>
            Review Guidelines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">What makes a great review?</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Be specific about your experience</li>
                <li>• Include details about product quality</li>
                <li>• Mention shipping and packaging</li>
                <li>• Share how the product met your needs</li>
                <li>• Be honest and constructive</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Review Policy</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Only verified customers can leave reviews</li>
                <li>• Reviews are moderated for quality</li>
                <li>• No promotional or spam content</li>
                <li>• Respect other customers and staff</li>
                <li>• Focus on the product and service</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
