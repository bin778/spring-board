import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import InfoPage from './pages/InfoPage';
import UpdatePage from './pages/UpdatePage';
import DeletePage from './pages/DeletePage';
import UserListPage from './pages/UserListPage';
import WritePage from './pages/WritePage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
// TODO: 게시판 Read, Update, Delete 기능 추가
// TODO: 관리자 계정은 삭제하지 못하도록 수정

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <>
      <main className="container">
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
            path="/admin/update/:userId"
            element={
              <ProtectedRoute adminOnly>
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
          <Route
            path="/admin/list"
            element={
              <ProtectedRoute adminOnly>
                <UserListPage />
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
      </main>
    </>
  );
}

export default App;
