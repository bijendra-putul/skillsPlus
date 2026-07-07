import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">About Us</h1>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground">
              At NearSkill, our mission is to help you discover the best products, tools, software, courses, and AI tools available in the market. We provide honest reviews, detailed comparisons, and helpful tutorials to make your decision-making process easier.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What We Do</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Curate and review the best products across various categories</li>
              <li>Provide detailed comparisons to help you make informed decisions</li>
              <li>Share tutorials and guides for using various tools and software</li>
              <li>Keep you updated with the latest trends in technology and AI</li>
              <li>Connect you with trusted providers through our affiliate links</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Transparency - We provide honest, unbiased reviews</li>
              <li>Quality - We only recommend products we trust and use</li>
              <li>Helpfulness - Our content is designed to solve your problems</li>
              <li>Integrity - We disclose all affiliate relationships clearly</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}