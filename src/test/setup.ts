import '@testing-library/jest-dom'
import React from 'react'
import { vi, afterEach } from 'vitest'
import { configure, cleanup } from '@testing-library/react'

// Configure React Testing Library
configure({
  testIdAttribute: 'data-testid',
})

// Clean up after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Mock ContentStack SDK
vi.mock('contentstack', () => ({
  default: {
    Stack: vi.fn(() => ({
      ContentType: vi.fn(() => ({
        Query: vi.fn(() => ({
          find: vi.fn(),
          findOne: vi.fn(),
          where: vi.fn().mockReturnThis(),
          whereIn: vi.fn().mockReturnThis(),
          whereNotIn: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          skip: vi.fn().mockReturnThis(),
          orderByAscending: vi.fn().mockReturnThis(),
          orderByDescending: vi.fn().mockReturnThis(),
          includeReference: vi.fn().mockReturnThis(),
          only: vi.fn().mockReturnThis(),
          except: vi.fn().mockReturnThis(),
        }))
      }))
    }))
  }
}))

// Mock Lucide React icons
vi.mock('lucide-react', () => ({
  // Common icons used in PhoneGuard
  Shield: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'shield-icon', className }, 'Shield')),
  Phone: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'phone-icon', className }, 'Phone')),
  Star: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'star-icon', className }, 'Star')),
  Check: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'check-icon', className }, 'Check')),
  X: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'x-icon', className }, 'X')),
  ChevronDown: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'chevron-down-icon', className }, 'ChevronDown')),
  Menu: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'menu-icon', className }, 'Menu')),
  Search: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'search-icon', className }, 'Search')),
  Mail: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'mail-icon', className }, 'Mail')),
  MapPin: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'mappin-icon', className }, 'MapPin')),
  DivideIcon: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'divide-icon', className }, 'DivideIcon')),
  Heart: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'heart-icon', className }, 'Heart')),
  Users: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'users-icon', className }, 'Users')),
  Award: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'award-icon', className }, 'Award')),
  FileText: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'filetext-icon', className }, 'FileText')),
  Clock: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'clock-icon', className }, 'Clock')),
  ArrowRight: vi.fn(({ className }) => React.createElement('span', { 'data-testid': 'arrowright-icon', className }, 'ArrowRight')),
}))

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver for lazy loading components
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

// Global test utilities can be imported from utils.tsx when needed 