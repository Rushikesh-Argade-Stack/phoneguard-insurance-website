# Vitest Implementation Guide for PhoneGuard Insurance Portal

## Table of Contents
- [Quick Start](#quick-start)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Testing Strategies](#testing-strategies)
- [Component Testing](#component-testing)
- [Hook Testing](#hook-testing)
- [Service Testing](#service-testing)
- [Best Practices](#best-practices)
- [Advanced Features](#advanced-features)
- [Troubleshooting](#troubleshooting)
- [Performance Optimization](#performance-optimization)

## Quick Start

Get Vitest running in your PhoneGuard project in 5 minutes:

```bash
# 1. Install dependencies (already done)
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8

# 2. Run tests
npm test

# 3. Open UI test runner
npm run test:ui

# 4. Run with coverage
npm run test:coverage
```

## Installation & Setup

### Dependencies Installed

Your project now includes these testing dependencies:

```json
{
  "devDependencies": {
    "vitest": "^3.2.4",
    "@vitest/ui": "^3.2.4",
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "jsdom": "^23.0.1",
    "@vitest/coverage-v8": "^3.2.4"
  }
}
```

### Project Structure

Your testing structure is now organized as:

```
src/
├── test/
│   ├── setup.ts              # Global test setup
│   ├── utils.tsx             # Test utilities
│   └── mocks/                # Mock data and handlers
├── components/
│   ├── UI/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Select.tsx
│   │   └── __tests__/
│   │       ├── Button.test.tsx
│   │       ├── Card.test.tsx
│   │       └── Select.test.tsx
│   └── Layout/
│       └── __tests__/
├── hooks/
│   ├── useContentStack.ts
│   └── __tests__/
│       └── useContentStack.test.tsx
└── pages/
    └── __tests__/
```

## Configuration

### vitest.config.ts

Your project is configured with:

```typescript
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts'
      ],
      thresholds: {
        global: {
          functions: 80,
          lines: 80,
          statements: 80,
          branches: 70
        }
      }
    },
    
    // PhoneGuard specific optimizations
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
        minThreads: 1,
        maxThreads: 4
      }
    },
    
    testTimeout: 10000,
    hookTimeout: 10000
  },
  
  // Path aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### Global Setup (src/test/setup.ts)

Configured with mocks for:
- ContentStack SDK
- Lucide React icons
- Browser APIs (matchMedia, IntersectionObserver)
- Window APIs (scrollTo)

## Testing Strategies

### Test Structure Pattern

```typescript
describe('ComponentName', () => {
  // Setup and teardown
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // Rendering tests
  describe('Rendering', () => {
    it('renders correctly with default props', () => {})
    it('handles loading states', () => {})
    it('handles error states', () => {})
  })

  // Interaction tests
  describe('Interactions', () => {
    it('handles user clicks', () => {})
    it('handles form submissions', () => {})
  })

  // Business logic tests
  describe('Business Logic', () => {
    it('filters plans correctly', () => {})
    it('calculates prices accurately', () => {})
  })
})
```

### Testing Pyramid for PhoneGuard

1. **Unit Tests (70%)**: Individual components, hooks, utilities
2. **Integration Tests (20%)**: Component interactions, user flows
3. **E2E Tests (10%)**: Critical user journeys (future)

## Component Testing

### Button Component Example

Your Button component tests cover:

```typescript
import { render, screen, fireEvent } from '../../test/utils'
import { describe, it, expect, vi } from 'vitest'
import Button from '../Button'
import { Shield } from 'lucide-react'

describe('Button Component', () => {
  it('renders with correct text content', () => {
    render(<Button>Get Coverage</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Get Coverage')
  })

  it('applies primary variant by default', () => {
    render(<Button>Test Button</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary-500')
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click Me</Button>)
    
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### Testing Coverage Areas

**For each UI component, test:**
- ✅ Rendering with different props
- ✅ Default and custom styling
- ✅ User interactions
- ✅ State changes
- ✅ Error conditions
- ✅ Accessibility features

## Hook Testing

### useContentStack Hook Example

Your hook tests cover:

```typescript
import { renderHook, waitFor } from '../../test/utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTestimonials } from '../useContentStack'
import * as ContentStackService from '../../services/contentstack'

vi.mock('../../services/contentstack')

describe('useTestimonials', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches testimonials successfully', async () => {
    const mockTestimonials = [
      { id: '1', name: 'John', content: 'Great service!' }
    ]

    vi.mocked(ContentStackService.getTestimonials)
      .mockResolvedValue(mockTestimonials)

    const { result } = renderHook(() => useTestimonials())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.testimonials).toEqual(mockTestimonials)
  })
})
```

### Hook Testing Best Practices

**Test patterns for custom hooks:**
- ✅ Initial state
- ✅ Loading states
- ✅ Success scenarios
- ✅ Error handling
- ✅ Parameter changes triggering refetch
- ✅ Cleanup on unmount

## Service Testing

### ContentStack Service Testing

Mock the ContentStack SDK at the module level:

```typescript
// Mock ContentStack SDK
const mockQuery = {
  find: vi.fn(),
  findOne: vi.fn(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  orderByAscending: vi.fn().mockReturnThis()
}

vi.mock('contentstack', () => ({
  default: {
    Stack: vi.fn(() => ({
      ContentType: vi.fn(() => ({
        Query: vi.fn(() => mockQuery)
      }))
    }))
  }
}))
```

## Best Practices

### 1. Test Organization

```typescript
// ✅ Good: Descriptive test names
it('displays error message when ContentStack API fails')
it('filters insurance plans by selected phone brand')
it('calculates premium correctly with deductible')

// ❌ Bad: Vague test names
it('works correctly')
it('handles edge cases')
```

### 2. Mock Strategies

```typescript
// ✅ Service-level mocking for integration tests
vi.mock('../../services/contentstack', () => ({
  getInsurancePlans: vi.fn(),
  getTestimonials: vi.fn()
}))

// ✅ Component-level mocking for unit tests
vi.mock('lucide-react', () => ({
  Shield: vi.fn(() => 'Shield'),
  Phone: vi.fn(() => 'Phone')
}))
```

### 3. Test Data Management

Use the provided mock utilities:

```typescript
import { 
  mockInsurancePlan, 
  mockTestimonial, 
  mockPhoneModel 
} from '../../test/utils'

// ✅ Generate consistent test data
const plan = mockInsurancePlan({ 
  brand: 'Apple', 
  premiumPerMonth: 24.99 
})
```

### 4. Async Testing

```typescript
// ✅ Proper async testing
it('loads plans after API call', async () => {
  render(<PlansPage />)
  
  await waitFor(() => {
    expect(screen.getByText('iPhone 15 Pro Max')).toBeInTheDocument()
  })
})

// ❌ Missing await
it('loads plans', () => {
  render(<PlansPage />)
  expect(screen.getByText('iPhone 15 Pro Max')).toBeInTheDocument() // Will fail
})
```

## Advanced Features

### UI Test Runner

Launch the beautiful web interface:

```bash
npm run test:ui
```

Features:
- 🎯 Visual test results
- 📁 File tree navigation
- 🔄 Test re-running on file changes
- 📊 Coverage visualization
- 🐛 Error stack traces with source maps

### Coverage Reporting

```bash
npm run test:coverage
```

Generates reports in multiple formats:
- Terminal output (immediate feedback)
- HTML report (`coverage/index.html`)
- JSON report (for CI/CD integration)

### Snapshot Testing

```typescript
// Component snapshot
it('renders correctly', () => {
  const { container } = render(<Button variant="primary">Test</Button>)
  expect(container.firstChild).toMatchSnapshot()
})

// Inline snapshots for data
it('formats premium correctly', () => {
  const formatted = formatPremium(24.99)
  expect(formatted).toMatchInlineSnapshot('"$24.99/month"')
})
```

### Browser Testing

```typescript
// vitest.config.ts - Enable browser testing
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome',
      provider: 'webdriverio'
    }
  }
})
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Import Path Issues

**Problem:** `Cannot find module '@/test/utils'`

**Solution:** Use relative paths in test files:
```typescript
// ❌ May not work in all setups
import { render } from '@/test/utils'

// ✅ Always works
import { render } from '../../test/utils'
```

#### 2. ContentStack Mock Issues

**Problem:** ContentStack SDK not mocking correctly

**Solution:** Check mock setup in `src/test/setup.ts`:
```typescript
vi.mock('contentstack', () => ({
  default: {
    Stack: vi.fn(() => ({
      ContentType: vi.fn(() => ({
        Query: vi.fn(() => ({
          find: vi.fn().mockResolvedValue([[], 0])
        }))
      }))
    }))
  }
}))
```

#### 3. TypeScript Errors

**Problem:** Type errors in test files

**Solution:** Ensure proper imports:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
```

#### 4. Tests Running Slowly

**Problem:** Tests taking too long

**Solutions:**
```typescript
// Optimize test timeout
test: {
  testTimeout: 5000, // Reduce from 10000
  hookTimeout: 5000
}

// Use single thread for small projects
poolOptions: {
  threads: {
    singleThread: true
  }
}
```

### Performance Optimization

#### For PhoneGuard Project Size

```typescript
// vitest.config.ts optimizations
export default defineConfig({
  test: {
    // Optimize for smaller projects
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
        minThreads: 1,
        maxThreads: 4
      }
    },
    
    // Faster transforms
    esbuild: {
      target: 'es2020'
    },
    
    // Optimized watch mode
    watch: {
      ignore: ['coverage/**', 'dist/**']
    }
  }
})
```

## Running Tests

### Available Scripts

```bash
# Run tests in watch mode
npm test

# Run tests once and exit
npm run test:run

# Open UI test runner
npm run test:ui

# Run with coverage
npm run test:coverage

# Run tests in watch mode (explicit)
npm run test:watch
```

### Test Filtering

```bash
# Run specific test file
npm test Button.test.tsx

# Run tests matching pattern
npm test useContentStack

# Run only tests with specific name
npm test -- --grep "renders correctly"
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Test PhoneGuard
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

## Implementation Status

### ✅ Completed

- [x] Vitest configuration
- [x] Test setup and utilities
- [x] Component tests (Button, Card, Select)
- [x] Hook tests (useContentStack)
- [x] ContentStack SDK mocking
- [x] Lucide React icon mocking
- [x] Package.json scripts
- [x] Coverage configuration

### 🔄 Next Steps

1. **Add Page Component Tests**: Create tests for Plans, Home, About, Contact pages
2. **Service Layer Tests**: Add comprehensive ContentStack service tests
3. **Integration Tests**: Test component interactions and user flows
4. **Performance Tests**: Add performance regression testing
5. **Visual Regression**: Add screenshot testing for UI consistency

### 📊 Coverage Goals

- **Functions**: 80%+ ✅
- **Statements**: 80%+ ✅
- **Branches**: 70%+ ✅
- **Lines**: 80%+ ✅

## Best Practices Summary

### Testing Philosophy for PhoneGuard

1. **Test Behavior, Not Implementation**: Focus on what users see and do
2. **Start Simple**: Begin with basic rendering tests, add complexity gradually
3. **Mock External Dependencies**: ContentStack, APIs, browser APIs
4. **Use Real User Interactions**: Click, type, submit forms
5. **Test Error States**: Network failures, empty states, validation errors
6. **Maintain Fast Tests**: Keep unit tests under 100ms each

### Maintenance

1. **Update Tests with Code Changes**: Keep tests in sync with components
2. **Refactor Test Utilities**: Extract common patterns to test utils
3. **Monitor Coverage**: Aim for 80%+ coverage on business logic
4. **Review Test Quality**: Ensure tests actually test meaningful behavior
5. **Performance Monitoring**: Watch for slow tests and optimize

This comprehensive testing setup will ensure your PhoneGuard Insurance Portal is reliable, maintainable, and ready for production deployment.

## Getting Help

- **Vitest Documentation**: https://vitest.dev/
- **Testing Library Docs**: https://testing-library.com/
- **React Testing Patterns**: https://kentcdodds.com/blog/common-mistakes-with-react-testing-library

Your PhoneGuard project now has a robust, fast, and maintainable testing foundation with Vitest! 🎉 