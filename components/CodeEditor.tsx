'use client'

import { useEffect, useRef } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { useUIStore } from '@/stores/uiStore'
import { Button } from './ui/button'

export function CodeEditor() {
  const { html, css, js, activeTab, setHtml, setCss, setJs, setActiveTab, getPreviewCode } = useEditorStore()
  const { isPreviewFullscreen, togglePreviewFullscreen } = useUIStore()
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // 更新预览
  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(getPreviewCode())
        doc.close()
      }
    }
  }, [html, css, js, getPreviewCode])

  const handleCodeChange = (value: string) => {
    switch (activeTab) {
      case 'html':
        setHtml(value)
        break
      case 'css':
        setCss(value)
        break
      case 'js':
        setJs(value)
        break
    }
  }

  const getCurrentCode = () => {
    switch (activeTab) {
      case 'html':
        return html
      case 'css':
        return css
      case 'js':
        return js
    }
  }

  return (
    <div className="flex h-full gap-2">
      {/* 编辑器区域 */}
      {!isPreviewFullscreen && (
        <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
          {/* Tab切换 */}
          <div className="flex border-b bg-gray-100">
            <button
              onClick={() => setActiveTab('html')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'html'
                  ? 'bg-white border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              HTML
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'css'
                  ? 'bg-white border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              CSS
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={`px-4 py-2 text-sm font-medium ${
                activeTab === 'js'
                  ? 'bg-white border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              JavaScript
            </button>
          </div>

          {/* 代码编辑区 */}
          <textarea
            value={getCurrentCode()}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none"
            placeholder={`输入${activeTab.toUpperCase()}代码...`}
            spellCheck={false}
          />
        </div>
      )}

      {/* 预览区域 */}
      <div className={`${isPreviewFullscreen ? 'flex-1' : 'flex-1'} flex flex-col border rounded-lg overflow-hidden`}>
        <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
          <span className="text-sm font-medium text-gray-700">预览</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={togglePreviewFullscreen}
          >
            {isPreviewFullscreen ? '退出全屏' : '全屏'}
          </Button>
        </div>
        <iframe
          ref={iframeRef}
          title="预览"
          sandbox="allow-scripts allow-same-origin"
          className="flex-1 bg-white"
        />
      </div>
    </div>
  )
}

