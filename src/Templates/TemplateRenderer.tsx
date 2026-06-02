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

  const baseTheme = data.atsMode ? mergeWithATS(def.theme) : def.theme
  const overrides = data.themeOverrides
  const theme = overrides
    ? {
        ...baseTheme,
        colors: { ...baseTheme.colors, ...(overrides.colors || {}) },
        fonts: { ...baseTheme.fonts, ...(overrides.fonts || {}) },
        fontSize: { ...baseTheme.fontSize, ...(overrides.fontSize || {}) },
        spacing: { ...baseTheme.spacing, ...(overrides.spacing || {}) },
      }
    : baseTheme
  const hidden = data.hiddenSections || []

  if (theme.layout === 'two-col') {
    return (
      <TwoColumnLayout
        theme={theme}
        sidebar={
          <>
            <div data-section-id="personal">
              <PersonalHeader data={data} theme={theme} variant="sidebar" />
            </div>
            {!hidden.includes('skills') && <div data-section-id="skills">{renderSkills(data.skills, theme)}</div>}
            {!hidden.includes('languages') && <div data-section-id="languages">{renderLanguages(data.languages, theme)}</div>}
            {!hidden.includes('certifications') && <div data-section-id="certifications">{renderCertifications(data.certifications, theme)}</div>}
          </>
        }
        main={
          <>
            {!hidden.includes('personal') && data.personal.summary && <div data-section-id="summary">{renderSummary(data.personal.summary, theme)}</div>}
            {!hidden.includes('experience') && <div data-section-id="experience">{renderExperience(data.experience, theme)}</div>}
            {!hidden.includes('education') && <div data-section-id="education">{renderEducation(data.education, theme)}</div>}
            {!hidden.includes('projects') && <div data-section-id="projects">{renderProjects(data.projects, theme)}</div>}
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
      <div data-section-id="personal">
        <PersonalHeader data={data} theme={theme} variant={data.atsMode ? 'ats' : theme.headerStyle || 'default'} />
      </div>
      {!hidden.includes('personal') && data.personal.summary && (
        <div data-section-id="summary">
          {data.atsMode ? (
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
          )}
        </div>
      )}
      {!hidden.includes('experience') && <div data-section-id="experience">{renderExperience(data.experience, theme)}</div>}
      {!hidden.includes('education') && <div data-section-id="education">{renderEducation(data.education, theme)}</div>}
      {!hidden.includes('skills') && <div data-section-id="skills">{renderSkills(data.skills, theme)}</div>}
      {!hidden.includes('projects') && <div data-section-id="projects">{renderProjects(data.projects, theme)}</div>}
      {!hidden.includes('certifications') && <div data-section-id="certifications">{renderCertifications(data.certifications, theme)}</div>}
      {!hidden.includes('languages') && <div data-section-id="languages">{renderLanguages(data.languages, theme)}</div>}
      <div data-section-id="custom">
        {renderCustomSections(
          data.customSections.filter((cs) => !hidden.includes(`custom_${cs.id}`)),
          theme,
        )}
      </div>
    </SingleColumnLayout>
  )
}
