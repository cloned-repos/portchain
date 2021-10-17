import type { RequestInit, RequestInfo, HeadersInit, BodyInit } from 'node-fetch';

export class FetchResponse<T> {
    #isOk;
    #status;
    #statusText;
    #payload;
    #url;
    constructor(ok: boolean, status: number, statusText: string, payload: string, url: RequestInfo) {
        this.#isOk = ok;
        this.#status = status;
        this.#statusText = statusText;
        this.#url = url;
        this.#payload = payload;
    }

    get ok(): boolean {
        return this.#isOk;
    }
    get status(): number {
        return this.#status;
    }
    get statusText(): string {
        return this.#statusText;
    }
    get url(): string {
        if (typeof this.#url === 'string') {
            return this.#url;
        }
        return this.#url.url;
    }
    json(): Promise<T> {
        const obj: T = (JSON.parse(this.#payload) as unknown) as T;
        return Promise.resolve(obj);
    }
    text(): Promise<string> {
        return Promise.resolve(this.#payload);
    }
}

export interface MockOptions {
    delay?: number
    jitter?: number
    forceError?: boolean,
    _4xx?: MockHandler<''>
    mappings?: {
        [index: string]: MockHandler<unknown>
    }
}

export function _404(_0: unknown, _1: unknown, _2: unknown, url: RequestInfo):  FetchResponse<''> {      // 4xx handler
    return new FetchResponse(false, 404, '', '', url);
}

export type MockHandler<T> = (method: string, headers: HeadersInit, body: BodyInit | null, url: RequestInfo) => FetchResponse<T>;
export type FetchFunction = (url: RequestInfo, init?: RequestInit) => Promise<FetchResponse<unknown>>;

function createFetchMock(mockOptions: MockOptions = {}): {
    fetch: FetchFunction,
    urlResponseMap: Map<RequestInfo, MockHandler<unknown>>
} {
    const { delay = 100, jitter = 100, _4xx = _404, forceError = false, mappings = {} } = mockOptions;
    const urlResponseMap = new Map<RequestInfo, MockHandler<unknown>>(); // map url fetch to responses

    for (const [url, response] of Object.entries(mappings)) {
        urlResponseMap.set(url, response);
    }

    async function fetch(url: RequestInfo, init: RequestInit = { method: 'GET' }): Promise<FetchResponse<unknown>> {

        const respTime = Math.trunc(delay + Math.random() * jitter);

        const { method = 'GET', headers = {}, body = '' } = init;

        const resp = forceError ? _4xx : urlResponseMap.get(url) || _4xx;

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(resp(method, headers, body, url));
            }, respTime);
        });
    }

    return { urlResponseMap, fetch };

}

jest.mock('node-fetch',()=>{
    const { urlResponseMap, fetch } = createFetchMock()
    return {
        __esModule: true, // Use it when dealing with esModules
        default: jest.fn(fetch),
        fnMap: urlResponseMap
    }
});


