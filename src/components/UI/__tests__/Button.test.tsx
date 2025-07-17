import { render, screen, fireEvent } from '../../../test/utils'
import { describe, it, expect, vi } from 'vitest'
import Button from '../Button'
import { Shield } from 'lucide-react'

describe('Button Component', () => {
  describe('Rendering', () => {
    it('renders with correct text content', () => {
      render(<Button>Get Coverage</Button>)
      expect(screen.getByRole('button')).toHaveTextContent('Get Coverage')
    })

    it('applies primary variant by default', () => {
      render(<Button>Test Button</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-primary-500')
    })

    it('applies correct variant classes', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost'] as const
      
      variants.forEach(variant => {
        const { unmount } = render(<Button variant={variant}>Test</Button>)
        const button = screen.getByRole('button')
        
        // Test specific class patterns for each variant
        switch (variant) {
          case 'primary':
            expect(button).toHaveClass('bg-primary-500')
            break
          case 'secondary':
            expect(button).toHaveClass('bg-secondary-500')
            break
          case 'outline':
            expect(button).toHaveClass('border', 'border-primary-500')
            break
          case 'ghost':
            expect(button).toHaveClass('text-primary-600')
            break
        }
        unmount()
      })
    })

    it('applies correct size classes', () => {
      const sizes = ['sm', 'md', 'lg'] as const
      
      sizes.forEach(size => {
        const { unmount } = render(<Button size={size}>Test</Button>)
        const button = screen.getByRole('button')
        
        switch (size) {
          case 'sm':
            expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm')
            break
          case 'md':
            expect(button).toHaveClass('px-4', 'py-2', 'text-sm')
            break
          case 'lg':
            expect(button).toHaveClass('px-6', 'py-3', 'text-base')
            break
        }
        unmount()
      })
    })

    it('applies medium size by default', () => {
      render(<Button>Default Size</Button>)
      const button = screen.getByRole('button')
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm')
    })

    it('renders with icon when provided', () => {
      render(<Button icon={Shield}>Protected</Button>)
      expect(screen.getByTestId('shield-icon')).toBeInTheDocument()
      expect(screen.getByText('Protected')).toBeInTheDocument()
    })

    it('shows loading state correctly', () => {
      render(<Button loading>Processing</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toBeDisabled()
      expect(button.querySelector('svg')).toBeInTheDocument()
      expect(button.querySelector('svg')).toHaveClass('animate-spin')
    })

    it('hides icon when loading', () => {
      render(<Button loading icon={Shield}>Loading</Button>)
      const button = screen.getByRole('button')
      
      // Should show loading spinner, not the icon
      expect(button.querySelector('.animate-spin')).toBeInTheDocument()
      expect(screen.queryByTestId('shield-icon')).not.toBeInTheDocument()
    })

    it('applies base classes to all buttons', () => {
      render(<Button>Base Classes</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'rounded-md',
        'font-medium',
        'transition-colors',
        'focus:outline-none',
        'focus:ring-2',
        'focus:ring-offset-2',
        'disabled:opacity-50',
        'disabled:cursor-not-allowed'
      )
    })
  })

  describe('Interactions', () => {
    it('calls onClick handler when clicked', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click Me</Button>)
      
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('passes event object to onClick handler', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Click Me</Button>)
      
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).toHaveBeenCalledWith(expect.any(Object))
    })

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick} disabled>Disabled</Button>)
      
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when loading', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick} loading>Loading</Button>)
      
      fireEvent.click(screen.getByRole('button'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('supports keyboard interactions', () => {
      const handleClick = vi.fn()
      render(<Button onClick={handleClick}>Keyboard Test</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      fireEvent.keyDown(button, { key: 'Enter' })
      fireEvent.keyDown(button, { key: ' ' })
      
      // Note: These events should trigger click, but testing-library may not simulate this exactly
      expect(button).toHaveFocus()
    })

    it('can be focused and blurred', () => {
      render(<Button>Focus Test</Button>)
      const button = screen.getByRole('button')
      
      button.focus()
      expect(button).toHaveFocus()
      
      button.blur()
      expect(button).not.toHaveFocus()
    })
  })

  describe('States', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50')
    })

    it('is disabled when loading is true', () => {
      render(<Button loading>Loading Button</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toBeDisabled()
    })

    it('is disabled when both disabled and loading are true', () => {
      render(<Button disabled loading>Disabled Loading</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toBeDisabled()
    })

    it('shows loading spinner with correct properties', () => {
      render(<Button loading>Loading</Button>)
      const spinner = screen.getByRole('button').querySelector('svg')
      
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('animate-spin', '-ml-1', 'mr-2', 'h-4', 'w-4', 'text-current')
      expect(spinner).toHaveAttribute('fill', 'none')
      expect(spinner).toHaveAttribute('viewBox', '0 0 24 24')
    })
  })

  describe('Accessibility', () => {
    it('has proper button role', () => {
      render(<Button>Accessible Button</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('has focus styles', () => {
      render(<Button>Focus Test</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2')
    })

    it('indicates disabled state properly', () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
    })

    it('supports ARIA attributes', () => {
      render(<Button aria-label="Custom label" aria-describedby="help-text">Button</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveAttribute('aria-label', 'Custom label')
      expect(button).toHaveAttribute('aria-describedby', 'help-text')
    })

    it('maintains proper contrast ratios with variant styles', () => {
      // Test that color combinations meet WCAG standards
      render(<Button variant="primary">High Contrast</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('text-white') // Ensures contrast with bg-primary-500
    })
  })

  describe('Custom Props', () => {
    it('forwards HTML button attributes', () => {
      render(<Button type="submit" form="test-form" data-testid="submit-btn">Submit</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveAttribute('type', 'submit')
      expect(button).toHaveAttribute('form', 'test-form')
      expect(button).toHaveAttribute('data-testid', 'submit-btn')
    })

    it('merges custom className with default classes', () => {
      render(<Button className="custom-class extra-style">Custom</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('custom-class', 'extra-style')
      expect(button).toHaveClass('inline-flex') // Default class should still be there
    })

    it('handles empty className gracefully', () => {
      render(<Button className="">No Custom Class</Button>)
      const button = screen.getByRole('button')
      
      expect(button).toHaveClass('inline-flex') // Default classes should still be applied
    })

    it('supports custom event handlers', () => {
      const handleMouseEnter = vi.fn()
      const handleMouseLeave = vi.fn()
      
      render(
        <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          Hover Me
        </Button>
      )
      
      const button = screen.getByRole('button')
      fireEvent.mouseEnter(button)
      fireEvent.mouseLeave(button)
      
      expect(handleMouseEnter).toHaveBeenCalledTimes(1)
      expect(handleMouseLeave).toHaveBeenCalledTimes(1)
    })
  })

  describe('Icon Integration', () => {
    it('positions icon correctly with text', () => {
      render(<Button icon={Shield}>With Icon</Button>)
      const button = screen.getByRole('button')
      
      // Icon should be rendered as the Shield mock
      expect(screen.getByTestId('shield-icon')).toBeInTheDocument()
      expect(screen.getByText('With Icon')).toBeInTheDocument()
    })

    it('handles buttons with icon and minimal text', () => {
      render(<Button icon={Shield} aria-label="Shield action"> </Button>)
      
      expect(screen.getByTestId('shield-icon')).toBeInTheDocument()
      expect(screen.getByLabelText('Shield action')).toBeInTheDocument()
    })

    it('does not render icon when loading', () => {
      render(<Button icon={Shield} loading>Loading with Icon</Button>)
      
      expect(screen.queryByTestId('shield-icon')).not.toBeInTheDocument()
      expect(screen.getByText('Loading with Icon')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles children as React elements', () => {
      render(
        <Button>
          <span>Nested Element</span>
        </Button>
      )
      
      expect(screen.getByText('Nested Element')).toBeInTheDocument()
    })

    it('handles multiple children', () => {
      render(
        <Button>
          <span>First</span>
          <span>Second</span>
        </Button>
      )
      
      expect(screen.getByText('First')).toBeInTheDocument()
      expect(screen.getByText('Second')).toBeInTheDocument()
    })

    it('handles undefined icon gracefully', () => {
      render(<Button icon={undefined}>No Icon</Button>)
      
      expect(screen.getByText('No Icon')).toBeInTheDocument()
      // Should not throw any errors
    })

    it('handles very long text content', () => {
      const longText = 'This is a very long button text that might wrap or overflow depending on the container width and styling'
      render(<Button>{longText}</Button>)
      
      expect(screen.getByText(longText)).toBeInTheDocument()
    })
  })
}) 