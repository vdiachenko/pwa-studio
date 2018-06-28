import M2ApiResponseError from './M2ApiResponseError';

const headers = {
    'Content-type': 'application/json',
    Accept: 'application/json'
};

const outstanding = new WeakMap();
export function canceller(req) {
    const controller = outstanding.get(req);
    return () => controller.abort();
}
export default function magentoRestRequest({ method, path, body }) {
    const fullPath = `/rest/V1/${path}`;
    const controller = new AbortController();
    const { signal } = controller;
    const reqPromise = fetch(fullPath, {
        signal,
        method,
        headers,
        body,
        credentials: 'include'
    }).then(res => {
        if (!res.ok) {
            return res
                .text()
                .catch(e => e.message)
                .then(bodyText => {
                    throw new M2ApiResponseError({
                        method,
                        path,
                        res,
                        bodyText
                    });
                });
        }
        return res.json();
    });
    outstanding.set(reqPromise, controller);
    return reqPromise;
}
