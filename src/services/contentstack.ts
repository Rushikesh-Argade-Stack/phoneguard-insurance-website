import Stack from "../lib/contentstack";

// Generic fetch function
export const fetchEntries = async (contentType: string, query: any = {}) => {
    try {
        if (!Stack) {
            console.warn('ContentStack not configured, returning mock data');
            return [] //getMockData(contentType);
        }

        const Query = Stack.ContentType(contentType).Query();

        // Apply query parameters
        Object.keys(query).forEach(key => {
            if (query[key] !== undefined) {
                Query.where(key, query[key]);
            }
        });
        const result = await Query.toJSON().find();
        return result[0];
    } catch (error) {
        console.error(`Error fetching ${contentType}:`, error);
        return [] //getMockData(contentType);
    }
};

// Specific service functions
export const getInsurancePlans = async (brand?: string, model?: string) => {
    const query: any = {};
    if (brand) query.brand = brand;
    if (model) query.model = model;

    return await fetchEntries('insurance_plan', query);
};

export const getPhoneModels = async (brand?: string) => {
    const query: any = {};
    if (brand) query.brand = brand;

    return await fetchEntries('phone_model', query);
};

export const getHeroContent = async (page: string) => {
    return await fetchEntries('hero_section', { page });
};

export const getBenefits = async (page?: string) => {
    const query: any = {};
    if(page ) query.page = page;
    return await fetchEntries('benefits', query);
};

export const getTestimonials = async (featured?: boolean) => {
    const query: any = {};
    if (featured) query.is_featured = true;

    return await fetchEntries('testimonials', query);
};


export const getPageContent = async (slug: string) => {
    return await fetchEntries('page_content', { page_slug: slug });
};



// Mock data fallback
const getMockData = (contentType: string) => {
    switch (contentType) {
        case 'testimonials':
            return [
                { content: "Fantastic service, quick repair!", author_name: "Jane D." },
                { content: "Saved me hundreds after my phone was stolen!", author_name: "Mark S." }
            ];
        default:
            return [];
    }
};