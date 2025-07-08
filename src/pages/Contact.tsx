import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { useContactPageContent } from '../hooks/useContentStack';
import { submitContactForm } from '../services/contentstack';

const Contact: React.FC = () => {
  const { contactContent, loading, error } = useContactPageContent({
    locale: 'en-us',
    includeReferences: true
  });
  console.log("contactContent :=> ", contactContent);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear submit status when user starts typing again
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setSubmitMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill in all required fields.');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error');
      setSubmitMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');
    
    try {
      await submitContactForm(formData);
      
      setSubmitStatus('success');
      setSubmitMessage('Message sent successfully! We\'ll get back to you within 24 hours.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage('Sorry, there was an error sending your message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLiveChat = () => {
    if (contactContent?.chat_details?.cta_link?.href) {
      window.open(contactContent.chat_details.cta_link.href, '_blank');
    } else {
      alert('Live chat feature coming soon! For immediate assistance, please call 1-800-GUARD-ME.');
    }
  };

  const getContactIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'phone':
        return <Phone className="h-5 w-5 text-primary-600" />;
      case 'email':
        return <Mail className="h-5 w-5 text-primary-600" />;
      case 'office':
        return <MapPin className="h-5 w-5 text-primary-600" />;
      default:
        return <Phone className="h-5 w-5 text-primary-600" />;
    }
  };

  const getContactHref = (type: string, info: string) => {
    switch (type.toLowerCase()) {
      case 'phone':
        return `tel:${info}`;
      case 'email':
        return `mailto:${info}`;
      default:
        return '#';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading contact information: {error}</p>
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
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {contactContent?.title || 'Get in Touch'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {contactContent?.description || 'Have questions about our insurance plans or need help with a claim? We\'re here to help you every step of the way.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {contactContent?.contact_title || 'Contact Information'}
              </h2>
              <div className="space-y-6">
                {contactContent?.contact_details?.map((detail: any, index: number) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      {getContactIcon(detail.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{detail.type}</h3>
                      {detail.note && (
                        <p className="text-gray-600">{detail.note}</p>
                      )}
                      <a 
                        href={getContactHref(detail.type, detail.contact_info)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        {detail.contact_info}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Live Chat */}
            {contactContent?.chat_details && (
              <Card>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-accent-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {contactContent.chat_details.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {contactContent.chat_details.description}
                  </p>
                  <Button 
                    onClick={handleLiveChat}
                    variant="outline"
                    className="border-accent-500 text-accent-600 hover:bg-accent-50"
                  >
                    {contactContent.chat_details.cta_title}
                  </Button>
                </div>
              </Card>
            )}

            {/* Business Hours */}
            {contactContent?.bussiness_hours && (
              <Card>
                <div className="flex items-center mb-4">
                  <Clock className="h-5 w-5 text-primary-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {contactContent.bussiness_hours.title}
                  </h3>
                </div>
                <div className="space-y-2">
                  {contactContent.bussiness_hours.day_and_hours?.map((schedule: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{schedule.day}</span>
                      <span className="text-gray-900">{schedule.hours}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 mt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Emergency Claims</span>
                      <span className="text-primary-600 font-medium">24/7 Available</span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Contact Form */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="claim">File a Claim</option>
                  <option value="billing">Billing Question</option>
                  <option value="technical">Technical Support</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your message"
                />
              </div>

              {/* Status Message */}
              {submitStatus !== 'idle' && (
                <div className={`p-4 rounded-md flex items-center space-x-2 ${
                  submitStatus === 'success' 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {submitStatus === 'success' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    submitStatus === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {submitMessage}
                  </span>
                </div>
              )}

              <Button 
                type="submit" 
                loading={isSubmitting}
                className="w-full"
                icon={Send}
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact; 