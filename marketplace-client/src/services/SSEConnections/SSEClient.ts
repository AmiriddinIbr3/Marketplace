import { FatalError, RetriableError } from '@/errors/errors';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { Subject } from 'rxjs';

const EventStreamContentType = 'text/event-stream';

export default class SSEClient<T> {
    constructor(private readonly apiUrl: string, private readonly url: string) {}

    public createSSEConnection(payload?: string, accessToken?: string): Subject<T> {
        const subject: Subject<T> = new Subject<T>();

        const headers: HeadersInit = {
            'Content-Type': EventStreamContentType,
        };

        if (accessToken) {
            headers['Authorization'] = `Bearer ${accessToken}`;
        }
        
        fetchEventSource(this.apiUrl + this.url, {
            method: 'POST',
            headers: headers,
            body: payload ? payload : undefined,
            onopen: async (response) => {
                if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
                    return;
                }
                else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                    subject.error(new FatalError(`HTTP ${response.status}: ${response.statusText}`));
                }
                else {
                    subject.error(new RetriableError(`HTTP ${response.status}: ${response.statusText}`));
                }
            },
            onmessage: (msg) => {
                if (msg.event === 'FatalError') {
                    subject.error(new FatalError(msg.data));
                }
                else {
                    try {
                        const data: T = JSON.parse(msg.data);
                        subject.next(data);
                    }
                    catch (error) {
                        subject.error(new Error('Error parsing message'));
                    }
                }
            },
            onclose: () => {
                subject.complete();
            },
            onerror: (error) => {
                if (error instanceof FatalError) {
                    subject.error(error);
                }
                else {
                    subject.error(new Error('SSE error'));
                }
            }
        });

        return subject;
    }
}