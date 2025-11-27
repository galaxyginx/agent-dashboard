import { Language } from '@/agent-core/types'
import { supported_languages } from '@/types'
import en from './languages/en.json'
import jp from './languages/jp.json'

export type Translation = typeof en | typeof jp

const languagess = {
    en: () => import('./languages/en.json').then((module) => module.default),
    jp: () => import('./languages/jp.json').then((module) => module.default),
}

export const getTranslation = async (locale: Language) => supported_languages.some(lang => lang == locale) ? languagess[locale]() : import('./languages/en.json').then((module) => module.default)