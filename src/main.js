// main.js - The entry point for our SWAPI UI application with Tailwind CSS

import { Button } from './components/button.js'
import { Input } from './components/input.js'
import { Label } from './components/label.js'
import { TextArea } from './components/textarea.js'

// Store for our application state
let store = {
  data: null,
  loading: false,
  error: null,
  category: 'people',
  searchTerm: '',
}

// Action types
const ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_ERROR: 'FETCH_ERROR',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
}

// Reducer to handle state updates
function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null }
    case ACTIONS.FETCH_SUCCESS:
      return { ...state, loading: false, data: action.payload }
    case ACTIONS.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload }
    case ACTIONS.SET_CATEGORY:
      return { ...state, category: action.payload, data: null }
    case ACTIONS.SET_SEARCH_TERM:
      return { ...state, searchTerm: action.payload }
    default:
      return state
  }
}

// Dispatch function to trigger state updates
function dispatch(action) {
  store = reducer(store, action)
  renderApp()
}

// Function to fetch data from SWAPI
async function fetchSwapiData() {
  // Make sure the searchTerm is up to date from the input field
  const searchInput = document.getElementById('search-input')
  if (searchInput) {
    store.searchTerm = searchInput.value
  }

  dispatch({ type: ACTIONS.FETCH_START })

  try {
    let url = `https://swapi.tech/api/${store.category}`

    if (store.searchTerm) {
      url += `?search=${encodeURIComponent(store.searchTerm)}`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Failed to fetch data from SWAPI')
    }

    const data = await response.json()
    dispatch({ type: ACTIONS.FETCH_SUCCESS, payload: data })

    // After successful fetch, maintain focus on the input if it was active
    if (searchInput && document.activeElement === searchInput) {
      setTimeout(() => searchInput.focus(), 0)
    }
  } catch (error) {
    dispatch({ type: ACTIONS.FETCH_ERROR, payload: error.message })
  }
}

// Function to create app structure
function createAppStructure() {
  const app = document.getElementById('app') || document.body
  app.innerHTML = ''
  app.className = 'container mx-auto px-4 py-8'

  // Create header
  const header = document.createElement('header')
  header.className = 'mb-8'

  const title = document.createElement('h1')
  title.className = 'text-3xl font-bold text-gray-800 mb-2'
  title.textContent = 'Star Wars API Explorer'

  const subtitle = document.createElement('p')
  subtitle.className = 'text-gray-600'
  subtitle.textContent = 'Search for information about the Star Wars universe'

  header.appendChild(title)
  header.appendChild(subtitle)
  app.appendChild(header)

  // Create main sections with Tailwind classes
  const sections = [
    { id: 'categories', className: 'flex flex-wrap gap-2 mb-6' },
    { id: 'search', className: 'flex flex-wrap items-end gap-4 mb-6' },
    { id: 'results', className: 'mb-6' },
    { id: 'details', className: 'hidden' }, // Hidden by default
  ]

  sections.forEach(({ id, className }) => {
    const section = document.createElement('div')
    section.id = id
    section.className = className
    app.appendChild(section)
  })

  return app
}

// Function to render our categories
function renderCategories() {
  const categories = ['people', 'planets', 'species', 'starships', 'vehicles']
  const categoryContainer = document.getElementById('categories')
  categoryContainer.innerHTML = ''

  const heading = document.createElement('div')
  heading.className = 'w-full mb-2'
  heading.innerHTML = '<h2 class="text-xl font-semibold text-gray-700">Categories</h2>'
  categoryContainer.appendChild(heading)

  categories.forEach((category) => {
    const btn = Button({
      text: category.charAt(0).toUpperCase() + category.slice(1),
      onClick: () => {
        dispatch({ type: ACTIONS.SET_CATEGORY, payload: category })
        fetchSwapiData()
      },
      className: store.category === category ? 'active' : '',
      variant: store.category === category ? 'primary' : 'secondary',
    })
    categoryContainer.appendChild(btn)
  })
}

// Function to render search
function renderSearch() {
  const searchContainer = document.getElementById('search')
  searchContainer.innerHTML = ''

  // Create search form wrapper
  const searchForm = document.createElement('div')
  searchForm.className = 'w-full sm:flex sm:items-end sm:gap-4'

  // Create input group
  const inputGroup = document.createElement('div')
  inputGroup.className = 'flex-grow mb-4 sm:mb-0'

  const label = Label({
    text: `Search ${store.category}:`,
    forId: 'search-input',
  })
  inputGroup.appendChild(label)

  const input = Input({
    id: 'search-input',
    placeholder: `Enter search term...`,
    value: store.searchTerm,
    onInput: (e) => {
      // Update the store directly without triggering a full re-render
      store.searchTerm = e.target.value
      // Only update the results section, not the entire UI
      document.querySelector('#search-input').focus()
    },
  })
  inputGroup.appendChild(input)

  // Create button
  const searchBtn = Button({
    text: 'Search',
    onClick: () => {
      // Update the store with the current input value
      dispatch({
        type: ACTIONS.SET_SEARCH_TERM,
        payload: document.querySelector('#search-input').value,
      })
      fetchSwapiData()
    },
  })

  // Add elements to form
  searchForm.appendChild(inputGroup)
  searchForm.appendChild(searchBtn)

  // Add form to container
  searchContainer.appendChild(searchForm)
}

// Function to render results
function renderResults() {
  const resultsContainer = document.getElementById('results')
  resultsContainer.innerHTML = ''

  // Create results header
  const resultsHeader = document.createElement('div')
  resultsHeader.className = 'flex justify-between items-center mb-4'

  const resultsTitle = document.createElement('h2')
  resultsTitle.className = 'text-xl font-semibold text-gray-700'
  resultsTitle.textContent = `Results for "${store.category}"`
  resultsHeader.appendChild(resultsTitle)

  resultsContainer.appendChild(resultsHeader)

  // Create results content
  const resultsContent = document.createElement('div')
  resultsContent.className = 'bg-white rounded-lg shadow-md p-4'

  if (store.loading) {
    const loader = document.createElement('div')
    loader.className = 'flex justify-center items-center py-12'
    loader.innerHTML = `
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-3 text-gray-600">Loading...</span>
    `
    resultsContent.appendChild(loader)
  } else if (store.error) {
    const errorMsg = document.createElement('div')
    errorMsg.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded'
    errorMsg.innerHTML = `
      <p class="font-bold">Error</p>
      <p>${store.error}</p>
    `
    resultsContent.appendChild(errorMsg)
  } else if (!store.data) {
    const emptyState = document.createElement('div')
    emptyState.className = 'text-center py-12 text-gray-500'
    emptyState.innerHTML = `
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      <p class="mt-2">Search for Star Wars data using the controls above</p>
    `
    resultsContent.appendChild(emptyState)
  } else {
    const results = store.data.result || store.data.results || []

    if (results.length === 0) {
      const noResults = document.createElement('div')
      noResults.className = 'text-center py-12 text-gray-500'
      noResults.innerHTML = `
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="mt-2">No results found. Try a different search.</p>
      `
      resultsContent.appendChild(noResults)
    } else {
      const resultsList = document.createElement('div')
      resultsList.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'

      results.forEach((item) => {
        const resultItem = document.createElement('div')
        resultItem.className = 'result-card'

        // Handle different data structures from SWAPI
        const name = item.name || item.properties?.name || 'Unknown'
        const description = item.description || ''
        const url = item.url || ''

        const nameElem = document.createElement('h3')
        nameElem.className = 'text-lg font-medium text-blue-600 mb-2'
        nameElem.textContent = name
        resultItem.appendChild(nameElem)

        if (description) {
          const descElem = document.createElement('p')
          descElem.className = 'text-gray-600 text-sm mb-4'
          descElem.textContent = description
          resultItem.appendChild(descElem)
        }

        const detailsBtn = Button({
          text: 'View Details',
          variant: 'secondary',
          onClick: () => {
            if (url) {
              fetchItemDetails(url)
            } else if (item.uid) {
              fetchItemDetails(`https://swapi.tech/api/${store.category}/${item.uid}`)
            }
          },
        })
        resultItem.appendChild(detailsBtn)

        resultsList.appendChild(resultItem)
      })

      resultsContent.appendChild(resultsList)
    }
  }

  resultsContainer.appendChild(resultsContent)
}

// Function to fetch and display details for a specific item
async function fetchItemDetails(url) {
  try {
    const detailsContainer = document.getElementById('details')
    detailsContainer.className = 'details-modal'
    detailsContainer.innerHTML = `
      <div class="flex justify-center items-center h-full w-full">
        <div class="bg-white rounded-lg shadow-xl p-6 max-w-xl w-full relative">
          <div class="animate-pulse flex flex-col">
            <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-4/6 mb-2"></div>
          </div>
        </div>
      </div>
    `

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Failed to fetch details')
    }

    const data = await response.json()
    const result = data.result || data
    const properties = result.properties || result

    const detailsContent = document.createElement('div')
    detailsContent.className = 'details-content'

    // Close button
    const closeBtn = document.createElement('button')
    closeBtn.className = 'close-btn'
    closeBtn.innerHTML = '&times;'
    closeBtn.addEventListener('click', () => {
      detailsContainer.className = 'hidden'
    })
    detailsContent.appendChild(closeBtn)

    // Title
    const title = document.createElement('h2')
    title.className = 'text-2xl font-bold text-gray-800 mb-4'
    title.textContent = properties.name || 'Details'
    detailsContent.appendChild(title)

    // Details list
    const detailsList = document.createElement('div')
    detailsList.className = 'grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2'

    // Display all properties
    for (const [key, value] of Object.entries(properties)) {
      if (key !== 'name' && value && typeof value !== 'object') {
        const item = document.createElement('div')
        item.className = 'mb-2'

        const label = document.createElement('span')
        label.className = 'text-sm font-medium text-gray-500'
        label.textContent = key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

        const valueElem = document.createElement('div')
        valueElem.className = 'text-gray-800'
        valueElem.textContent = value

        item.appendChild(label)
        item.appendChild(valueElem)
        detailsList.appendChild(item)
      }
    }

    detailsContent.appendChild(detailsList)

    // Clear container and add content
    detailsContainer.innerHTML = ''
    detailsContainer.appendChild(detailsContent)
  } catch (error) {
    const detailsContainer = document.getElementById('details')
    detailsContainer.className = 'details-modal'

    const errorContent = document.createElement('div')
    errorContent.className = 'details-content'

    const closeBtn = document.createElement('button')
    closeBtn.className = 'close-btn'
    closeBtn.innerHTML = '&times;'
    closeBtn.addEventListener('click', () => {
      detailsContainer.className = 'hidden'
    })
    errorContent.appendChild(closeBtn)

    const errorMessage = document.createElement('div')
    errorMessage.className = 'bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded'
    errorMessage.innerHTML = `
      <p class="font-bold">Error</p>
      <p>${error.message}</p>
    `
    errorContent.appendChild(errorMessage)

    detailsContainer.innerHTML = ''
    detailsContainer.appendChild(errorContent)
  }
}

// Main render function
function renderApp() {
  // Store focused element ID before rendering
  const activeElementId = document.activeElement ? document.activeElement.id : null

  // Render UI components
  renderCategories()
  renderSearch()
  renderResults()

  // Restore focus if needed
  if (activeElementId) {
    const elementToFocus = document.getElementById(activeElementId)
    if (elementToFocus) {
      setTimeout(() => {
        elementToFocus.focus()
      }, 0)
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create main app structure
  createAppStructure()

  // Initialize the UI
  renderApp()

  // Initial data fetch
  fetchSwapiData()

  // Handle keyboard events
  document.addEventListener('keydown', (e) => {
    // Close modal on Escape key
    if (e.key === 'Escape') {
      const detailsContainer = document.getElementById('details')
      detailsContainer.className = 'hidden'
    }

    // Search on Enter key when search input is focused
    if (e.key === 'Enter' && document.activeElement.id === 'search-input') {
      // Update the store with the current input value
      dispatch({
        type: ACTIONS.SET_SEARCH_TERM,
        payload: document.querySelector('#search-input').value,
      })
      fetchSwapiData()
      e.preventDefault()
    }
  })
})

// Export functions for testing/debugging
export { store, dispatch, fetchSwapiData }
