import { Card, EntryCard, Input, TextArea } from '../UI'
import SortableList from '../SortableList'
import useResumeStore from '../../store/useResumeStore'

export default function ProjectsSection() {
  const projects      = useResumeStore((s) => s.data.projects)
  const addProject    = useResumeStore((s) => s.addProject)
  const removeProject = useResumeStore((s) => s.removeProject)
  const updateProject = useResumeStore((s) => s.updateProject)
  const reorderProject = useResumeStore((s) => s.reorderProject)

  return (
    <Card title="Projects" onAdd={addProject} addLabel="Add Project">
      <SortableList
        items={projects}
        getId={(pr) => pr.id}
        onReorder={reorderProject}
      >
        {(pr) => (
          <EntryCard onDelete={() => removeProject(pr.id)}>
            <Input label="Project Name" value={pr.name}        onChange={(v) => updateProject(pr.id, 'name', v)}        placeholder="My Awesome Project" />
            <Input label="URL / GitHub" value={pr.url}         onChange={(v) => updateProject(pr.id, 'url', v)}         placeholder="github.com/you/project" />
            <TextArea label="Description" value={pr.description} onChange={(v) => updateProject(pr.id, 'description', v)} placeholder="What did you build and what was the impact?" rows={3} />
          </EntryCard>
        )}
      </SortableList>
    </Card>
  )
}
