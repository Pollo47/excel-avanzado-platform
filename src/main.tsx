const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // Layout ya no tiene Router adentro, así que NO habrá error
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      // ... tus otras rutas
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} /> 
  </React.StrictMode>
);
