import type { ResumeData } from '../types'
import { TEMPLATES } from './index'
import { mergeWithATS } from './theme'
import PersonalHeader from './components/PersonalHeader'
import SingleColumnLayout from './layouts/SingleColumnLayout'
import TwoColumnLayout from './layouts/TwoColumnLayout'
import { renderSummary } from './renderers/renderSummary'
import { renderExperience } from './renderers/renderExperience'
import { renderEducation } from './renderers/renderEducation'
import { renderSkills } from './renderers/renderSkills'
import { renderProjects } from './renderers/renderProjects'
import { renderCertifications } from './renderers/renderCertifications'
import { renderLanguages } from './renderers/renderLanguages'
import { renderCustomSections } from './renderers/renderCustomSections'

export default function TemplateRenderer({ data }: { data: ResumeData }) {
  const def = TEMPLATES[data.template]
  if (!def) return null

  const theme = data.atsMode ? mergeWithATS(def.theme) : def.theme
  const hidden = data.hiddenSections || []

  if (theme.layout === 'two-col') {
    return (
      <TwoColumnLayout
        theme={theme}
        sidebar={
          <>
            <PersonalHeader data={data} theme={theme} variant="sidebar" />
            {!hidden.includes('skills') && renderSkills(data.skills, theme)}
            {!hidden.includes('languages') && renderLanguages(data.languages, theme)}
            {!hidden.includes('certifications') && renderCertifications(data.certifications, theme)}
          </>
        }
        main={
          <>
            {!hidden.includes('personal') && data.personal.summary && renderSummary(data.personal.summary, theme)}
            {!hidden.includes('experience') && renderExperience(data.experience, theme)}
            {!hidden.includes('education') && renderEducation(data.education, theme)}
            {!hidden.includes('projects') && renderProjects(data.projects, theme)}
            {renderCustomSections(
              data.customSections.filter((cs) => !hidden.includes(`custom_${cs.id}`)),
              theme,
            )}
          </>
        }
      />
    )
  }

  return (
    <SingleColumnLayout theme={theme}>
      <PersonalHeader data={data} theme={theme} variant={data.atsMode ? 'ats' : 'full'} />
      {!hidden.includes('personal') && data.personal.summary && (
        data.atsMode ? (
          <section>
            {renderSummary(data.personal.summary, { ...theme, layout: 'single' })}
          </section>
        ) : (
          <p
            style={{
              fontSize: theme.fontSize.body,
              color: '#333333',
              marginTop: '-6px',
              marginBottom: '12px',
              lineHeight: '1.65',
            }}
          >
            &ldquo;{data.personal.summary}&rdquo;
          </p>
        )
      )}
      {!hidden.includes('experience') && renderExperience(data.experience, theme)}
      {!hidden.includes('education') && renderEducation(data.education, theme)}
      {!hidden.includes('skills') && renderSkills(data.skills, theme)}
      {!hidden.includes('projects') && renderProjects(data.projects, theme)}
      {!hidden.includes('certifications') && renderCertifications(data.certifications, theme)}
      {!hidden.includes('languages') && renderLanguages(data.languages, theme)}
      {renderCustomSections(
        data.customSections.filter((cs) => !hidden.includes(`custom_${cs.id}`)),
        theme,
      )}
    </SingleColumnLayout>
  )
}
