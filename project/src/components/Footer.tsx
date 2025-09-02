import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Code,
  Zap,
  Shield
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative py-24 px-4 bg-gradient-to-t from-muted/20 to-background">
      <div className="container mx-auto">
        {/* CTA Section */}
        <Card className="p-12 mb-16 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 text-center">
          <div className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold">
              <span className="gradient-text">Ready to revolutionize</span>
              <br />
              <span className="text-foreground">your estimation process?</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join the cleaning companies already saving thousands with AI-powered estimates
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="ai" size="lg">
                Schedule Demo
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground pt-4">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4" />
                <span>Easy Integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" />
                <span>Instant Setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Enterprise Security</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer Content */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold gradient-text">Cleanistic AI</h3>
              <p className="text-muted-foreground mt-2">
                The future of property service estimation, powered by artificial intelligence.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@cleanistic.ai</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>870-520-0650</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Jonesboro AR</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Product</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Features</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Pricing</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">API Documentation</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Integration Guide</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Status Page</a>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Company</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">About Us</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Blog</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Careers</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Press Kit</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Contact</a>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Support</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Help Center</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Live Chat</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Video Tutorials</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Community</a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors">Partner Program</a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2025 Cleanistic AI. All rights reserved.               Devloped by Hackistic
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
