import type { CustomSectionEntry } from '../../types'
import type { TemplateTheme } from '../theme'
import SectionTitle from '../components/SectionTitle'
import Bullet from '../components/Bullet'

export function renderCustomSections(customSections: CustomSectionEntry[], theme: TemplateTheme) {
  if (!customSections || customSections.length === 0) return null

  return (
    <>
      {customSections.map((cs) => (
        <section key={cs.id}>
          <SectionTitle label={cs.name} theme={theme} />
          {cs.description && (
            <p style={{ fontSize: '10.5px', color: '#333', margin: '6px 0 0 0', lineHeight: '1.65' }}>
              {cs.description}
            </p>
          )}
          {cs.bullets.filter((b) => b.trim()).map((b, i) => (
            <Bullet key={i} text={b} theme={theme} />
          ))}
        </section>
      ))}
    </>
  )
}
