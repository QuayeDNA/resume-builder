import { useAutoSave } from './hooks/useAutoSave'
import SideNav      from './components/Editor/SideNav'
import EditorPanel  from './components/Editor/EditorPanel'
import PreviewPanel from './components/Preview/PreviewPanel'

export default function App() {
  useAutoSave()

  return (
    <div className="flex h-screen overflow-hidden bg-[#070710] font-sans">
      <SideNav />
      <EditorPanel />
      <PreviewPanel />
    </div>
  )
}