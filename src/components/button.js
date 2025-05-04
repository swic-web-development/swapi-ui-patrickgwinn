// button.js - Reusable button component with Tailwind CSS

/**
 * Creates a button element with specified properties using Tailwind CSS
 * @param {Object} props - Button properties
 * @param {string} props.text - Button text content
 * @param {Function} props.onClick - Click event handler
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.type='button'] - Button type attribute
 * @param {boolean} [props.disabled=false] - Button disabled state
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary)
 * @returns {HTMLButtonElement} - Button DOM element
 */
export function Button(props) {
  const {
    text,
    onClick,
    className = '',
    type = 'button',
    disabled = false,
    variant = 'primary',
  } = props

  const button = document.createElement('button')
  button.textContent = text
  button.type = type
  button.disabled = disabled

  // Apply Tailwind classes based on variant
  if (variant === 'primary') {
    button.classList.add('btn-primary')
  } else if (variant === 'secondary') {
    button.classList.add('btn-secondary')
  } else {
    // Default Tailwind classes for custom variants
    button.classList.add('px-4', 'py-2', 'rounded', 'transition', 'duration-200')
  }

  // Add any additional classes
  if (className) {
    className.split(' ').forEach((cls) => {
      if (cls) button.classList.add(cls)
    })
  }

  // Add disabled styles
  if (disabled) {
    button.classList.add('opacity-50', 'cursor-not-allowed')
  }

  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick)
  }

  return button
}
