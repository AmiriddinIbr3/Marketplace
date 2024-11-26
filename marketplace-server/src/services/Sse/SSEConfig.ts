import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class SeeConfig<T> {
    private readonly eventSubjects: Map<string, Subject<T | MessageEvent>> = new Map();

    isEventActive(userId: string): boolean {
        return this.eventSubjects.has(userId);
    }

    getObservable(userId: string): Observable<T | MessageEvent> {
        if (!this.eventSubjects.has(userId)) {
            this.eventSubjects.set(userId, new Subject<MessageEvent>());
        }
        
        return this.eventSubjects.get(userId).asObservable();
    }

    emitEvent(userId: string, data: T): void {
        const subject = this.eventSubjects.get(userId);
        
        if (subject) {
            subject.next(data);
        }
    }

    clearEvent(userId: string): void {
        const subject = this.eventSubjects.get(userId);
        
        if (subject) {
            subject.complete();
            this.eventSubjects.delete(userId);
        }
    }
}