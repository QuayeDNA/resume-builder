/**
 * @typedef {Object} PersonalInfo
 * @property {string} name
 * @property {string} title
 * @property {string} email
 * @property {string} phone
 * @property {string} location
 * @property {string} website
 * @property {string} linkedin
 * @property {string} summary
 */

/**
 * @typedef {Object} ExperienceEntry
 * @property {number} id
 * @property {string} company
 * @property {string} role
 * @property {string} start
 * @property {string} end
 * @property {string} location
 * @property {string[]} bullets
 */

/**
 * @typedef {Object} EducationEntry
 * @property {number} id
 * @property {string} school
 * @property {string} degree
 * @property {string} start
 * @property {string} end
 * @property {string} gpa
 */

/**
 * @typedef {Object} ProjectEntry
 * @property {number} id
 * @property {string} name
 * @property {string} url
 * @property {string} description
 */

/**
 * @typedef {Object} CertificationEntry
 * @property {number} id
 * @property {string} name
 * @property {string} issuer
 * @property {string} year
 */

/**
 * @typedef {Object} LanguageEntry
 * @property {number} id
 * @property {string} language
 * @property {string} proficiency
 */

/**
 * @typedef {Object} ResumeData
 * @property {PersonalInfo} personal
 * @property {ExperienceEntry[]} experience
 * @property {EducationEntry[]} education
 * @property {string[]} skills
 * @property {ProjectEntry[]} projects
 * @property {CertificationEntry[]} certifications
 * @property {LanguageEntry[]} languages
 * @property {string} template
 */

/**
 * @typedef {Object} CoverLetterData
 * @property {string} recipientName
 * @property {string} company
 * @property {string} role
 * @property {string} tone
 * @property {string} body
 */

/**
 * @typedef {Object} ResumeSlot
 * @property {number} id
 * @property {string} name
 * @property {ResumeData} data
 * @property {CoverLetterData} cl
 */

/**
 * @typedef {Object} AtsResult
 * @property {number} score
 * @property {string[]} feedback
 * @property {number} verbCount
 * @property {number} metricCount
 */

export const PROFICIENCY_OPTIONS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic']
export const COVER_LETTER_TONES  = ['professional', 'enthusiastic', 'concise', 'creative']
export const SECTION_IDS = ['personal','experience','education','skills','projects','certifications','languages','coverletter','design','saved']
