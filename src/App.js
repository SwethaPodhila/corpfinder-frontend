import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";

//import { Toaster as Sonner } from "./components/ui/sonner";
//import { Toaster } from "./components/ui/toaster";
//import { TooltipProvider } from "./components/ui/tooltip";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import SubAdmins from "./pages/SubAdmins";
import AdminAddEmployee from "./pages/AdminAddEmployee";
import AddCompany from "./pages/AdminAddCompany";
import AdminViewData from "./pages/AdminViewData";
import AdminAddingFullEmployees from "./pages/AdminEmployeesCompany";

import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import SearchPage from "./pages/SearchPage";
import HistoryPage from "./pages/HistoryPage";
import DownloadsPage from "./pages/DownloadsPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import ProfilePage from "./pages/FullProfile";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/subAdmin" element={<SubAdmins />} />
          <Route path="/admin/add-employee" element={<AdminAddEmployee />} />
          <Route path="/admin/add-company" element={<AddCompany />} />
          <Route path="/admin/view-data" element={<AdminViewData />} />

          <Route path="/admin/add-employees" element={<AdminAddingFullEmployees />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="downloads" element={<DownloadsPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />

            <Route path="profile/:id" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;