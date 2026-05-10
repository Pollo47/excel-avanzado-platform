import { Toaster } from 'sonner';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
export default App;