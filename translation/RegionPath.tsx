import { Language } from '@/Definitions';

export function getRegionPath(language: Language) {
    switch (language) {
        case 'jp':
            return '/jp/'
        default:
            return '/'
    }
}