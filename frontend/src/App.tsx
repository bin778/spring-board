import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import InfoPage from './pages/InfoPage';
import UpdatePage from './pages/UpdatePage';
import DeletePage from './pages/DeletePage';
import UserListPage from './pages/UserListPage';
import BoardWritePage from './pages/BoardWritePage';
import BoardListPage from './pages/BoardListPage';
import BoardDetailPage from './pages/BoardDetailPage';
import BoardUpdatePage from './pages/BoardUpdatePage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
// TODO: SCSS 디자인 갈아엎기
// TODO: 특수문자 RFC 규격 위반 문자 필터링

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
          <Route path="/boards" element={<BoardListPage />} />
          <Route path="/boards/:boardId" element={<BoardDetailPage />} />
          <Route
            path="/write"
            element={
              <ProtectedRoute>
                <BoardWritePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:boardId"
            element={
              <ProtectedRoute>
                <BoardUpdatePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

export default App;
