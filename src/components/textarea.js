// textarea.js - Reusable textarea component with Tailwind CSS

/**
 * Creates a textarea element with specified properties using Tailwind CSS
 * @param {Object} props - Textarea properties
 * @param {string} [props.id=''] - Textarea ID attribute
 * @param {string} [props.placeholder=''] - Textarea placeholder text
 * @param {string} [props.value=''] - Textarea value
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {number} [props.rows=4] - Number of visible text rows
 * @param {Function} [props.onInput] - Input event handler
 * @param {boolean} [props.disabled=false] - Textarea disabled state
 * @returns {HTMLTextAreaElement} - Textarea DOM element
 */
export function TextArea(props) {
  const {
    id = '',
    placeholder = '',
    value = '',
    className = '',
    rows = 4,
    onInput,
    disabled = false,
  } = props

  const textarea = document.createElement('textarea')
  textarea.rows = rows

  // Apply Tailwind classes
  textarea.classList.add(
    'w-full',
    'px-3',
    'py-2',
    'border',
    'border-gray-300',
    'rounded-md',
    'shadow-sm',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus:border-blue-500',
  )

  if (id) textarea.id = id
  if (placeholder) textarea.placeholder = placeholder
  if (value) textarea.value = value

  // Add disabled styles
  if (disabled) {
    textarea.disabled = disabled
    textarea.classList.add('bg-gray-100', 'opacity-75', 'cursor-not-allowed')
  }

  // Add any additional classes
  if (className) {
    className.split(' ').forEach((cls) => {
      if (cls) textarea.classList.add(cls)
    })
  }

  if (onInput && typeof onInput === 'function') {
    textarea.addEventListener('input', onInput)
  }

  return textarea
}
