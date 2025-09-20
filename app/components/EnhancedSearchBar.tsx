'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, Clock, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface SearchCategory {
  label: string
  value: string
  href: string
  type: 'product' | 'collection'
}

interface SearchSuggestion {
  type: 'product' | 'brand' | 'category'
  id: string
  title: string
  subtitle: string
  price?: number
  image?: string
  url: string
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
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

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

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setLoadingSuggestions(true)
      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&limit=8`)
        if (response.ok) {
          const data = await response.json()
          setSuggestions(data.suggestions || [])
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      } finally {
        setLoadingSuggestions(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // Close category dropdown if clicking outside
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsDropdownOpen(false)
      }

      // Close suggestions dropdown if clicking outside
      if (suggestionsRef.current && !suggestionsRef.current.contains(target)) {
        setShowSuggestions(false)
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

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setShowSuggestions(false)

    // Record analytics for suggestion selection
    try {
      fetch('/api/search/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          resultCount: suggestions.length,
          selectedResult: {
            type: suggestion.type,
            title: suggestion.title,
            url: suggestion.url
          },
          userAgent: navigator.userAgent
        })
      }).catch(() => {}); // Ignore analytics errors
    } catch (error) {
      // Ignore analytics errors
    }

    setSearchQuery('')
    router.push(suggestion.url)
  }

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!searchQuery.trim()) {
      // No search query, just go to selected category
      router.push(selectedCategory.href)
      return
    }

    setShowSuggestions(false)

    // Record search analytics
    try {
      fetch('/api/search/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          category: selectedCategory.value,
          userAgent: navigator.userAgent
        })
      }).catch(() => {}) // Ignore analytics errors
    } catch (error) {
      // Ignore analytics errors
    }

    // Build search URL - redirect to dedicated search results page
    const params = new URLSearchParams()
    params.set('q', searchQuery.trim())

    // Add category filter if not "all"
    if (selectedCategory.value !== 'all') {
      params.set('category', selectedCategory.value)
    }

    const searchUrl = `/search?${params.toString()}`
    router.push(searchUrl)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showSuggestions && suggestions.length > 0) {
        // If suggestions are showing, select the first one
        handleSuggestionSelect(suggestions[0])
      } else {
        handleSearch()
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
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
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] max-h-80 overflow-y-auto min-w-[280px] w-max">
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
              <div className="px-3 py-2 bg-gray-50 border-y border-gray-200">
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
          )}
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
            placeholder={currentPlaceholder}
            className="w-full px-6 py-3 text-gray-900 placeholder-gray-500 focus:outline-none transition-all duration-200"
          />

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (searchQuery.length >= 2) && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-xl z-[9999] max-h-96 overflow-y-auto"
              style={{ marginTop: '1px' }}
            >
              {loadingSuggestions ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-dope-orange-500 mx-auto"></div>
                  <span className="text-sm mt-2 block">Searching...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="py-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.type}-${suggestion.id}-${index}`}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                    >
                      {suggestion.type === 'product' && suggestion.image ? (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={suggestion.image}
                            alt={suggestion.title}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-dope-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {suggestion.type === 'brand' ? (
                            <TrendingUp className="w-5 h-5 text-dope-orange-600" />
                          ) : (
                            <Search className="w-5 h-5 text-dope-orange-600" />
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {suggestion.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {suggestion.subtitle}
                          {suggestion.price && (
                            <span className="ml-2 font-medium text-dope-orange-600">
                              ${suggestion.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <span className="text-sm">No results found for "{searchQuery}"</span>
                </div>
              )}
            </div>
          )}
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
