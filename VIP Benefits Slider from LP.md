{/* Main Content */}
      <div>
        {/* VIP Membership Hero Section */}
        <div className="w-full px-6 pt-1 pb-1">
          <Link
            href="/rewards"
            className="relative block w-full h-128 bg-cover bg-center rounded-xl overflow-hidden group"
            style={{
              backgroundImage: "url('https://qirbapivptotybspnbet.supabase.co/storage/v1/object/public/website-images/rewards/slider1.png')",
              backgroundSize: "cover",
              backgroundPosition: "bottom"
            }}
          >
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent group-hover:from-black/80 group-hover:via-black/50 transition-all duration-300"></div>

            {/* VIP Content */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white max-w-lg">
              <h2 className="font-chalets tracking-wider leading-none mb-8" style={{
                fontFamily: "'Chalets', 'Inter', system-ui, sans-serif",
                fontWeight: 'normal',
                letterSpacing: '0.02em',
                fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
                lineHeight: '0.9',
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 16px rgba(0, 0, 0, 0.6)'
              }}>
                VIP REWARDS
              </h2>

              {/* Benefits List - Highway 420 Brand Voice */}
              <ul className="space-y-3 text-lg font-medium mb-8">
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="mr-3" style={{ color: '#2d8f47' }}>•</span>
                  Extra Scenic Route Savings
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="mr-3" style={{ color: '#2d8f47' }}>•</span>
                  Best Fuel Economy Guaranteed
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="mr-3" style={{ color: '#2d8f47' }}>•</span>
                  Exclusive Roadside Attractions
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="mr-3" style={{ color: '#2d8f47' }}>•</span>
                  Free Test Drive Products
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="mr-3" style={{ color: '#2d8f47' }}>•</span>
                  VIP Fast Lane Program
                </li>
                <li className="flex items-center" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)' }}>
                  <span className="mr-3" style={{ color: '#2d8f47' }}>•</span>
                  Members-Only Pit Stops
                </li>
              </ul>

              {/* CTA Button */}
              <button className="px-8 py-3 text-green-600 border-2 border-green-600 font-bold uppercase tracking-wide rounded-lg transition-all duration-300 hover:bg-green-600 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-green-600/25">
                TAKE THE FAST LANE
              </button>
            </div>
          </Link>
        </div>
