import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { VIPConciergeWidget } from "@/components/VIPConciergeWidget";
import Home from "@/pages/home";
import ProductPage from "@/pages/product";
import CategoryPage from "@/pages/category";
import ProductsPage from "@/pages/products";
import EmojiDemo from "@/pages/EmojiDemo";
import VIPConcierge from "@/pages/VIPConcierge";
import CompliancePage from "@/pages/CompliancePage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/product/:id" component={ProductPage} />
      <Route path="/category/:id" component={CategoryPage} />
      <Route path="/emoji-demo" component={EmojiDemo} />
      <Route path="/concierge" component={VIPConcierge} />
      <Route path="/compliance" component={CompliancePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="dark min-h-screen bg-neutral-950 text-white">
          {/* Gradient Background */}
          <div className="gradient-background">
            <div className="gradient-blob-1"></div>
            <div className="gradient-blob-2"></div>
          </div>
          
          <Toaster />
          <Router />
          <VIPConciergeWidget />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
