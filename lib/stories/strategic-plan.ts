// Strategic Plan story. Narrative, data-light: the City's overall vision plus its
// five strategic focus areas. Content authored from the City's published plan.
// KPI/progress metrics can be layered on later (see docs/showcases-plan.md, Phase 6).

import type { Story } from './types'

const VISION =
  'Kyle aspires to be the undisputed regional leader in vehicular and pedestrian ' +
  'mobility, state-of-the-art parks and sports infrastructure, downtown ' +
  'redevelopment, and quality-of-life retail which augment a diverse, vibrant, ' +
  'equitable, thriving community that families, neighbors, and businesses are proud ' +
  'to call home.'

const PILLARS = [
  {
    title: 'Thriving & Prosperous',
    body:
      'Kyle is shaping its future as the undisputed economic powerhouse of Hays County — ' +
      'an innovative, business-friendly destination where workforce development, emerging ' +
      'technologies, and long-term sustainability drive prosperity and position the city ' +
      'for continued leadership in the region.',
  },
  {
    title: 'Sustainable & Resilient',
    body:
      'Kyle prioritizes sustainable and resilient infrastructure by investing in ' +
      'well-maintained streets, sidewalks, and drainage systems. Through strategic growth ' +
      'management, the city proactively addresses water and wastewater needs with a focus ' +
      'on conservation and innovation — ensuring long-term viability for both residents ' +
      'and businesses.',
  },
  {
    title: 'Excellent & Accountable',
    body:
      'Kyle cultivates a high-performing government rooted in innovation, continuous ' +
      'improvement, and a culture of excellence — upholding the highest standards of ' +
      'service as we evolve to meet community needs efficiently and transparently.',
  },
  {
    title: 'Safe & Welcoming',
    body:
      'Kyle is a safe and welcoming city where residents support one another and embrace ' +
      'diversity. Community initiatives, inclusive public spaces, and strong neighborhood ' +
      'connections create a sense of belonging for all.',
  },
  {
    title: 'Vibrant & Fun',
    body:
      'Kyle is a dynamic destination where culture, entertainment, and innovation thrive. ' +
      'With diverse events, vibrant public spaces, and growing business opportunities, the ' +
      'city attracts visitors, promotes local talent, and enhances quality of life for all ' +
      'residents.',
  },
]

export async function loadStrategicPlan(): Promise<Story> {
  return {
    meta: {
      slug: 'strategic-plan',
      title: 'Strategic Plan',
      subtitle: "The City of Kyle's long-term organizational direction, goals, and progress.",
      eyebrow: 'City of Kyle',
    },
    sections: [
      {
        id: 'vision',
        title: 'Our Vision',
        blocks: [{ kind: 'prose', html: `<p class="text-lg">${VISION}</p>` }],
      },
      {
        id: 'focus-areas',
        title: 'Strategic Focus Areas',
        blocks: [{ kind: 'pillars', items: PILLARS }],
      },
    ],
  }
}
