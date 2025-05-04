// input.js - Reusable input component with Tailwind CSS

/**
 * Creates an input element with specified properties using Tailwind CSS
 * @param {Object} props - Input properties
 * @param {string} [props.id=''] - Input ID attribute
 * @param {string} [props.type='text'] - Input type attribute
 * @param {string} [props.placeholder=''] - Input placeholder text
 * @param {string} [props.value=''] - Input value
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {Function} [props.onInput] - Input event handler
 * @param {Function} [props.onChange] - Change event handler
 * @param {boolean} [props.disabled=false] - Input disabled state
 * @returns {HTMLInputElement} - Input DOM element
 */
export function Input(props) {
  const {
    id = '',
    type = 'text',
    placeholder = '',
    value = '',
    className = '',
    onInput,
    onChange,
    disabled = false,
  } = props

  const input = document.createElement('input')
  input.type = type

  // Apply Tailwind classes
  input.classList.add(
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

  if (id) input.id = id
  if (placeholder) input.placeholder = placeholder
  if (value) input.value = value

  // Add disabled styles
  if (disabled) {
    input.disabled = disabled
    input.classList.add('bg-gray-100', 'opacity-75', 'cursor-not-allowed')
  }

  // Add any additional classes
  if (className) {
    className.split(' ').forEach((cls) => {
      if (cls) input.classList.add(cls)
    })
  }

  if (onInput && typeof onInput === 'function') {
    input.addEventListener('input', (e) => {
      // Call the provided onInput handler
      onInput(e)

      // Make sure the input maintains focus
      setTimeout(() => {
        e.target.focus()
      }, 0)
    })
  }

  if (onChange && typeof onChange === 'function') {
    input.addEventListener('change', onChange)
  }

  return input
}
