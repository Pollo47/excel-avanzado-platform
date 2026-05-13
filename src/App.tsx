import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ExcelCurso from './pages/ExcelCurso';
import ExcelModule from './pages/ExcelModule'; // <--- IMPORTANTE
import AdminPage from './pages/AdminPage'; // <--- IMPORTANTE

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de Ventas / Inicio */}
        <Route path="/" element={<Home />} /> 
        
        {/* Acceso */}
        <Route path="/login" element={<Login />} />
        
        {/* El Tablero del Curso */}
        <Route path="/curso" element={<ExcelCurso />} />
        
        {/* La Lección Específica */}
        <Route path="/excel/module/:moduleId" element={<ExcelModule />} />
        
        {/* El Panel de Control de IA Academy */}
        <Route path="/admin" element={<AdminPage />} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
