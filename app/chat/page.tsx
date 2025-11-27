import { Metadata } from "next"
import { baseUrl, appName } from "@/agent-core/types"
import { PageProps } from "@/types"
import { getTranslation } from "@/translation"
import BaseLayout from "@/components/templates/BaseLayout"
import ChatView from "@/components/organisms/ChatView"
import { getMasterData } from "@/requests/ServerRequest"
import { getRegionPath } from "@/translation/RegionPath"
import { headers } from "next/headers"
import { isMobileDevice } from "@/lib/utils"

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

export default async function ChatPage({ params }: PageProps) {
  const { locale } = await params
  const [masterData, t, header] = await Promise.all([getMasterData(), getTranslation(locale), headers()])
  const isMobile = isMobileDevice(header.get("user-agent"))
  return <BaseLayout masterData={{ ...masterData, locale }} t={t} isMobile={isMobile}>
    <ChatView masterData={{...masterData, locale}} t={t} isMobile={isMobile} />
  </BaseLayout>
}