import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Disclaimer</h1>
      
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Disclaimer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The information on this website is provided "as is" without warranty of any kind, either expressed or implied. While we strive to provide accurate and up-to-date information, we make no warranties regarding the accuracy, completeness, or suitability of the information.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Affiliate Links</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Some links on this website are affiliate links. This means if you click on a link and purchase a product, we may receive a commission at no additional cost to you. We only recommend products we believe will add value to our readers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Advice</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The information provided on this website does not constitute professional advice. You should consult with a qualified professional for advice regarding your specific situation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}