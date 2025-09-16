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
// TODO: 한글 초성만으로도 입력 가능하도록 수정 (미완성)
// TODO: 게시판 기능을 AJAX 방식으로 수정
// TODO: 좀 더 큰 파일도 업로드 할 수 있도록 수정
// TODO: <src>, <img>, <p> 등 스크립트 코드가 검색되는 문제 수정

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
