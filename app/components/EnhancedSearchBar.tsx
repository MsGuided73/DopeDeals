'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SearchCategory {
  label: string
  value: string
  href: string
  type: 'product' | 'collection'
}

const searchCategories: SearchCategory[] = [
  // Product Types
  { label: 'All Products', value: 'all', href: '/products', type: 'product' },
  { label: 'THCA Flower', value: 'thca', href: '/products?q=thca', type: 'product' },
  { label: 'Pre-Rolls', value: 'pre-rolls', href: '/pre-rolls', type: 'product' },
  { label: 'Bongs', value: 'bongs', href: '/products?category=bongs', type: 'product' },
  { label: 'Hand Pipes', value: 'pipes', href: '/pipes', type: 'product' },
  { label: 'Dab Rigs', value: 'dab-rigs', href: '/products?category=dab-rigs', type: 'product' },
  { label: 'Vaporizers', value: 'vaporizers', href: '/products?category=vaporizers', type: 'product' },
  { label: 'E-Rigs', value: 'e-rigs', href: '/products?q=e-rig', type: 'product' },
  { label: 'Dab Accessories', value: 'dab-accessories', href: '/products?q=dab', type: 'product' },
  { label: 'Torches', value: 'torches', href: '/products?q=torch', type: 'product' },
  { label: 'Edibles', value: 'edibles', href: '/products?q=edibles', type: 'product' },
  { label: 'CBD Products', value: 'cbd', href: '/products?q=cbd', type: 'product' },
  { label: 'Concentrates', value: 'concentrates', href: '/products?q=concentrates', type: 'product' },
  { label: 'THCA Vapes', value: 'thca-vapes', href: '/products?q=thca+vape', type: 'product' },
  { label: 'Hookahs', value: 'hookahs', href: '/products?q=hookah', type: 'product' },

  // Collection Categories
  { label: 'Storage & Cases', value: 'storage', href: '/products?q=storage', type: 'collection' },
  { label: 'Rolling Accessories', value: 'rolling', href: '/products?q=rolling', type: 'collection' },
  { label: 'Brands', value: 'brands', href: '/brands', type: 'collection' },
]

const placeholderWords = [
  'products',
  'pre-rolls',
  'bongs',
  'brands',
  'hand pipes',
  'hookahs',
  'dab-rigs',
  'dab accessories',
  'torches',
  'edibles',
  'THCA Flower',
  'THCA Vapes'
]

export default function EnhancedSearchBar() {
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>(searchCategories[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)
  const [displayText, setDisplayText] = useState(placeholderWords[0])
  const [isTyping, setIsTyping] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Smooth typing animation for placeholder
  useEffect(() => {
    const interval = setInterval(() => {
      const currentWord = placeholderWords[currentPlaceholderIndex]
      const nextIndex = (currentPlaceholderIndex + 1) % placeholderWords.length
      const nextWord = placeholderWords[nextIndex]

      setIsTyping(true)

      // Delete current word (right to left)
      let deleteIndex = currentWord.length
      const deleteInterval = setInterval(() => {
        if (deleteIndex > 0) {
          setDisplayText(currentWord.substring(0, deleteIndex - 1))
          deleteIndex--
        } else {
          clearInterval(deleteInterval)

          // Type new word (left to right)
          let typeIndex = 0
          const typeInterval = setInterval(() => {
            if (typeIndex <= nextWord.length) {
              setDisplayText(nextWord.substring(0, typeIndex))
              typeIndex++
            } else {
              clearInterval(typeInterval)
              setIsTyping(false)
              setCurrentPlaceholderIndex(nextIndex)
            }
          }, 50) // Typing speed
        }
      }, 80) // Delete speed
    }, 3000) // Change word every 3 seconds

    return () => clearInterval(interval)
  }, [currentPlaceholderIndex])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCategorySelect = (category: SearchCategory) => {
    setSelectedCategory(category)
    setIsDropdownOpen(false)
    
    // If user selects a category, navigate to that category page
    if (!searchQuery.trim()) {
      router.push(category.href)
    }
  }

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!searchQuery.trim()) {
      // No search query, just go to selected category
      router.push(selectedCategory.href)
      return
    }

    // Build search URL based on selected category and query
    let searchUrl = '/products'
    const params = new URLSearchParams()

    if (selectedCategory.value !== 'all') {
      if (selectedCategory.value === 'brands') {
        searchUrl = '/brands'
        params.set('q', searchQuery)
      } else if (selectedCategory.href.includes('category=')) {
        // Extract category from href
        const categoryMatch = selectedCategory.href.match(/category=([^&]+)/)
        if (categoryMatch) {
          params.set('category', categoryMatch[1])
        }
        params.set('q', searchQuery)
      } else {
        // Use query-based search
        params.set('q', `${selectedCategory.value} ${searchQuery}`)
      }
    } else {
      params.set('q', searchQuery)
    }

    const finalUrl = `${searchUrl}${params.toString() ? '?' + params.toString() : ''}`
    router.push(finalUrl)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch()
    }
  }

  const currentPlaceholder = `Search for dope ${displayText}`

  return (
    <div className="relative max-w-4xl w-full mx-auto">
      <form onSubmit={handleSearch} className="flex bg-white rounded-lg shadow-lg relative overflow-hidden search-bar-glow transition-all duration-300 hover:shadow-xl focus-within:shadow-xl">
        {/* Category Dropdown */}
        <div className="relative z-20" ref={dropdownRef}>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Dropdown clicked, current state:', isDropdownOpen);
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors border-r border-gray-300 min-w-[140px] text-left relative z-10"
          >
            <span className="text-gray-700 font-medium truncate">
              {selectedCategory.label}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (() => {
            console.log('Rendering dropdown with', searchCategories.length, 'categories');
            return (
            <div
              className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto min-w-[280px] w-max"
              style={{
                position: 'fixed',
                top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 4 : 0,
                left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left : 0,
                zIndex: 9999,
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                minWidth: '280px'
              }}
            >
              {/* Product Types Section */}
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Product Types</span>
              </div>
              {searchCategories.filter(cat => cat.type === 'product').map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                    selectedCategory.value === category.value
                      ? 'bg-dope-orange-50 text-dope-orange-600 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {category.label}
                </button>
              ))}

              {/* Collection Categories Section */}
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 border-t border-gray-200">
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Collection Categories</span>
              </div>
              {searchCategories.filter(cat => cat.type === 'collection').map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                    selectedCategory.value === category.value
                      ? 'bg-dope-orange-50 text-dope-orange-600 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
            );
          })()}
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentPlaceholder}
            className="w-full px-6 py-3 text-gray-900 placeholder-gray-500 focus:outline-none transition-all duration-200"
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          onClick={() => handleSearch()}
          className="px-6 py-3 bg-dope-orange-500 hover:bg-dope-orange-600 text-white transition-colors flex items-center gap-2 font-medium"
        >
          <Search className="w-5 h-5" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>
    </div>
  )
}
