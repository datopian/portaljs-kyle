import type { GetStaticPaths, GetStaticProps } from 'next'
import { STORIES, STORY_SLUGS } from '../../lib/stories/registry'
import type { Story } from '../../lib/stories/types'
import StoryLayout from '../../components/story/StoryLayout'

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: STORY_SLUGS.map((slug) => ({ params: { slug } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<{ story: Story }> = async ({ params }) => {
  const slug = String(params?.slug)
  const entry = STORIES[slug]
  if (!entry) return { notFound: true }
  const story = await entry.load()
  return { props: { story } }
}

export default function ShowcaseStory({ story }: { story: Story }) {
  return <StoryLayout story={story} />
}
