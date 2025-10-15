import { create } from 'zustand'

interface EditorState {
  html: string
  css: string
  js: string
  activeTab: 'html' | 'css' | 'js'
  
  // Actions
  setHtml: (html: string) => void
  setCss: (css: string) => void
  setJs: (js: string) => void
  setActiveTab: (tab: 'html' | 'css' | 'js') => void
  resetCode: (html?: string, css?: string, js?: string) => void
  getPreviewCode: () => string
}

export const useEditorStore = create<EditorState>((set, get) => ({
  html: '',
  css: '',
  js: '',
  activeTab: 'html',

  setHtml: (html: string) => set({ html }),
  setCss: (css: string) => set({ css }),
  setJs: (js: string) => set({ js }),
  setActiveTab: (tab: 'html' | 'css' | 'js') => set({ activeTab: tab }),

  resetCode: (html = '', css = '', js = '') => {
    set({ html, css, js })
  },

  getPreviewCode: () => {
    const { html, css, js } = get()
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${css}</style>
</head>
<body>
  ${html}
  <script>
    try {
      ${js}
    } catch (error) {
      console.error('执行错误:', error);
      document.body.innerHTML += '<div style="color:red;padding:20px;border:2px solid red;margin:10px;border-radius:8px;"><strong>❌ JavaScript错误:</strong><br>' + error.message + '</div>';
    }
  </script>
</body>
</html>
    `.trim()
  },
}))

