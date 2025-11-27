import { MasterData, Region, Language } from "./agent-core/types"
import { Translation } from "./translation"

export interface PageProps {
    params: Promise<{ region?: Region, locale: Language, id?: string, username?: string, query?: string }>
}

export interface ViewProps {
    masterData: MasterData
    t: Translation
    isMobile: boolean
}

export const supported_languages = ['en', 'jp']