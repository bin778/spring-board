import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import apiClient from '../services/api';
import React, { useEffect } from 'react';

interface FileUploadResponse {
  fileUrl: string;
  originalFileName: string;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const addImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post<FileUploadResponse>('/api/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const savedFileName = response.data.fileUrl;
      if (savedFileName) {
        const imageUrl = `http://localhost:8080/files/${savedFileName}`;
        editor.chain().focus().setImage({ src: imageUrl }).run();
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  return (
    <div className="editor-menu">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        Strike
      </button>
      <input type="file" id="imageUpload" onChange={addImage} style={{ display: 'none' }} accept="image/*" />
      <button type="button" onClick={() => document.getElementById('imageUpload')?.click()}>
        Image
      </button>
    </div>
  );
};

interface TiptapEditorProps {
  onContentChange: (html: string) => void;
  initialContent?: string;
}

const TiptapEditor = ({ onContentChange, initialContent }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: initialContent || '<p>내용을 입력하세요...</p>',
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  return (
    <div className="tiptap-editor">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
