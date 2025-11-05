import './App.css'
import AppRouter from "@/routes/AppRouter";
import Toast from "@/components/Toast";

export default function App() {
  return (
    <>
      <AppRouter />
      <Toast />
    </>
  );
}
