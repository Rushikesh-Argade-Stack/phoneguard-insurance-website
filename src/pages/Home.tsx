import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Users, Award, ArrowRight, CheckCircle, Phone, Clock, DollarSign } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { useHomePageContent } from '../hooks/useContentStack';

const Home: React.FC = () => {
  const { homeContent, loading, error } = useHomePageContent({
    locale: 'en-us',
    includeReferences: true
  });

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Shield,
      Phone,
      Clock,
      DollarSign,
      Users,
      Award,
      Zap
    };
    return iconMap[iconName] || Shield;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading page content: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const benefits = homeContent?.features_section?.benefits_reference || [];
  const testimonials = homeContent?.testimonials_section?.testimonials_reference || [];
  const services = homeContent?.service_section?.services || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {homeContent?.hero_banner?.banner_title || 'Protect Your Phone, '}
              <span className="text-accent-300">
                {homeContent?.hero_banner?.banner_title_2 || 'Protect Your Peace of Mind'}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto animate-slide-up">
              {homeContent?.hero_banner?.banner_description || 'From accidental damage to theft, get comprehensive coverage tailored to your device. Join thousands of satisfied customers who trust PhoneGuard.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link to={homeContent?.hero_banner?.call_to_action_1?.href || '/plans'}>
                <Button size="lg" className="bg-accent-500 hover:bg-accent-600 text-white">
                  {homeContent?.hero_banner?.call_to_action_1?.title || 'Get Free Quote'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={homeContent?.hero_banner?.call_to_action_2?.href || '/about'}>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                  {homeContent?.hero_banner?.call_to_action_2?.title || 'Learn More'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {homeContent?.features_section?.features_title || 'Why Choose PhoneGuard?'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {homeContent?.features_section?.features_description || 'We provide comprehensive smartphone protection with unmatched service and support.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit: any, index: number) => {
              const IconComponent = getIconComponent(benefit.icon);
              return (
                <Card key={benefit.uid || index} hover className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary-100 rounded-full">
                      <IconComponent className="h-8 w-8 text-primary-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {homeContent?.service_section?.title || 'Insurance Made Simple'}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {homeContent?.service_section?.description || 'We believe smartphone insurance should be straightforward, affordable, and reliable. That\'s why we\'ve built our service around transparency and customer satisfaction.'}
              </p>
              <div className="space-y-4">
                {services.map((service: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary-500 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-400 to-secondary-500 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <Shield className="h-20 w-20 mx-auto mb-6 opacity-80" />
                  <h3 className="text-2xl font-bold mb-4">Start Your Protection Today</h3>
                  <p className="mb-6 opacity-90">
                    Get instant coverage for your smartphone with our easy online process.
                  </p>
                  <Link to="/plans">
                    <Button className="text-primary-600 hover:bg-gray-100">
                      Compare Plans
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {homeContent?.testimonials_section?.title || 'What Our Customers Say'}
            </h2>
            <p className="text-xl text-gray-600">
              {homeContent?.testimonials_section?.description || 'Join thousands of satisfied customers who trust PhoneGuard with their devices.'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonials.map((testimonial: any, index: number) => (
              <Card key={testimonial.uid || index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-lg">
                      {testimonial.author_name?.charAt(0) || 'A'}
                    </span>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic mb-4">
                  {testimonial.content}
                </blockquote>
                <cite className="text-primary-600 font-semibold">
                  {testimonial.author_name}
                </cite>
                {testimonial.rating && (
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {homeContent?.cta_section?.title || 'Ready to Protect Your Phone?'}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {homeContent?.cta_section?.description || 'Get started with a free quote and see how affordable peace of mind can be.'}
          </p>
          <Link to={homeContent?.cta_section?.cta_link?.href || '/plans'}>
            <Button size="lg" className="bg-accent-500 hover:bg-accent-600 text-white">
              {homeContent?.cta_section?.cta_link?.title || 'Get Your Free Quote'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;