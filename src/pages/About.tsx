import React from 'react';
import { Shield, Users, Award, Target, Heart, Zap } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useAboutPageContent } from '../hooks/useContentStack';

const About: React.FC = () => {
  const { aboutContent, loading, error } = useAboutPageContent({
    locale: 'en-us',
    includeValues: true
  });
  console.log("aboutContent :=> ", aboutContent);
  console.log("aboutContent?.values_references :=> ", aboutContent?.values_references);

  const getValueIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Shield,
      Users,
      Award,
      Target,
      Heart,
      Zap
    };
    return iconMap[iconName] || Shield;
  };

  const formatDescription = (description: string) => {
    return description.split('\n').map((paragraph, index) => (
      <p key={index} className="text-lg text-gray-600 mb-6">
        {paragraph}
      </p>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading about information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading about information: {error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {aboutContent?.title || 'About PhoneGuard'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {aboutContent?.description || 'We\'re on a mission to make smartphone protection simple, affordable, and reliable. Since 2020, we\'ve been protecting devices and providing peace of mind to customers nationwide.'}
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {aboutContent?.stats_cards?.map((stat: any, index: number) => (
            <Card key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stat.stats_count}
              </div>
              <div className="text-gray-600">{stat.stats_title}</div>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {aboutContent?.mission_title || 'Our Mission'}
            </h2>
            <div className="prose prose-lg max-w-none">
              {aboutContent?.mission_description 
                ? formatDescription(aboutContent.mission_description)
                : (
                  <>
                    <p className="text-lg text-gray-600 mb-6">
                      At PhoneGuard, we believe everyone deserves peace of mind when it comes to their smartphone. 
                      We've built our company around the simple idea that insurance should be transparent, 
                      affordable, and actually there when you need it.
                    </p>
                    <p className="text-lg text-gray-600 mb-6">
                      Our team of insurance experts and technology professionals work tirelessly to provide 
                      the best possible experience for our customers. From our streamlined claims process 
                      to our 24/7 customer support, everything we do is designed with you in mind.
                    </p>
                  </>
                )
              }
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <Shield className="h-20 w-20 mx-auto mb-6 opacity-80" />
                <h3 className="text-2xl font-bold mb-4">Protecting What Matters</h3>
                <p className="opacity-90">
                  Your smartphone is more than just a device - it's your connection to the world. 
                  We're here to protect that connection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        {aboutContent?.values_references && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {aboutContent?.values_titlle || 'Our Values'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {aboutContent.values_references.map((value: any, index: number) => {
                const IconComponent = getValueIcon(value.icon);
                return (
                  <Card key={value.uid || index} hover className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-primary-100 rounded-full">
                        <IconComponent className="h-8 w-8 text-primary-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Story Section */}
        <Card className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              {aboutContent?.story_title || 'Our Story'}
            </h2>
            <div className="prose prose-lg max-w-none">
              {aboutContent?.story_description 
                ? formatDescription(aboutContent.story_description)
                : (
                  <>
                    <p className="text-gray-600 mb-6">
                      PhoneGuard was founded in 2020 by a team of insurance and technology professionals who 
                      experienced firsthand the frustration of traditional device insurance. After dealing with 
                      complicated claims processes, hidden fees, and poor customer service, they knew there had to be a better way.
                    </p>
                    <p className="text-gray-600 mb-6">
                      Starting with a simple mission - to make smartphone insurance transparent and customer-friendly - 
                      PhoneGuard has grown from a small startup to a trusted name in device protection. We've processed 
                      over 100,000 claims and protected more than 500,000 devices nationwide.
                    </p>
                    <p className="text-gray-600">
                      Today, we continue to innovate and improve our services, always keeping our customers at the center 
                      of everything we do. Whether you're protecting your first smartphone or your tenth, we're here to 
                      provide the coverage you need and the service you deserve.
                    </p>
                  </>
                )
              }
            </div>
          </div>
        </Card>

        {/* Why Choose Us Section */}
        <div className="bg-primary-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Why Choose PhoneGuard?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">Simple</div>
              <p className="opacity-90">Easy enrollment, clear terms, no hidden fees</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Fast</div>
              <p className="opacity-90">Quick claims processing and rapid resolutions</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Reliable</div>
              <p className="opacity-90">24/7 support and consistent service delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;