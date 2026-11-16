import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Customer Pages
import { Home } from '@/pages/Home';
import { Shop } from '@/pages/Shop';
import { ProductDetails } from '@/pages/ProductDetails';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Cart } from '@/pages/Cart';

// Admin Pages
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminSignup } from '@/pages/admin/AdminSignup';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { Products } from '@/pages/admin/Products';
import { ProductForm } from '@/pages/admin/ProductForm';
import { Categories } from '@/pages/admin/Categories';
import { Admins } from '@/pages/admin/Admins';
import { Settings } from '@/pages/admin/Settings';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Customer Storefront Routes */}
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      {/* Admin Authentication & Setup */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/setup" element={<Navigate to="/admin/signup" replace />} />

      {/* Protected Administrator Dashboard */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
        <Route path="categories" element={<Categories />} />
        <Route path="admins" element={<Admins />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
