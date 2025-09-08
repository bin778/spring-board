import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import apiClient from '../services/api';
import React from 'react';

// 메뉴바 컴포넌트
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  // 이미지 추가 핸들러
  const addImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const url = response.data;
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  return (
    <div className="editor-menu">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        Strike
      </button>
      <input type="file" id="imageUpload" onChange={addImage} style={{ display: 'none' }} accept="image/*" />
      <button onClick={() => document.getElementById('imageUpload')?.click()}>Image</button>
    </div>
  );
};

// TipTap 에디터 컴포넌트
const TiptapEditor = ({ onContentChange }: { onContentChange: (html: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image, // 이미지 확장 기능 추가
    ],
    content: '<p>내용을 입력하세요...</p>',
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  return (
    <div className="tiptap-editor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
