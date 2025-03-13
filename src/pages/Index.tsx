
import SearchInput from '@/components/SearchInput';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="w-full py-6 border-b border-border/40 backdrop-blur-md sticky top-0 z-10 bg-background/80">
        <div className="container max-w-7xl mx-auto">
          <h1 className="text-center text-2xl font-medium">Search in fake store</h1>
        </div>
      </header>
      
      <main className="flex-1 container max-w-7xl mx-auto py-12">
        <div className="mb-8 text-center">
          <span className="inline-block px-2.5 py-0.5 text-xs font-medium bg-secondary rounded-full mb-2">
            High-Performance Search
          </span>
          <h2 className="text-3xl md:text-4xl font-medium mb-3">Find Products Instantly</h2>
        </div>
        
        <SearchInput />
      </main>
      
      <footer className="py-6 border-t border-border/40 mt-auto">
        <div className="container max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>High-Performance Product Search Component</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
