import Stack from "../lib/contentstack";

// Enhanced generic fetch function with comprehensive parameter support
export const fetchEntries = async (contentType: string, options: {
    where?: any;
    include?: string[];
    only?: string[];
    except?: string[];
    limit?: number;
    skip?: number;
    order?: string;
    locale?: string;
    includeCount?: boolean;
    includeContentType?: boolean;
    includeFallback?: boolean;
} = {}) => {
    try {
        if (!Stack) {
            console.warn('ContentStack not configured, returning mock data');
            return getMockData(contentType);
        }

        const Query = Stack.ContentType(contentType).Query();

        // Apply WHERE conditions
        if (options.where) {
            Object.keys(options.where).forEach(key => {
                if (options.where[key] !== undefined) {
                    Query.where(key, options.where[key]);
                }
            });
        }

        // Include referenced content
        if (options.include && options.include.length > 0) {
            options.include.forEach(field => {
                Query.includeReference(field);
            });
        }

        // Select only specific fields
        if (options.only && options.only.length > 0) {
            Query.only(options.only);
        }

        // Exclude specific fields
        if (options.except && options.except.length > 0) {
            Query.except(options.except);
        }

        // Set limit
        if (options.limit) {
            Query.limit(options.limit);
        }

        // Set skip for pagination
        if (options.skip) {
            Query.skip(options.skip);
        }

        // Set ordering
        if (options.order) {
            if (options.order.startsWith('-')) {
                Query.descending(options.order.substring(1));
            } else {
                Query.ascending(options.order);
            }
        }

        // Set locale
        if (options.locale) {
            Query.language(options.locale);
        }

        // Include count
        if (options.includeCount) {
            Query.includeCount();
        }

        // Include content type
        if (options.includeContentType) {
            Query.includeContentType();
        }

        // Include fallback
        if (options.includeFallback) {
            Query.includeFallback();
        }

        const result = await Query.toJSON().find();
        return result[0][0];
    } catch (error) {
        console.error(`Error fetching ${contentType}:`, error);
        return getMockData(contentType);
    }
};

// Specific service functions with enhanced parameters
export const getInsurancePlans = async (brand?: string, model?: string, options: {
    limit?: number;
    featured?: boolean;
    priceRange?: { min: number; max: number };
} = {}) => {
    const query: any = {};
    if (brand) query.brand = brand;
    if (model) query.model = model;
    if (options.featured) query.is_featured = true;
    if (options.priceRange) {
        query.price = { 
            $gte: options.priceRange.min, 
            $lte: options.priceRange.max 
        };
    }

    return await fetchEntries('insurance_plan', {
        where: query,
        limit: options.limit,
        order: '-created_at'
    });
};

export const getPhoneModels = async (brand?: string, options: {
    limit?: number;
    includeSpecs?: boolean;
} = {}) => {
    const query: any = {};
    if (brand) query.brand = brand;

    return await fetchEntries('phone_model', {
        where: query,
        limit: options.limit,
        include: options.includeSpecs ? ['specifications'] : undefined,
        order: 'model_name'
    });
};

export const getHeroContent = async (page: string, options: {
    locale?: string;
    includeAssets?: boolean;
} = {}) => {
    return await fetchEntries('hero_section', { 
        where: { page },
        locale: options.locale,
        include: options.includeAssets ? ['background_image', 'cta_button'] : undefined
    });
};

export const getBenefits = async (page?: string, options: {
    limit?: number;
    featured?: boolean;
    locale?: string;
} = {}) => {
    const query: any = {};
    if (page) query.page = page;
    if (options.featured) query.is_featured = true;
    
    return await fetchEntries('benefits', {
        where: query,
        limit: options.limit,
        locale: options.locale,
        order: 'order'
    });
};

export const getTestimonials = async (featured?: boolean, options: {
    limit?: number;
    includeAuthor?: boolean;
    rating?: number;
    locale?: string;
} = {}) => {
    const query: any = {};
    if (featured) query.is_featured = true;
    if (options.rating) query.rating = { $gte: options.rating };

    return await fetchEntries('testimonials', {
        where: query,
        limit: options.limit,
        include: options.includeAuthor ? ['author'] : undefined,
        locale: options.locale,
        order: '-created_at'
    });
};

export const getPageContent = async (slug: string, options: {
    locale?: string;
    includeReferences?: boolean;
} = {}) => {
    return await fetchEntries('page_content', { 
        where: { page_slug: slug },
        locale: options.locale,
        include: options.includeReferences ? ['related_pages', 'seo_settings'] : undefined
    });
};

export const getContactPageContent = async (options: {
    locale?: string;
    includeReferences?: boolean;
} = {}) => {
    return await fetchEntries('contact_us_page', {
        locale: options.locale,
        include: options.includeReferences ? ['chat_details.icon'] : undefined
    });
};

export const getAboutPageContent = async (options: {
    locale?: string;
    includeValues?: boolean;
} = {}) => {
    return await fetchEntries('about_page', {
        locale: options.locale,
        include: options.includeValues ? ['values_references'] : undefined
    });
};

export const getHomePageContent = async (options: {
    locale?: string;
    includeReferences?: boolean;
} = {}) => {
    return await fetchEntries('home_page', {
        locale: options.locale,
        include: options.includeReferences ? [
            'features_section.benefits_reference',
            'testimonials_section.testimonials_reference'
        ] : undefined
    });
};

// Advanced search function
export const searchContent = async (contentType: string, searchOptions: {
    searchTerm?: string;
    searchFields?: string[];
    filters?: any;
    limit?: number;
    skip?: number;
    locale?: string;
}) => {
    const query: any = { ...searchOptions.filters };
    
    // Add text search if provided
    if (searchOptions.searchTerm && searchOptions.searchFields) {
        const searchConditions = searchOptions.searchFields.map(field => ({
            [field]: { $regex: searchOptions.searchTerm, $options: 'i' }
        }));
        query.$or = searchConditions;
    }

    return await fetchEntries(contentType, {
        where: query,
        limit: searchOptions.limit,
        skip: searchOptions.skip,
        locale: searchOptions.locale
    });
};

// Paginated fetch function
export const getPaginatedEntries = async (contentType: string, page: number = 1, pageSize: number = 10, options: {
    where?: any;
    order?: string;
    include?: string[];
    locale?: string;
} = {}) => {
    const skip = (page - 1) * pageSize;
    
    return await fetchEntries(contentType, {
        where: options.where,
        limit: pageSize,
        skip: skip,
        order: options.order,
        include: options.include,
        locale: options.locale,
        includeCount: true
    });
};

// Mock data fallback
const getMockData = (contentType: string) => {
    switch (contentType) {
        case 'testimonials':
            return [
                { content: "Fantastic service, quick repair!", author_name: "Jane D." },
                { content: "Saved me hundreds after my phone was stolen!", author_name: "Mark S." }
            ];
        case 'contact_us_page':
            return {
                title: "Get in Touch",
                description: "Have questions about our insurance plans or need help with a claim? We're here to help you every step of the way.",
                contact_title: "Contact Information",
                contact_details: [
                    {
                        type: "Phone",
                        note: "Available 24/7 for emergencies",
                        contact_info: "1-800-GUARD-ME (1-800-482-7363)"
                    },
                    {
                        type: "Email",
                        note: "Response within 24 hours",
                        contact_info: "support@phoneguard.com"
                    },
                    {
                        type: "Office",
                        note: "",
                        contact_info: "123 Insurance Plaza New York, NY 10001"
                    }
                ],
                chat_details: {
                    title: "Live Chat Support",
                    description: "Get instant help from our support team",
                    cta_title: "Start Live Chat",
                    cta_link: {
                        title: "Start Live Chat",
                        href: "/"
                    }
                },
                bussiness_hours: {
                    title: "Business Hours",
                    day_and_hours: [
                        { day: "Monday - Friday", hours: "8:00 AM - 8:00 PM EST" },
                        { day: "Saturday", hours: "9:00 AM - 5:00 PM EST" },
                        { day: "Sunday", hours: "10:00 AM - 4:00 PM EST" }
                    ]
                }
            };
        case 'about_page':
            return {
                title: "About PhoneGuard",
                description: "We're on a mission to make smartphone protection simple, affordable, and reliable. Since 2020, we've been protecting devices and providing peace of mind to customers nationwide.",
                mission_title: "Our Mission",
                mission_description: "At PhoneGuard, we believe everyone deserves peace of mind when it comes to their smartphone. We've built our company around the simple idea that insurance should be transparent, affordable, and actually there when you need it.\n\nOur team of insurance experts and technology professionals work tirelessly to provide the best possible experience for our customers. From our streamlined claims process to our 24/7 customer support, everything we do is designed with you in mind.",
                story_title: "Our Story",
                story_description: "PhoneGuard was founded in 2020 by a team of insurance and technology professionals who experienced firsthand the frustration of traditional device insurance. After dealing with complicated claims processes, hidden fees, and poor customer service, they knew there had to be a better way.\n\nStarting with a simple mission - to make smartphone insurance transparent and customer-friendly - PhoneGuard has grown from a small startup to a trusted name in device protection. We've processed over 100,000 claims and protected more than 500,000 devices nationwide.\n\nToday, we continue to innovate and improve our services, always keeping our customers at the center of everything we do. Whether you're protecting your first smartphone or your tenth, we're here to provide the coverage you need and the service you deserve.",
                values_titlle: "Our Values",
                stats_cards: [
                    {
                        stats_count: "500K+",
                        stats_title: "Devices Protected"
                    },
                    {
                        stats_count: "99.5%",
                        stats_title: "Customer Satisfaction"
                    },
                    {
                        stats_count: "24/7",
                        stats_title: "Support Available"
                    },
                    {
                        stats_count: "48hrs",
                        stats_title: "Average Claim Time"
                    }
                ],
                values_references: [
                    {
                        uid: "bltf0508c49f8b71497",
                        title: "Trust",
                        description: "We build lasting relationships through transparent practices and reliable service.",
                        icon: "Shield"
                    },
                    {
                        uid: "blt2c742864fc2df336",
                        title: "Customer Focus",
                        description: "Every decision we make is guided by what's best for our customers.",
                        icon: "Users"
                    },
                    {
                        uid: "blt12ae8db222572069",
                        title: "Excellence",
                        description: "We strive for excellence in everything we do, from service to support.",
                        icon: "Award"
                    },
                    {
                        uid: "blt082b617de8bb026b",
                        title: "Innovation",
                        description: "We continuously improve our services with cutting-edge technology.",
                        icon: "Target"
                    },
                    {
                        uid: "bltab4363c3b57f06bd",
                        title: "Care",
                        description: "We genuinely care about protecting what matters most to you.",
                        icon: "Heart"
                    },
                    {
                        uid: "bltf53794f5b2a6e0c9",
                        title: "Speed",
                        description: "Fast claims processing and quick resolutions when you need them most.",
                        icon: "Zap"
                    }
                ]
            };
        case 'home_page':
            return {
                title: "Home Page",
                hero_banner: {
                    banner_title: "Protect Your Phone, Protect Your Peace of Mind",
                    banner_description: "From accidental damage to theft, get comprehensive coverage tailored to your device. Join thousands of satisfied customers who trust PhoneGuard.",
                    banner_image: "",
                    call_to_action_1: {
                        title: "Get Free Quote",
                        href: "/plans"
                    },
                    call_to_action_2: {
                        title: "Learn More",
                        href: "/about"
                    }
                },
                service_section: {
                    title: "Insurance Made Simple",
                    description: "We believe smartphone insurance should be straightforward, affordable, and reliable. That's why we've built our service around transparency and customer satisfaction.",
                    services: [
                        "No hidden fees or surprise charges",
                        "24/7 customer support",
                        "Fast claim processing",
                        "Nationwide coverage",
                        "Multiple payment options",
                        "Cancel anytime"
                    ]
                },
                features_section: {
                    features_title: "Why Choose PhoneGuard?",
                    features_description: "We provide comprehensive smartphone protection with unmatched service and support.",
                    benefits_reference: [
                        {
                            uid: "blt5c5df5a125a04ddd",
                            title: "Comprehensive Coverage",
                            description: "Protection against accidental damage, theft, and malfunction",
                            icon: "Shield"
                        },
                        {
                            uid: "blt6de696ec07a253ba",
                            title: "24/7 Support",
                            description: "Round-the-clock customer service and claim assistance",
                            icon: "Phone"
                        },
                        {
                            uid: "bltf7791e125e23bd2f",
                            title: "Fast Claims",
                            description: "Quick processing and resolution of your insurance claims",
                            icon: "Clock"
                        },
                        {
                            uid: "blt603ecea7793e377f",
                            title: "Affordable Plans",
                            description: "Competitive pricing with no hidden fees",
                            icon: "DollarSign"
                        }
                    ]
                },
                testimonials_section: {
                    title: "What Our Customers Say",
                    description: "Join thousands of satisfied customers who trust PhoneGuard with their devices.",
                    testimonials_reference: [
                        {
                            uid: "blt01031b48a56817c8",
                            content: "PhoneGuard saved me over $800 when my phone was stolen. The claim process was incredibly smooth!",
                            author_name: "Sarah J.",
                            rating: 5,
                            is_featured: true
                        },
                        {
                            uid: "blta348733d164c943c",
                            content: "Best insurance service I've ever used. Quick, reliable, and affordable!",
                            author_name: "Mike R.",
                            rating: 5,
                            is_featured: true
                        },
                        {
                            uid: "blt1571c0dccaee39bb",
                            content: "I was skeptical at first, but PhoneGuard exceeded my expectations. Highly recommend!",
                            author_name: "Jessica L.",
                            rating: 5,
                            is_featured: true
                        },
                        {
                            uid: "bltadcac6551349049a",
                            content: "Professional service and great coverage. Peace of mind is priceless!",
                            author_name: "David K.",
                            rating: 5,
                            is_featured: true
                        }
                    ]
                },
                cta_section: {
                    title: "Ready to Protect Your Phone?",
                    description: "Get started with a free quote and see how affordable peace of mind can be.",
                    cta_link: {
                        title: "Get Your Free Quote",
                        href: "/plans"
                    }
                }
            };
        default:
            return [];
    }
};