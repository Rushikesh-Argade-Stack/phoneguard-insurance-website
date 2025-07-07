import { useEffect, useState } from "react";
import * as ContentStackService from '../services/contentstack';

export const useTestimonials = (featured?: boolean, options: {
    limit?: number;
    includeAuthor?: boolean;
    rating?: number;
    locale?: string;
} = {}) => {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                setLoading(true);
                const result = await ContentStackService.getTestimonials(featured, options);
                setTestimonials(result);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
            }
            finally {
                setLoading(false);
            }
        }
        fetchTestimonials();
    }, [featured, options.limit, options.includeAuthor, options.rating, options.locale])

    return { testimonials, loading, error };
}


export const useInsurancePlans = (brand?: string, model?: string, options: {
    limit?: number;
    featured?: boolean;
    priceRange?: { min: number; max: number };
} = {}) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchPlans = async () => {
        try {
          setLoading(true);
          const result = await ContentStackService.getInsurancePlans(brand, model, options);
          setPlans(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch plans');
        } finally {
          setLoading(false);
        }
      };
  
      fetchPlans();
    }, [brand, model, options.limit, options.featured, options.priceRange]);
  
    return { plans, loading, error };
  };
  
  export const useHeroContent = (page: string, options: {
    locale?: string;
    includeAssets?: boolean;
} = {}) => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchContent = async () => {
        try {
          setLoading(true);
          const result = await ContentStackService.getHeroContent(page, options);
          setContent(result[0] || null);
        } catch (err) {
          console.error('Error fetching hero content:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchContent();
    }, [page, options.locale, options.includeAssets]);
  
    return { content, loading };
  };

  export const useBenefits = (page?: string, options: {
    limit?: number;
    featured?: boolean;
    locale?: string;
} = {}) => {
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBenefits = async () => {
            try {
                setLoading(true);
                const result = await ContentStackService.getBenefits(page, options);
                setBenefits(result);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch benefits');
            }
            finally {
                setLoading(false);
            }
        }
        fetchBenefits();
    }, [page, options.limit, options.featured, options.locale]);

    return { benefits, loading, error };
  }

  export const useContactPageContent = (options: {
    locale?: string;
    includeReferences?: boolean;
} = {}) => {
    const [contactContent, setContactContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContactContent = async () => {
            try {
                setLoading(true);
                const result = await ContentStackService.getContactPageContent(options);
                setContactContent(result);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch contact page content');
            }
            finally {
                setLoading(false);
            }
        }
        fetchContactContent();
    }, [options.locale, options.includeReferences]);

    return { contactContent, loading, error };
  }

  export const useAboutPageContent = (options: {
    locale?: string;
    includeValues?: boolean;
  } = {}) => {
    const [aboutContent, setAboutContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAboutContent = async () => {
            try {
                setLoading(true);
                const result = await ContentStackService.getAboutPageContent(options);
                setAboutContent(result);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch about page content');
            }
            finally {
                setLoading(false);
            }
        }
        fetchAboutContent();
    }, [options.locale, options.includeValues]);

    return { aboutContent, loading, error };
  }

  export const useHomePageContent = (options: {
    locale?: string;
    includeReferences?: boolean;
  } = {}) => {
    const [homeContent, setHomeContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchHomeContent = async () => {
        try {
          setLoading(true);
          const result = await ContentStackService.getHomePageContent(options);
          setHomeContent(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch home content');
        } finally {
          setLoading(false);
        }
      };

      fetchHomeContent();
    }, [options.locale, options.includeReferences]);

    return { homeContent, loading, error };
  };

  // New hooks demonstrating advanced parameter usage

  export const useSearchContent = (contentType: string, searchTerm: string, searchFields: string[], options: {
    filters?: any;
    limit?: number;
    locale?: string;
} = {}) => {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchTerm.trim()) {
                setResults([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const result = await ContentStackService.searchContent(contentType, {
                    searchTerm,
                    searchFields,
                    ...options
                });
                setResults(result);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to search content');
            } finally {
                setLoading(false);
            }
        }

        fetchResults();
    }, [contentType, searchTerm, searchFields, options.filters, options.limit, options.locale]);

    return { results, loading, error };
}

export const usePaginatedContent = (contentType: string, page: number = 1, pageSize: number = 10, options: {
    where?: any;
    order?: string;
    include?: string[];
    locale?: string;
} = {}) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await ContentStackService.getPaginatedEntries(contentType, page, pageSize, options);
                setData(result);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch paginated content');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [contentType, page, pageSize, JSON.stringify(options.where), options.order, JSON.stringify(options.include), options.locale]);

    return { 
        entries: data?.entries || [], 
        totalCount: data?.count || 0,
        currentPage: page,
        totalPages: Math.ceil((data?.count || 0) / pageSize),
        loading, 
        error 
    };
}

// Enhanced hooks demonstrating parameter usage

export const useTestimonialsWithParams = (options: {
    featured?: boolean;
    limit?: number;
    includeAuthor?: boolean;
    rating?: number;
    locale?: string;
} = {}) => {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                setLoading(true);
                const result = await ContentStackService.getTestimonials(options.featured, {
                    limit: options.limit,
                    includeAuthor: options.includeAuthor,
                    rating: options.rating,
                    locale: options.locale
                });
                setTestimonials(result);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch testimonials');
            }
            finally {
                setLoading(false);
            }
        }
        fetchTestimonials();
    }, [options.featured, options.limit, options.includeAuthor, options.rating, options.locale])

    return { testimonials, loading, error };
}

export const useContactPageContentWithLocale = (options: {
    locale?: string;
    includeReferences?: boolean;
} = {}) => {
    const [contactContent, setContactContent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContactContent = async () => {
            try {
                setLoading(true);
                const result = await ContentStackService.getContactPageContent(options);
                setContactContent(result);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch contact page content');
            }
            finally {
                setLoading(false);
            }
        }
        fetchContactContent();
    }, [options.locale, options.includeReferences]);

    return { contactContent, loading, error };
}