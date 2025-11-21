import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Deposit from '@/pages/Deposit';
import Withdraw from '@/pages/Withdraw';
import History from '@/pages/History';
import Watchlist from '@/pages/Watchlist';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '../context/AuthContext.tsx';
import ProtectedRoute from './ProtectedRoute.tsx';
import ThemeToggle from "@/components/ThemeToggle.tsx";

function App() {
const routes = [
  {
    name:'login',
    path: "/",
    element:<Login/>
  },
  {
    name:'dashboard',
    path:'/dashboard',
    element:<Dashboard/>
  },
  {
    name:'deposit',
    path:'/deposit',
    element:<Deposit/>
  },
  {
    name:'withdraw',
    path:'/withdraw',
    element:<Withdraw/>
  },
  {
    name:'history',
    path:'/history',
    element:<History/>,
  },
  {
    name:'watchlist',
    path:'/watchlist',
    element:<Watchlist/>
  },
  {
    name:'settings',
    path:'/settings',
    element:<Settings/>
  },
  {
    name:'Not-Found',
    path:'*',
    element:<NotFound/>
  }
]

const routComponents = routes.map((route) => {
 return(
  <Route 
  key={route.name} 
  path={route.path}
  element={
    <ProtectedRoute>
      {route.element}
    </ProtectedRoute>
  }
  >
  </Route>
 );
})

  return (
    <BrowserRouter>
    <AuthProvider>
      <ThemeToggle />
        <Routes>
          {routComponents}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
