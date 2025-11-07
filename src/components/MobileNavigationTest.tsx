import React from 'react';
import { Layout } from './Layout';

/**
 * Test component for mobile navigation
 * This component can be used to test the mobile navigation features
 */
export const MobileNavigationTest: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-soft-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-charcoal mb-6">
            Mobile Navigation Test
          </h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">
              Test Features
            </h2>
            <ul className="space-y-2 text-slate-gray">
              <li>✅ Smooth animations for opening/closing</li>
              <li>✅ Backdrop overlay with click-to-close</li>
              <li>✅ Swipe-to-close gesture support</li>
              <li>✅ Keyboard navigation (Escape key)</li>
              <li>✅ Body scroll prevention when open</li>
              <li>✅ Staggered menu item animations</li>
              <li>✅ Hamburger icon rotation animation</li>
              <li>✅ Touch-friendly button sizes</li>
              <li>✅ Accessibility improvements</li>
              <li>✅ Performance optimizations</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">
              How to Test
            </h2>
            <div className="space-y-3 text-slate-gray">
              <p><strong>1. Open Mobile Menu:</strong> Click the hamburger icon in the top-right corner</p>
              <p><strong>2. Test Backdrop:</strong> Click outside the menu to close it</p>
              <p><strong>3. Test Swipe:</strong> Swipe down on the menu to close it</p>
              <p><strong>4. Test Keyboard:</strong> Press Escape key to close the menu</p>
              <p><strong>5. Test Navigation:</strong> Click on menu items to navigate</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">
              Responsive Breakpoints
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-charcoal mb-2">Mobile (< 768px)</h3>
                <ul className="space-y-1 text-slate-gray">
                  <li>• Hamburger menu visible</li>
                  <li>• Full-screen overlay</li>
                  <li>• Swipe gestures enabled</li>
                  <li>• Touch-optimized buttons</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-charcoal mb-2">Desktop (≥ 768px)</h3>
                <ul className="space-y-1 text-slate-gray">
                  <li>• Horizontal navigation</li>
                  <li>• No mobile menu</li>
                  <li>• Hover effects</li>
                  <li>• Standard button sizes</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">
              Performance Notes
            </h2>
            <div className="space-y-2 text-slate-gray text-sm">
              <p>• Uses <code className="bg-gray-100 px-1 rounded">will-change</code> for smooth animations</p>
              <p>• Implements <code className="bg-gray-100 px-1 rounded">transform3d</code> for hardware acceleration</p>
              <p>• Debounced touch events to prevent excessive re-renders</p>
              <p>• CSS transitions instead of JavaScript animations where possible</p>
              <p>• Reduced motion support for accessibility</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MobileNavigationTest;
