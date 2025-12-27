import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Import all the pages we built
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ShopView from './pages/Shop/ShopView';
import Checkout from './pages/Checkout';
import ShopDashboard from './pages/Shop/ShopkeeperDashboard';
import Wallet from './pages/Wallet';
import Loader from './components/ui/Loader';
import Profile from './pages/Profile';
import ManageShops from './pages/Shop/ManageShops';
import ShopPreview from './pages/Shop/ShopPreview';
import ShopAdd from './pages/Shop/ShopAdd';
import ShopEdit from './pages/Shop/ShopEdit';
import ServiceAdd from './pages/Shop-Services/ServiceAdd';
import ServiceEdit from './pages/Shop-Services/ServiceEdit';
import AppointmentBooking from './pages/Appointments/AppointmentBooking';
import MyAppointments from './pages/Appointments/MyAppointments';
import EditAppointment from './pages/Appointments/EditAppointment';
import LiveQueue from './pages/LiveQueue';
import ShopkeeperDashboard from './pages/Shop/ShopkeeperDashboard';

// A simple wrapper to protect private routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

         {/* Shopkeeper Routes */}
         <Route path="/shop-dashboard" element={
          <ProtectedRoute><ShopkeeperDashboard /></ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/manage-shops" element={
          <ProtectedRoute><ManageShops /></ProtectedRoute>
        } />
        <Route path="/shop-preview/:id" element={
          <ProtectedRoute><ShopPreview /></ProtectedRoute>
        } />
        <Route path="/shop-add" element={
          <ProtectedRoute><ShopAdd /></ProtectedRoute>
        } />
        <Route path="/shop-edit/:id" element={
          <ProtectedRoute><ShopEdit /></ProtectedRoute>
        } />
        {/* <Route path="/shop/:id" element={
          <ProtectedRoute><ShopView /></ProtectedRoute>
        } /> */}
        <Route path="/service-add/:id" element={
          <ProtectedRoute><ServiceAdd /></ProtectedRoute>
        } />
        <Route path="/service-edit/:id" element={
          <ProtectedRoute><ServiceEdit /></ProtectedRoute>
        } />
        <Route path="/book/:id" element={
          <ProtectedRoute><AppointmentBooking /></ProtectedRoute>
        } />
        <Route path="/my-appointments" element={
          <ProtectedRoute><MyAppointments /></ProtectedRoute>
        } />
         <Route path="/shop-queue/:id" element={
          <ProtectedRoute><LiveQueue /></ProtectedRoute>
        } />
        <Route path="/edit-appointment/:id" element={
          <ProtectedRoute><EditAppointment /></ProtectedRoute>//todo
        } />
        <Route path="/checkout" element={
          <ProtectedRoute><Checkout /></ProtectedRoute>
        } />
        <Route path="/wallet" element={
          <ProtectedRoute><Wallet /></ProtectedRoute>
        } />

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;