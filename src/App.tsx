import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { PaywallProvider } from './contexts/PaywallContext';
import { MonetizationProvider } from './components/monetization/MonetizationManager';

import CleanHeader from './components/CleanHeader';
import Footer from './components/Footer';
import PaywallModal from './components/PaywallModal';
import './styles/animations.css';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const SuggestNews = lazy(() => import('./pages/SuggestNews'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Category = lazy(() => import('./pages/Category'));
const Search = lazy(() => import('./pages/Search'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const MagaluPromoPage = lazy(() => import('./pages/MagaluPromoPage'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
  </div>
);

// Layout for public pages
const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <CleanHeader />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
    <PaywallModal />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <PaywallProvider>
          <MonetizationProvider>
            <Router>
              <div className="bg-gray-50 dark:bg-gray-900 font-inter transition-colors duration-200">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/admin/*" element={<AdminDashboard />} />
                    <Route element={<PublicLayout />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/suggest-news" element={<SuggestNews />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/category/:category" element={<Category />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/promo/magalu-projetor-samsung" element={<MagaluPromoPage />} />
                    </Route>
                  </Routes>
                </Suspense>
              </div>
            </Router>
          </MonetizationProvider>
        </PaywallProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;