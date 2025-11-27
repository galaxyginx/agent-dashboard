import { Metadata } from "next"
import { baseUrl, appName } from "@/agent-core/types"
import { PageProps } from "@/types"
import { getTranslation } from "@/translation"
import { getRegionPath } from "@/translation/RegionPath"
import HomePage from "@/app/page"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params
    const t = await getTranslation(locale)
    return {
        metadataBase: new URL(baseUrl!),
        title: appName,
        description: t.home.description,
        openGraph: {
            siteName: appName,
            title: appName,
            description: t.home.description,
            url: `${getRegionPath(locale)}`,
            images: '/images/open-graph.png',
            type: 'website'
        },
    }
}

export default async function HomePageGlobal({ params }: PageProps) {
  return <HomePage params={params} />
}