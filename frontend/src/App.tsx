import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import InfoPage from './pages/InfoPage.tsx';
import UpdatePage from './pages/UpdatePage.tsx';
import DeletePage from './pages/DeletePage.tsx';
import UserListPage from './pages/UserListPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
// TODO: 게시판 기능도 옮기기
// TODO: 게시판 사진 및 동영상 업로드 기능 추가

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 로그인해야 접근 가능한 페이지들 */}
      <Route
        path="/info"
        element={
          <ProtectedRoute>
            <InfoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/update"
        element={
          <ProtectedRoute>
            <UpdatePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/delete"
        element={
          <ProtectedRoute>
            <DeletePage />
          </ProtectedRoute>
        }
      />

      {/* 관리자만 접근 가능한 페이지 */}
      <Route
        path="/list"
        element={
          <ProtectedRoute adminOnly={true}>
            <UserListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/update/:userId"
        element={
          <ProtectedRoute adminOnly={true}>
            <UpdatePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
