import { renderHook, waitFor } from '../../test/utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  useTestimonials, 
  useInsurancePlans, 
  useHeroContent, 
  useBenefits,
  useContactPageContent,
  useSearchContent,
  usePaginatedContent
} from '../useContentStack'
import * as ContentStackService from '../../services/contentstack'

// Mock the entire service module
vi.mock('../../services/contentstack')

describe('useContentStack Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useTestimonials', () => {
    it('returns initial loading state', () => {
      vi.mocked(ContentStackService.getTestimonials).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      )

      const { result } = renderHook(() => useTestimonials())

      expect(result.current.loading).toBe(true)
      expect(result.current.testimonials).toEqual([])
      expect(result.current.error).toBeNull()
    })

    it('fetches testimonials successfully', async () => {
      const mockTestimonials = [
        {
          id: '1',
          name: 'Sarah Johnson',
          content: 'Excellent coverage for my iPhone 15!',
          rating: 5,
          featured: true
        },
        {
          id: '2',
          name: 'Mike Chen',
          content: 'Quick claim processing, highly recommended.',
          rating: 5,
          featured: false
        }
      ]

      vi.mocked(ContentStackService.getTestimonials).mockResolvedValue(mockTestimonials)

      const { result } = renderHook(() => useTestimonials())

      expect(result.current.loading).toBe(true)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.testimonials).toEqual(mockTestimonials)
      expect(result.current.error).toBeNull()
      expect(ContentStackService.getTestimonials).toHaveBeenCalledWith(undefined, {})
    })

    it('fetches featured testimonials when specified', async () => {
      const mockFeaturedTestimonials = [
        {
          id: '1',
          name: 'Featured Customer',
          content: 'Amazing service!',
          rating: 5,
          featured: true
        }
      ]

      vi.mocked(ContentStackService.getTestimonials).mockResolvedValue(mockFeaturedTestimonials)

      // Use stable options object
      const options = { limit: 3 }
      const { result } = renderHook(() => useTestimonials(true, options))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(ContentStackService.getTestimonials).toHaveBeenCalledWith(true, options)
      expect(result.current.testimonials).toEqual(mockFeaturedTestimonials)
    })

    it('handles fetch errors gracefully', async () => {
      const errorMessage = 'Network error occurred'
      vi.mocked(ContentStackService.getTestimonials).mockRejectedValue(
        new Error(errorMessage)
      )

      const { result } = renderHook(() => useTestimonials())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe(errorMessage)
      expect(result.current.testimonials).toEqual([])
    })

    it('handles non-Error objects in catch block', async () => {
      vi.mocked(ContentStackService.getTestimonials).mockRejectedValue('String error')

      const { result } = renderHook(() => useTestimonials())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Failed to fetch testimonials')
    })

    it('refetches when featured flag changes', async () => {
      vi.mocked(ContentStackService.getTestimonials).mockResolvedValue([])

      const { result, rerender } = renderHook(
        ({ featured }) => useTestimonials(featured),
        {
          initialProps: { featured: false }
        }
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(ContentStackService.getTestimonials).toHaveBeenCalledTimes(1)

      // Change props to trigger refetch
      rerender({ featured: true })

      await waitFor(() => {
        expect(ContentStackService.getTestimonials).toHaveBeenCalledTimes(2)
      })

      expect(ContentStackService.getTestimonials).toHaveBeenLastCalledWith(true, {})
    })

    it('passes all options correctly', async () => {
      vi.mocked(ContentStackService.getTestimonials).mockResolvedValue([])

      const options = {
        limit: 5,
        includeAuthor: true,
        rating: 4,
        locale: 'en-us'
      }

      renderHook(() => useTestimonials(true, options))

      await waitFor(() => {
        expect(ContentStackService.getTestimonials).toHaveBeenCalledWith(true, options)
      })
    })
  })

  describe('useInsurancePlans', () => {
    it('fetches plans successfully', async () => {
      const mockPlans = [
        {
          id: 'plan-1',
          brand: 'Apple',
          model: 'iPhone 15 Pro Max',
          name: 'Premium Coverage',
          premiumPerMonth: 24.99,
          deductible: 149
        }
      ]

      vi.mocked(ContentStackService.getInsurancePlans).mockResolvedValue(mockPlans)

      const { result } = renderHook(() => useInsurancePlans('Apple', 'iPhone 15 Pro Max'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.plans).toEqual(mockPlans)
      expect(ContentStackService.getInsurancePlans).toHaveBeenCalledWith(
        'Apple',
        'iPhone 15 Pro Max',
        {}
      )
    })

    it('handles brand and model filters', async () => {
      vi.mocked(ContentStackService.getInsurancePlans).mockResolvedValue([])

      // Use stable options object
      const options = {
        featured: true,
        priceRange: { min: 10, max: 30 }
      }

      const { result } = renderHook(() => 
        useInsurancePlans('Samsung', 'Galaxy S24', options)
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(ContentStackService.getInsurancePlans).toHaveBeenCalledWith(
        'Samsung',
        'Galaxy S24',
        options
      )
    })

    it('handles errors in plan fetching', async () => {
      vi.mocked(ContentStackService.getInsurancePlans).mockRejectedValue(
        new Error('Failed to fetch plans')
      )

      const { result } = renderHook(() => useInsurancePlans())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Failed to fetch plans')
      expect(result.current.plans).toEqual([])
    })

    it('refetches when brand or model changes', async () => {
      vi.mocked(ContentStackService.getInsurancePlans).mockResolvedValue([])

      const { rerender } = renderHook(
        ({ brand, model }: { brand: string; model: string }) => useInsurancePlans(brand, model),
        {
          initialProps: { 
            brand: 'Apple', 
            model: 'iPhone 15'
          }
        }
      )

      await waitFor(() => {
        expect(ContentStackService.getInsurancePlans).toHaveBeenCalledTimes(1)
      })

      // Change parameters
      rerender({ 
        brand: 'Samsung', 
        model: 'Galaxy S24'
      })

      await waitFor(() => {
        expect(ContentStackService.getInsurancePlans).toHaveBeenCalledTimes(2)
      })

      expect(ContentStackService.getInsurancePlans).toHaveBeenLastCalledWith(
        'Samsung',
        'Galaxy S24',
        {}
      )
    })
  })

  describe('useHeroContent', () => {
    it('fetches hero content successfully', async () => {
      const mockHeroContent = [
        {
          id: 'hero-1',
          title: 'Protect Your Phone',
          subtitle: 'Comprehensive insurance coverage',
          image: 'hero-image.jpg'
        }
      ]

      vi.mocked(ContentStackService.getHeroContent).mockResolvedValue(mockHeroContent)

      const { result } = renderHook(() => useHeroContent('home'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.content).toEqual(mockHeroContent[0])
      expect(ContentStackService.getHeroContent).toHaveBeenCalledWith('home', {})
    })

    it('handles empty hero content array', async () => {
      vi.mocked(ContentStackService.getHeroContent).mockResolvedValue([])

      const { result } = renderHook(() => useHeroContent('about'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.content).toBeNull()
    })

    it('handles hero content fetch errors silently', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(ContentStackService.getHeroContent).mockRejectedValue(
        new Error('Hero content error')
      )

      const { result } = renderHook(() => useHeroContent('plans'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching hero content:', expect.any(Error))
      expect(result.current.content).toBeNull()

      consoleSpy.mockRestore()
    })

    it('passes options correctly', async () => {
      vi.mocked(ContentStackService.getHeroContent).mockResolvedValue([])

      const options = {
        locale: 'en-us',
        includeAssets: true
      }

      renderHook(() => useHeroContent('contact', options))

      await waitFor(() => {
        expect(ContentStackService.getHeroContent).toHaveBeenCalledWith('contact', options)
      })
    })
  })

  describe('useBenefits', () => {
    it('fetches benefits successfully', async () => {
      const mockBenefits = [
        {
          id: 'benefit-1',
          title: 'Screen Protection',
          description: 'Coverage for cracked screens',
          icon: 'shield-icon'
        },
        {
          id: 'benefit-2',
          title: 'Water Damage',
          description: 'Protection against liquid damage',
          icon: 'water-icon'
        }
      ]

      vi.mocked(ContentStackService.getBenefits).mockResolvedValue(mockBenefits)

      const { result } = renderHook(() => useBenefits('home'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.benefits).toEqual(mockBenefits)
      expect(result.current.error).toBeNull()
      expect(ContentStackService.getBenefits).toHaveBeenCalledWith('home', {})
    })

    it('handles benefits fetch errors', async () => {
      vi.mocked(ContentStackService.getBenefits).mockRejectedValue(
        new Error('Benefits fetch failed')
      )

      const { result } = renderHook(() => useBenefits())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Benefits fetch failed')
      expect(result.current.benefits).toEqual([])
    })

    it('passes page and options correctly', async () => {
      vi.mocked(ContentStackService.getBenefits).mockResolvedValue([])

      const options = {
        limit: 4,
        featured: true,
        locale: 'en-us'
      }

      renderHook(() => useBenefits('plans', options))

      await waitFor(() => {
        expect(ContentStackService.getBenefits).toHaveBeenCalledWith('plans', options)
      })
    })
  })

  describe('useContactPageContent', () => {
    it('fetches contact page content successfully', async () => {
      const mockContactContent = {
        id: 'contact-1',
        title: 'Contact Us',
        email: 'support@phoneguard.com',
        phone: '+1-800-GUARD',
        address: '123 Insurance St'
      }

      vi.mocked(ContentStackService.getContactPageContent).mockResolvedValue(mockContactContent)

      const { result } = renderHook(() => useContactPageContent())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.contactContent).toEqual(mockContactContent)
      expect(result.current.error).toBeNull()
    })

    it('handles contact content errors', async () => {
      vi.mocked(ContentStackService.getContactPageContent).mockRejectedValue(
        new Error('Contact fetch failed')
      )

      const { result } = renderHook(() => useContactPageContent())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Contact fetch failed')
      expect(result.current.contactContent).toBeNull()
    })
  })

  describe('useSearchContent', () => {
    it('fetches search results successfully', async () => {
      const mockResults = [
        { id: '1', title: 'iPhone Insurance', content: 'Apple device protection' },
        { id: '2', title: 'iPhone Plans', content: 'Coverage options for iPhone' }
      ]

      vi.mocked(ContentStackService.searchContent).mockResolvedValue(mockResults)

      // Use stable array reference
      const searchFields = ['title', 'content']
      const { result } = renderHook(() => 
        useSearchContent('insurance_plans', 'iPhone', searchFields)
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.results).toEqual(mockResults)
      expect(result.current.error).toBeNull()
    })

    it('handles empty search term', async () => {
      const searchFields = ['title']
      const { result } = renderHook(() => 
        useSearchContent('insurance_plans', '', searchFields)
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.results).toEqual([])
      expect(ContentStackService.searchContent).not.toHaveBeenCalled()
    })

    it('handles search errors', async () => {
      vi.mocked(ContentStackService.searchContent).mockRejectedValue(
        new Error('Search failed')
      )

      const searchFields = ['title']
      const { result } = renderHook(() => 
        useSearchContent('plans', 'test', searchFields)
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Search failed')
      expect(result.current.results).toEqual([])
    })
  })

  describe('usePaginatedContent', () => {
    it('fetches paginated content successfully', async () => {
      const mockPaginatedData = {
        entries: [
          { id: '1', title: 'Plan 1' },
          { id: '2', title: 'Plan 2' }
        ],
        count: 25
      }

      vi.mocked(ContentStackService.getPaginatedEntries).mockResolvedValue(mockPaginatedData)

      const { result } = renderHook(() => 
        usePaginatedContent('insurance_plans', 1, 10)
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.entries).toEqual(mockPaginatedData.entries)
      expect(result.current.totalCount).toBe(25)
      expect(result.current.currentPage).toBe(1)
      expect(result.current.totalPages).toBe(3) // Math.ceil(25 / 10)
      expect(result.current.error).toBeNull()
    })

    it('handles pagination parameters correctly', async () => {
      vi.mocked(ContentStackService.getPaginatedEntries).mockResolvedValue({
        entries: [],
        count: 0
      })

      renderHook(() => 
        usePaginatedContent('testimonials', 2, 5, {
          where: { featured: true },
          order: 'created_at'
        })
      )

      await waitFor(() => {
        expect(ContentStackService.getPaginatedEntries).toHaveBeenCalledWith(
          'testimonials',
          2,
          5,
          {
            where: { featured: true },
            order: 'created_at'
          }
        )
      })
    })

    it('handles paginated content errors', async () => {
      vi.mocked(ContentStackService.getPaginatedEntries).mockRejectedValue(
        new Error('Pagination failed')
      )

      const { result } = renderHook(() => 
        usePaginatedContent('plans', 1, 10)
      )

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Pagination failed')
      expect(result.current.entries).toEqual([])
      expect(result.current.totalCount).toBe(0)
    })
  })
}) 