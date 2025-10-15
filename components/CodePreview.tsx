'use client'

import { useEffect, useRef } from 'react'
import { useEditorStore } from '@/stores/editorStore'

export function CodePreview() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { getPreviewCode } = useEditorStore()

  useEffect(() => {
    const updatePreview = () => {
      const iframe = iframeRef.current
      if (!iframe) return

      const previewCode = getPreviewCode()
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(previewCode)
        iframeDoc.close()
      }
    }

    updatePreview()
  }, [getPreviewCode])

  return (
    <div className="h-full w-full bg-white">
      <iframe
        ref={iframeRef}
        title="代码预览"
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full border-0"
      />
    </div>
  )
}

