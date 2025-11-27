import { getTranslation, Translation } from '@/translation';
import { baseUrl } from '@/agent-core/types';

export const ENDPOINT = `${baseUrl}/api/`;

export const headers = ({ 'Content-Type': 'application/json', 'Accept': '*/*', 'Accept-Encoding': "gzip, deflate, lbr", 'Connection': 'keep-alive' })

export const defaultTimeout = 10000

export async function getHeaderWithoutContentType() {
    return { 'Accept': `*/*` };
}

//For SWR fetcbing, focused on GET method
export const fetcher = async (url: string) => {
    const timeoutCon = new AbortController()
    const timeout = setTimeout(() => timeoutCon.abort(), 7000);
    const options: RequestInit = {
        method: 'GET',
        headers,
        signal: timeoutCon.signal,
    };
    const res = await fetch(url, options).finally(() => clearTimeout(timeout));
    const data = await res.json();
    return data.data;
}

export async function sendDefaultRequest({ path, options, API, timeout = defaultTimeout, customValue }: { path: string, options: RequestInit, API: any, timeout?: number, customValue?: any }) {
    const timeoutCon = new AbortController()
    const _timeout = setTimeout(() => timeoutCon.abort(), timeout)
    const t = await getTranslation(API.getState().main.locale)
    options.signal = timeoutCon.signal
    try {
        const res = await fetch(ENDPOINT + path, options).finally(() => clearTimeout(_timeout))
        return handleResponse(res, t, API, customValue)
    } catch (error: any) {
        if (error.name === 'AbortError')
            return API.rejectWithValue(`${t.response.timeout}  ${error}`);
        return API.rejectWithValue(`${t.response.default_error_message}  ${error}`);
    }
}

//Mainly used to handle response of createAsyncThunk
export async function handleResponse(res: Response, t: Translation, API: any, customValue?: any) {
    const data = await res.json()
    if (res.status === 200)
        return API.fulfillWithValue(customValue || data.data)
    if (res.status === 401) {
        return API.rejectWithValue(t.response.token_not_valid)
    }
    return API.rejectWithValue(`${t.response.error_code}${res.status}  ${data?.meta?.msg || t.response.default_error_message}`);
}