import { Outlet } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Header from "./Header";
import Footer from "./Footer";
import CustomerSupportChat from "./CustomerSupportChat";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      
      <CustomerSupportChat />
    </div>
  );
};

export default Layout;
