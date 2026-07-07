import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AffiliateDisclosurePage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Affiliate Disclosure</h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>FTC Disclosure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              In accordance with the Federal Trade Commission (FTC) guidelines, we want to make it clear that NearSkill may receive compensation for purchases made through links on our website.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What Are Affiliate Links?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Affiliate links are special tracking links that allow us to earn a small commission when you click on them and make a purchase. This commission comes at no additional cost to you and helps support our website.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Commitment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We only promote products and services that we have personally researched, tested, and believe will provide value to our readers. Our opinions remain honest and unbiased regardless of any affiliate relationships.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}