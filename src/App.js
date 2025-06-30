import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import SplashPage from "./pages/SplashPage";
import { ToastContainer } from "react-toastify"; // ✅ Tambahkan ini
import "react-toastify/dist/ReactToastify.css"; // ✅ Tambahkan ini juga
import GenrePage from "./pages/GenrePage";
import LabelPage from "./pages/LabelPage";
import LaguPage from "./pages/LaguPage";
import PenyanyiPage from "./pages/PenyanyiPage";
import PrapemrosesPage from "./pages/PrapemrosesPage";
import PemrosesanPage from "./pages/PemrosesanPage";
import ValidasiPage from "./pages/ValidasiPage";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route
            path="/masuk"
            element={
              <div>
                <Login />
              </div>
            }
          />
          <Route
            path="/genre"
            element={
              <ProtectedRoute>
                <GenrePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/label"
            element={
              <ProtectedRoute>
                <LabelPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lagu"
            element={
              <ProtectedRoute>
                <LaguPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/penyanyi"
            element={
              <ProtectedRoute>
                <PenyanyiPage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pra-pemrosesan"
            element={
              <ProtectedRoute>
                <PrapemrosesPage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pemrosesan"
            element={
              <ProtectedRoute>
                <PemrosesanPage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/validasi"
            element={
              <ProtectedRoute>
                <ValidasiPage/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/pemrosesan"
            element={
              <ProtectedRoute>
                <PemrosesanPage/>
              </ProtectedRoute>
            }
          />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </>
    </BrowserRouter>
  );
}

export default App;
