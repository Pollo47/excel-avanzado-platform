import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import ExcelCurso from './pages/ExcelCurso';
import ExcelModule from './pages/ExcelModule';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/excel" element={<ExcelCurso />} />
          <Route path="/excel/module/:moduleId" element={<ExcelModule />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}

export default App;