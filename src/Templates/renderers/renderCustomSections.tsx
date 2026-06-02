import type { CustomSection } from '../../types'
import type { TemplateTheme } from '../theme'
import SectionTitle from '../components/SectionTitle'
import Bullet from '../components/Bullet'

export function renderCustomSections(customSections: CustomSection[], theme: TemplateTheme) {
  if (!customSections || customSections.length === 0) return null

  return (
    <>
      {customSections.map((cs) => (
        <section key={cs.id}>
          <SectionTitle label={cs.name} theme={theme} />
          {cs.entries.map((entry) => (
            <div key={entry.id} style={{ marginBottom: '10px' }}>
              {cs.fields.map((field) => {
                const val = entry.values[field.key]
                if (!val?.trim()) return null
                return field.type === 'textarea' ? (
                  <p key={field.key} style={{ fontSize: '10.5px', color: '#333', margin: '4px 0', lineHeight: '1.65' }}>
                    {val}
                  </p>
                ) : (
                  <p key={field.key} style={{ fontSize: '10.5px', fontWeight: 600, color: '#1a1a1a', margin: '2px 0' }}>
                    {val}
                  </p>
                )
              })}
              {entry.bullets.filter((b) => b.trim()).map((b, i) => (
                <Bullet key={i} text={b} theme={theme} />
              ))}
            </div>
          ))}
        </section>
      ))}
    </>
  )
}
