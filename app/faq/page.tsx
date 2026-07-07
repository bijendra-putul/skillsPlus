import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How do you make money from this website?',
    answer: 'We earn commissions through affiliate links. When you click on our links and make a purchase, we may receive a small commission at no additional cost to you.',
  },
  {
    question: 'Are your reviews unbiased?',
    answer: 'Yes, we strive to provide honest and unbiased reviews. While we may earn commissions from some products, our opinions are based on our actual experience and research.',
  },
  {
    question: 'How often is the content updated?',
    answer: 'We regularly update our content to ensure accuracy. Product prices, availability, and features may change, so we recommend checking the official website for the most current information.',
  },
  {
    question: 'Can I request a product review?',
    answer: 'Yes! We welcome product review requests. Please contact us through our contact page with your suggestion.',
  },
  {
    question: 'Do you offer any discounts?',
    answer: 'We share available coupon codes and deals on product pages. Make sure to check the product details for any available discounts before purchasing.',
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}