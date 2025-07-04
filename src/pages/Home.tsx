import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { testimonials } from '../data/planData';
import { useBenefits, useTestimonials } from '../hooks/useContentStack';

const Home: React.FC = () => {
  const { testimonials: testimonialsCS, loading: testimonialsLoading } = useTestimonials();
  const { benefits: benefitsCS, loading: benefitsLoading } = useBenefits();
  console.log("testimonialsCS :=> ", testimonialsCS);
  console.log("benefitsCS :=> ", benefitsCS);

  const benefits = [
    {
      icon: Shield,
      title: 'Theft Protection',
      description: 'Complete coverage against theft and unauthorized use of your device.'
    },
    {
      icon: Zap,
      title: 'Instant Repair Coverage',
      description: 'Quick repairs for cracked screens, water damage, and hardware issues.'
    },
    {
      icon: Users,
      title: 'Replacement Guarantee',
      description: 'Get a replacement device if yours cannot be repaired.'
    },
    {
      icon: Award,
      title: 'Easy Upgrades',
      description: 'Upgrade protection when you get a new device.'
    }
  ];

  // Update benefitsCS with icons from benefits array
  const updatedBenefitsCS = benefitsCS?.map((benefit: any, index: number) => ({
    ...benefit,
    icon: benefits[index]?.icon
  })) || [];

  const features = [
    'No hidden fees or surprise charges',
    '24/7 customer support',
    'Fast claim processing',
    'Nationwide coverage',
    'Multiple payment options',
    'Cancel anytime'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Protect Your Phone,
              <span className="text-accent-300"> Protect Your Peace of Mind</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto animate-slide-up">
              From accidental damage to theft, get comprehensive coverage tailored to your device. 
              Join thousands of satisfied customers who trust PhoneGuard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link to="/plans">
                <Button size="lg" className="bg-accent-500 hover:bg-accent-600 text-white">
                  Get Free Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Learn More
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
              Why Choose PhoneGuard?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive smartphone protection with unmatched service and support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {updatedBenefitsCS.map((benefit, index) => (
              <Card key={index} hover className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-full">
                    <benefit.icon className="h-8 w-8 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Insurance Made Simple
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We believe smartphone insurance should be straightforward, affordable, and reliable. 
                That's why we've built our service around transparency and customer satisfaction.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
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
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied customers who trust PhoneGuard with their devices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {testimonialsCS.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-lg">
                      {/* {testimonial.split(' - ')[1]?.charAt(0) || 'A'} */}
                      {testimonial.author_avatar || 'A'}
                    </span>
                  </div>
                </div>
                <blockquote className="text-gray-700 italic mb-4">
                  {/* {testimonial.split(' - ')[0]} */}
                  {testimonial.content}
                </blockquote>
                <cite className="text-primary-600 font-semibold">
                  {/* {testimonial.split(' - ')[1]} */}
                  {testimonial.author_name}
                </cite>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Protect Your Phone?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get started with a free quote and see how affordable peace of mind can be.
          </p>
          <Link to="/plans">
            <Button size="lg" className="bg-accent-500 hover:bg-accent-600">
              Get Your Free Quote
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;