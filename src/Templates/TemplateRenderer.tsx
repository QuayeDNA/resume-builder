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

  if (theme.layout === 'two-col') {
    return (
      <TwoColumnLayout
        theme={theme}
        sidebar={
          <>
            <PersonalHeader data={data} theme={theme} variant="sidebar" />
            {renderSkills(data.skills, theme)}
            {renderLanguages(data.languages, theme)}
            {renderCertifications(data.certifications, theme)}
          </>
        }
        main={
          <>
            {data.personal.summary && renderSummary(data.personal.summary, theme)}
            {renderExperience(data.experience, theme)}
            {renderEducation(data.education, theme)}
            {renderProjects(data.projects, theme)}
            {renderCustomSections(data.customSections, theme)}
          </>
        }
      />
    )
  }

  return (
    <SingleColumnLayout theme={theme}>
      <PersonalHeader data={data} theme={theme} variant={data.atsMode ? 'ats' : 'full'} />
      {data.personal.summary && (
        data.atsMode ? (
          <section>
            {renderSummary(data.personal.summary, { ...theme, layout: 'single' })}
          </section>
        ) : (
          data.personal.summary && (
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
        )
      )}
      {renderExperience(data.experience, theme)}
      {renderEducation(data.education, theme)}
      {renderSkills(data.skills, theme)}
      {renderProjects(data.projects, theme)}
      {renderCertifications(data.certifications, theme)}
      {renderLanguages(data.languages, theme)}
      {renderCustomSections(data.customSections, theme)}
    </SingleColumnLayout>
  )
}
