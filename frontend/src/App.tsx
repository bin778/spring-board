import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import InfoPage from './pages/InfoPage.tsx';
import UpdatePage from './pages/UpdatePage.tsx';
import DeletePage from './pages/DeletePage.tsx';
import UserListPage from './pages/UserListPage.tsx';
import WritePage from './pages/WritePage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
// TODO: 보안 요소 점검(XSS, Path Traversal)
// TODO: 게시판 글 조회, 수정, 삭제 기능 추가

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />

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
      <Route
        path="/write"
        element={
          <ProtectedRoute>
            <WritePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
