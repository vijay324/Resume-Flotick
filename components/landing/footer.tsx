import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
               <div className="h-6 w-6  flex items-center justify-center text-white text-xs">
                 <Image src="/logo-black.svg" alt="Flotick Logo" width={24} height={24} />
               </div>
               Flotick Resume
            </div>
            <p className="text-sm text-muted-foreground text-balance">
              Free AI-powered resume builder by <a href="https://Flotick.com" className="font-semibold text-foreground hover:underline" target="_blank" rel="noopener noreferrer">Flotick</a>.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Flotick is an enterprise work management platform helping teams collaborate and succeed.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/builder" className="hover:text-primary transition-colors">Resume Builder</Link></li>
              <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Flotick</Link></li>
              <li><a href="https://Flotick.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Flotick Platform</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/legal" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              <li><Link href="/feedback" className="hover:text-primary transition-colors">Feedback</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Flotick Resume. A product of <a href="https://Flotick.com" className="font-bold text-gray-900 hover:underline" target="_blank" rel="noopener noreferrer">Flotick</a>.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>AI-Powered Resume Builder</span>
            <span>•</span>
            <span>100% Free</span>
            <span>•</span>
            <span>No Sign-up Required</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

