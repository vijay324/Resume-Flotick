import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
               <div className="h-6 w-6 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs">
                 R
               </div>
               Resumai
            </div>
            <p className="text-sm text-muted-foreground text-balance">
              An open-source product maintained by <a href="#" className="font-semibold text-foreground hover:underline">The Flotick</a>.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Building the future of career tools.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/builder" className="hover:text-primary transition-colors">Resume Builder</Link></li>
              <li><Link href="#templates" className="hover:text-primary transition-colors">Templates</Link></li>
              <li><Link href="#examples" className="hover:text-primary transition-colors">Examples</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Career Guide</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Interview Prep</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Terms</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Resumai. Proudly powered by <span className="font-bold text-gray-900">The Flotick</span>.
          </p>
          <div className="flex gap-4">
            {/* Social Icons would go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
