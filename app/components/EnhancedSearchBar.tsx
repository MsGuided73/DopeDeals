'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, Clock, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface SearchSuggestion {
  text: string
  type: 'product' | 'brand' | 'category' | 'popular'
  count?: number
  image_url?: string
}



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
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0)
  const [displayText, setDisplayText] = useState(placeholderWords[0])
  const [isTyping, setIsTyping] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const router = useRouter()
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
      if (searchQuery.length < 1) {
        // Show popular suggestions when no query
        setLoadingSuggestions(true)
        try {
          const response = await fetch(`/api/search/autosuggest?q=&limit=8`)
          if (response.ok) {
            const data = await response.json()
            setSuggestions(data.suggestions || [])
            setShowSuggestions(true)
          }
        } catch (error) {
          console.error('Error fetching popular suggestions:', error)
          setSuggestions([])
        } finally {
          setLoadingSuggestions(false)
        }
        return
      }

      if (searchQuery.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      setLoadingSuggestions(true)
      try {
        const response = await fetch(`/api/search/autosuggest?q=${encodeURIComponent(searchQuery)}&limit=8`)
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

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // Close suggestions dropdown if clicking outside
      if (suggestionsRef.current && !suggestionsRef.current.contains(target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getSuggestionUrl = (suggestion: SearchSuggestion): string => {
    // For popular suggestions, just search for the term
    if (suggestion.type === 'popular') {
      return `/search?q=${encodeURIComponent(suggestion.text)}`
    }

    // For product suggestions, search for the product name
    if (suggestion.type === 'product') {
      return `/search?q=${encodeURIComponent(suggestion.text)}`
    }

    // For brand suggestions, go to brands page or search
    if (suggestion.type === 'brand') {
      return `/search?q=${encodeURIComponent(suggestion.text)}`
    }

    // For category suggestions, try to map to category pages
    if (suggestion.type === 'category') {
      const categoryRoutes: Record<string, string> = {
        'Bongs & Water Pipes': '/bongs',
        'Hand Pipes': '/pipes',
        'Dab Rigs & Tools': '/dabsntools',
        'Vaporizers': '/thca_pnv',
        'Smoking Accessories': '/accessories',
        'THCA Flower': '/thca_flower',
        'Pre-Rolls & Vapes': '/thca_pnv',
        'THCA Prerolls & Vapes': '/thca_pnv',
        'THCA Prerolls': '/thca_pnv',
        'THCA Vapes': '/thca_pnv',
        'THCA Cartridges': '/thca_pnv'
      }

      return categoryRoutes[suggestion.text] || `/search?q=${encodeURIComponent(suggestion.text)}`
    }

    // Default fallback
    return `/search?q=${encodeURIComponent(suggestion.text)}`
  }

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setShowSuggestions(false)

    // Record analytics for suggestion selection
    try {
      if (typeof window !== 'undefined') {
        fetch('/api/search/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: searchQuery,
            resultCount: suggestions.length,
            selectedResult: {
              type: suggestion.type,
              text: suggestion.text,
              url: getSuggestionUrl(suggestion)
            },
            userAgent: navigator?.userAgent || 'Unknown'
          })
        }).catch(() => {}); // Ignore analytics errors
      }
    } catch (error) {
      // Ignore analytics errors
    }

    setSearchQuery('')
    const url = getSuggestionUrl(suggestion)

    // Ensure router is available (prevent SSR issues)
    if (typeof window !== 'undefined' && router) {
      router.push(url)
    } else {
      // Fallback for when router isn't available
      window.location.href = url
    }
  }

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!searchQuery.trim()) {
      // No search query, go to products page
      if (typeof window !== 'undefined' && router) {
        router.push('/products')
      } else {
        window.location.href = '/products'
      }
      return
    }

    setShowSuggestions(false)

    // Check if search query should redirect to THCA page
    const thcaKeywords = ['thca', 'prerolls', 'vapes', 'cartridges', 'disposable'];
    const queryLower = searchQuery.toLowerCase().trim();
    const shouldRedirectToThca = thcaKeywords.some(keyword =>
      queryLower.includes(keyword) &&
      (queryLower.includes('preroll') || queryLower.includes('vape') ||
       queryLower.includes('cartridge') || queryLower.includes('disposable') ||
       (queryLower.includes('thca') && (queryLower.includes('preroll') || queryLower.includes('vape'))))
    );

    if (shouldRedirectToThca) {
      // Redirect to THCA page instead of general search
      if (typeof window !== 'undefined' && router) {
        router.push('/thca_pnv')
      } else {
        window.location.href = '/thca_pnv'
      }
      return
    }

    // Record search analytics
    try {
      if (typeof window !== 'undefined') {
        fetch('/api/search/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: searchQuery,
            userAgent: navigator?.userAgent || 'Unknown'
          })
        }).catch(() => {}) // Ignore analytics errors
      }
    } catch (error) {
      // Ignore analytics errors
    }

    // Build search URL - redirect to dedicated search results page
    const params = new URLSearchParams()
    params.set('q', searchQuery.trim())

    const searchUrl = `/search?${params.toString()}`
    if (typeof window !== 'undefined' && router) {
      router.push(searchUrl)
    } else {
      window.location.href = searchUrl
    }
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

  const currentPlaceholder = `Search Highway 420 for ${displayText}`

  return (
    <div className="relative max-w-xl w-full mx-auto mt-2">
      <form onSubmit={handleSearch} className="flex bg-white rounded-2xl shadow-lg relative overflow-hidden search-bar-glow transition-all duration-300 hover:shadow-xl focus-within:shadow-xl">
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
            placeholder={currentPlaceholder}
            className="w-full px-6 py-0 h-6 text-gray-900 placeholder-gray-500 focus:outline-none transition-all duration-200 font-semibold leading-tight"
            aria-label="Search Highway 420 products"
            role="searchbox"
            autoComplete="off"
          />

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-xl z-50 max-h-96 overflow-y-auto"
              style={{ marginTop: '0.5px' }}
            >
              {loadingSuggestions ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-3 w-6 border-b-2 mx-auto" style={{ borderColor: '#2d8f47' }}></div>
                  <span className="text-sm mt-2 block">Searching...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="py-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.type}-${suggestion.text}-${index}`}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full px-4 py-1 hover:bg-gray-50 transition-colors flex items-center gap-3 text-left"
                    >
                      {suggestion.type === 'product' && suggestion.image_url ? (
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={suggestion.image_url}
                            alt={suggestion.text}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#dcfce7' }}>
                          {suggestion.type === 'brand' ? (
                            <TrendingUp className="w-5 h-5" style={{ color: '#2d8f47' }} />
                          ) : suggestion.type === 'popular' ? (
                            <Clock className="w-5 h-5" style={{ color: '#2d8f47' }} />
                          ) : (
                            <Search className="w-5 h-5" style={{ color: '#2d8f47' }} />
                          )}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 truncate">
                          {suggestion.text}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {suggestion.type === 'popular' ? 'Popular search' :
                           suggestion.type === 'product' ? 'Product' :
                           suggestion.type === 'brand' ? 'Brand' :
                           suggestion.type === 'category' ? 'Category' : ''}
                          {suggestion.count && suggestion.count > 1 && (
                            <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                              {suggestion.count} results
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
          aria-label="Search"
          className="ml-1 mr-1 rounded-full w-6 h-6 bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl hover:bg-white/30 transition-all duration-300 flex items-center justify-center group"
        >
          <Search className="w-4 h-4 text-green-700 drop-shadow-lg group-hover:scale-110 transition-transform duration-200" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
        </button>
      </form>
    </div>
  )
}
