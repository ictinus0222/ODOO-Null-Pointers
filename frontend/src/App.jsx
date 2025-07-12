import { BrowserRouter as Router, Routes, Route } from  'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';


function App() {
  return (
    <Router>
      <Navbar>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />       
        </Routes>
      </Navbar>
    </Router>
  );
}
export default App
