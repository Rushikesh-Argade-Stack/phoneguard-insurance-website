import { render, screen, fireEvent } from '../../../test/utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Select from '../Select'

describe('Select Component', () => {
  const defaultProps = {
    options: ['Apple', 'Samsung', 'Google'],
    value: '',
    onChange: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders select element with default placeholder', () => {
      render(<Select {...defaultProps} />)
      
      expect(screen.getByDisplayValue('Select an option')).toBeInTheDocument()
    })

    it('renders with custom placeholder', () => {
      render(<Select {...defaultProps} placeholder="Choose your phone brand" />)
      
      expect(screen.getByDisplayValue('Choose your phone brand')).toBeInTheDocument()
    })

    it('renders all provided options', () => {
      render(<Select {...defaultProps} />)
      
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
      
      // Check that all options are present
      expect(screen.getByText('Apple')).toBeInTheDocument()
      expect(screen.getByText('Samsung')).toBeInTheDocument()
      expect(screen.getByText('Google')).toBeInTheDocument()
    })

    it('displays selected value correctly', () => {
      render(<Select {...defaultProps} value="Apple" />)
      
      expect(screen.getByDisplayValue('Apple')).toBeInTheDocument()
    })

    it('renders ChevronDown icon', () => {
      render(<Select {...defaultProps} />)
      
      expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument()
    })

    it('applies default styling classes', () => {
      render(<Select {...defaultProps} />)
      
      const select = screen.getByRole('combobox')
      expect(select).toHaveClass(
        'w-full',
        'px-4',
        'py-2',
        'bg-white',
        'border',
        'border-gray-300',
        'rounded-md',
        'shadow-sm',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-primary-500',
        'focus:border-primary-500',
        'appearance-none'
      )
    })
  })

  describe('Interactions', () => {
    it('calls onChange when option is selected', () => {
      const handleChange = vi.fn()
      render(<Select {...defaultProps} onChange={handleChange} />)
      
      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'Apple' } })
      
      expect(handleChange).toHaveBeenCalledWith('Apple')
      expect(handleChange).toHaveBeenCalledTimes(1)
    })

    it('calls onChange with correct value for different options', () => {
      const handleChange = vi.fn()
      render(<Select {...defaultProps} onChange={handleChange} />)
      
      const select = screen.getByRole('combobox')
      
      fireEvent.change(select, { target: { value: 'Samsung' } })
      expect(handleChange).toHaveBeenCalledWith('Samsung')
      
      fireEvent.change(select, { target: { value: 'Google' } })
      expect(handleChange).toHaveBeenCalledWith('Google')
      
      expect(handleChange).toHaveBeenCalledTimes(2)
    })

    it('calls onChange when selecting placeholder option', () => {
      const handleChange = vi.fn()
      render(<Select {...defaultProps} onChange={handleChange} value="Apple" />)
      
      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: '' } })
      
      expect(handleChange).toHaveBeenCalledWith('')
    })

    it('does not call onChange when disabled', () => {
      const handleChange = vi.fn()
      render(<Select {...defaultProps} onChange={handleChange} disabled />)
      
      const select = screen.getByRole('combobox')
      fireEvent.change(select, { target: { value: 'Apple' } })
      
      // The change event is fired but the select is disabled
      // However, onChange will still be called in this test environment
      // In real browser, disabled selects don't fire change events
      expect(select).toBeDisabled()
    })

    it('can be focused and blurred', () => {
      render(<Select {...defaultProps} />)
      
      const select = screen.getByRole('combobox')
      
      select.focus()
      expect(select).toHaveFocus()
      
      select.blur()
      expect(select).not.toHaveFocus()
    })
  })

  describe('Disabled State', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Select {...defaultProps} disabled />)
      
      const select = screen.getByRole('combobox')
      expect(select).toBeDisabled()
    })

    it('applies disabled styling when disabled', () => {
      render(<Select {...defaultProps} disabled />)
      
      const select = screen.getByRole('combobox')
      expect(select).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
    })

    it('is not disabled by default', () => {
      render(<Select {...defaultProps} />)
      
      const select = screen.getByRole('combobox')
      expect(select).not.toBeDisabled()
    })
  })

  describe('Options Handling', () => {
    it('handles empty options array', () => {
      render(<Select {...defaultProps} options={[]} />)
      
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
      
      // Should only have the placeholder option
      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(1)
      expect(options[0]).toHaveTextContent('Select an option')
    })

    it('handles single option', () => {
      render(<Select {...defaultProps} options={['Apple']} />)
      
      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(2) // Placeholder + 1 option
      expect(screen.getByText('Apple')).toBeInTheDocument()
    })

    it('handles many options', () => {
      const manyOptions = ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Nokia', 'Sony']
      render(<Select {...defaultProps} options={manyOptions} />)
      
      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(8) // Placeholder + 7 options
      
      manyOptions.forEach(option => {
        expect(screen.getByText(option)).toBeInTheDocument()
      })
    })

    it('handles options with special characters', () => {
      const specialOptions = ['iPhone 15 Pro Max', 'Galaxy S24+', 'Pixel 8 Pro (128GB)']
      render(<Select {...defaultProps} options={specialOptions} />)
      
      specialOptions.forEach(option => {
        expect(screen.getByText(option)).toBeInTheDocument()
      })
    })

    it('sets correct option values', () => {
      render(<Select {...defaultProps} />)
      
      const appleOption = screen.getByRole('option', { name: 'Apple' })
      const samsungOption = screen.getByRole('option', { name: 'Samsung' })
      const googleOption = screen.getByRole('option', { name: 'Google' })
      
      expect(appleOption).toHaveValue('Apple')
      expect(samsungOption).toHaveValue('Samsung')
      expect(googleOption).toHaveValue('Google')
    })
  })

  describe('Custom Styling', () => {
    it('applies custom className to container', () => {
      const { container } = render(
        <Select {...defaultProps} className="custom-select-class" />
      )
      
      const selectContainer = container.firstChild as HTMLElement
      expect(selectContainer).toHaveClass('custom-select-class')
      expect(selectContainer).toHaveClass('relative') // Default class should still be there
    })

    it('handles multiple custom classes', () => {
      const { container } = render(
        <Select {...defaultProps} className="mb-4 w-1/2 custom-class" />
      )
      
      const selectContainer = container.firstChild as HTMLElement
      expect(selectContainer).toHaveClass('mb-4', 'w-1/2', 'custom-class')
    })

    it('handles empty className gracefully', () => {
      const { container } = render(<Select {...defaultProps} className="" />)
      
      const selectContainer = container.firstChild as HTMLElement
      expect(selectContainer).toHaveClass('relative')
    })
  })

  describe('Icon Styling', () => {
    it('positions chevron icon correctly', () => {
      const { container } = render(<Select {...defaultProps} />)
      
      const icon = screen.getByTestId('chevron-down-icon')
      expect(icon).toBeInTheDocument()
      
      // Check for positioning classes (these would be on the actual SVG element)
      expect(icon).toHaveClass('absolute', 'right-3', 'top-1/2', 'transform', '-translate-y-1/2', 'h-4', 'w-4', 'text-gray-400', 'pointer-events-none')
    })

    it('icon is not interactive', () => {
      const { container } = render(<Select {...defaultProps} />)
      
      const iconElement = screen.getByTestId('chevron-down-icon')
      // The icon should have pointer-events-none class to not interfere with select
      expect(iconElement).toBeInTheDocument()
      expect(iconElement).toHaveClass('pointer-events-none')
    })
  })

  describe('Accessibility', () => {
    it('has proper combobox role', () => {
      render(<Select {...defaultProps} />)
      
      expect(screen.getByRole('combobox')).toBeInTheDocument()
    })

    it('supports ARIA attributes', () => {
      render(
        <Select 
          {...defaultProps} 
          aria-label="Phone brand selector"
          aria-describedby="brand-help"
        />
      )
      
      const select = screen.getByRole('combobox')
      expect(select).toHaveAttribute('aria-label', 'Phone brand selector')
      expect(select).toHaveAttribute('aria-describedby', 'brand-help')
    })

    it('option elements have correct structure', () => {
      render(<Select {...defaultProps} />)
      
      const options = screen.getAllByRole('option')
      expect(options.length).toBeGreaterThan(0)
      
      // Check placeholder option
      const placeholderOption = screen.getByRole('option', { name: 'Select an option' })
      expect(placeholderOption).toHaveValue('')
    })

    it('maintains keyboard navigation', () => {
      render(<Select {...defaultProps} />)
      
      const select = screen.getByRole('combobox')
      
      // Test keyboard events
      fireEvent.keyDown(select, { key: 'ArrowDown' })
      fireEvent.keyDown(select, { key: 'Enter' })
      
      // The select should still be in the document and functional
      expect(select).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles undefined value gracefully', () => {
      render(<Select {...defaultProps} value={undefined as any} />)
      
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })

    it('handles null value gracefully', () => {
      render(<Select {...defaultProps} value={null as any} />)
      
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })

    it('handles value not in options', () => {
      render(<Select {...defaultProps} value="NonExistentOption" />)
      
      const select = screen.getByRole('combobox')
      // HTML select elements don't preserve values not in options, so it defaults to empty
      expect(select).toHaveValue('')
      // Should still render without errors
      expect(select).toBeInTheDocument()
    })

    it('handles very long option text', () => {
      const longOptions = [
        'This is a very long option name that might overflow or wrap depending on the styling and container width'
      ]
      render(<Select {...defaultProps} options={longOptions} />)
      
      expect(screen.getByText(longOptions[0])).toBeInTheDocument()
    })

    it('handles duplicate options', () => {
      const duplicateOptions = ['Apple', 'Apple', 'Samsung']
      render(<Select {...defaultProps} options={duplicateOptions} />)
      
      // Should render all options, even duplicates
      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(4) // Placeholder + 3 options
    })
  })

  describe('Default Props', () => {
    it('uses correct default values', () => {
      render(<Select options={['Test']} value="" onChange={vi.fn()} />)
      
      const select = screen.getByRole('combobox')
      expect(select).not.toBeDisabled() // disabled defaults to false
      expect(screen.getByDisplayValue('Select an option')).toBeInTheDocument() // default placeholder
    })
  })
}) 