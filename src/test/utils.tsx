import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi, expect } from 'vitest'

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Mock data generators for PhoneGuard project
export const mockTestimonial = (overrides = {}) => ({
  id: 'test-testimonial-1',
  name: 'John Doe',
  content: 'Great insurance coverage for my iPhone!',
  rating: 5,
  featured: true,
  createdAt: '2024-01-01',
  ...overrides
})

export const mockInsurancePlan = (overrides = {}) => ({
  id: 'test-plan-1',
  brand: 'Apple',
  model: 'iPhone 15 Pro Max',
  name: 'Premium Coverage',
  premiumPerMonth: 24.99,
  deductible: 149,
  features: {
    theft: true,
    screenRepair: true,
    waterDamage: true,
    upgradeOption: true
  },
  ...overrides
})

export const mockPhoneModel = (overrides = {}) => ({
  brand: 'Apple',
  model: 'iPhone 15 Pro Max',
  releaseYear: 2023,
  basePrice: 1199,
  ...overrides
})

export const mockContactForm = (overrides = {}) => ({
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  phone: '+1234567890',
  subject: 'Insurance inquiry',
  message: 'I need information about iPhone insurance plans.',
  ...overrides
})

// Mock API responses
export const mockContentStackResponse = (data: any[], total = data.length) => [
  data,
  total
]

// Custom matchers and utilities
export const waitForLoadingToFinish = () => 
  vi.waitFor(() => expect(document.querySelector('.loading')).not.toBeInTheDocument())

export const expectElementToHaveLoadingState = (element: HTMLElement) => {
  expect(element).toHaveAttribute('aria-busy', 'true')
}

// Mock hook return values
export const mockUseContentStackReturn = {
  testimonials: {
    testimonials: [mockTestimonial()],
    loading: false,
    error: null
  },
  insurancePlans: {
    plans: [mockInsurancePlan()],
    loading: false,
    error: null
  },
  phoneModels: {
    phoneModels: [mockPhoneModel()],
    loading: false,
    error: null
  }
}

// Test data for plan filtering
export const mockInsurancePlans = [
  mockInsurancePlan({
    id: 'plan-1',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    name: 'Basic Coverage',
    premiumPerMonth: 15.99
  }),
  mockInsurancePlan({
    id: 'plan-2',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    name: 'Premium Coverage',
    premiumPerMonth: 24.99
  }),
  mockInsurancePlan({
    id: 'plan-3',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    name: 'Basic Coverage',
    premiumPerMonth: 18.99
  }),
  mockInsurancePlan({
    id: 'plan-4',
    brand: 'Google',
    model: 'Pixel 8 Pro',
    name: 'Premium Coverage',
    premiumPerMonth: 22.99
  })
]

// Test data for phone models
export const mockPhoneModels = [
  mockPhoneModel({ brand: 'Apple', model: 'iPhone 15 Pro Max' }),
  mockPhoneModel({ brand: 'Apple', model: 'iPhone 15 Pro' }),
  mockPhoneModel({ brand: 'Samsung', model: 'Galaxy S24 Ultra' }),
  mockPhoneModel({ brand: 'Samsung', model: 'Galaxy S24' }),
  mockPhoneModel({ brand: 'Google', model: 'Pixel 8 Pro' }),
  mockPhoneModel({ brand: 'OnePlus', model: '12 Pro' }),
  mockPhoneModel({ brand: 'Xiaomi', model: '14 Ultra' })
]

// Mock window dimensions for responsive testing
export const mockWindowDimensions = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width
  })
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height
  })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { customRender as render } 