import { useEffect, useState } from "react";
import * as ContentStackService from '../services/contentstack';

export const useTestimonials = (featured?: boolean) => {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                setLoading(true);
                const result = await ContentStackService.getTestimonials(featured);
                setTestimonials(result);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch plans');
            }
            finally {
                setLoading(false);
            }
        }
        fetchTestimonials();
    }, [featured])

    return { testimonials, loading, error };
}


export const useInsurancePlans = (brand?: string, model?: string) => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchPlans = async () => {
        try {
          setLoading(true);
          const result = await ContentStackService.getInsurancePlans(brand, model);
          setPlans(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch plans');
        } finally {
          setLoading(false);
        }
      };
  
      fetchPlans();
    }, [brand, model]);
  
    return { plans, loading, error };
  };
  
  export const useHeroContent = (page: string) => {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchContent = async () => {
        try {
          setLoading(true);
          const result = await ContentStackService.getHeroContent(page);
          setContent(result[0] || null);
        } catch (err) {
          console.error('Error fetching hero content:', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchContent();
    }, [page]);
  
    return { content, loading };
  };

  export const useBenefits = () => {
    const [benefits, setBenefits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBenefits = async () => {
            try {
                setLoading(true);
                const result = await ContentStackService.getBenefits();
                setBenefits(result);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Failed to fetch benefits');
            }
            finally {
                setLoading(false);
            }
        }
        fetchBenefits();
    }, []);

    return { benefits, loading, error };
  }