// label.js - Reusable label component with Tailwind CSS

/**
 * Creates a label element with specified properties using Tailwind CSS
 * @param {Object} props - Label properties
 * @param {string} props.text - Label text content
 * @param {string} [props.forId=''] - For attribute linking to input ID
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {HTMLLabelElement} - Label DOM element
 */
export function Label(props) {
  const { text, forId = '', className = '' } = props

  const label = document.createElement('label')
  label.textContent = text

  // Apply Tailwind classes
  label.classList.add('block', 'text-sm', 'font-medium', 'text-gray-700', 'mb-1')

  if (forId) {
    label.htmlFor = forId
  }

  // Add any additional classes
  if (className) {
    className.split(' ').forEach((cls) => {
      if (cls) label.classList.add(cls)
    })
  }

  return label
}
