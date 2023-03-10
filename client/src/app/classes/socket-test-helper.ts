/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-types
type CallbackSignature = (param?: any, parma2?: any, param3?: any) => {};

export class SocketTestHelper {
    on(event: string, callback: CallbackSignature): void {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.callbacks.get(event)!.push(callback);
    }

    // eslint-disable-next-line no-unused-vars
    emit(event: string, ...params: any): void {
        return;
    }

    disconnect(): void {
        return;
    }

    peerSideEmit(event: string, params?: any) {
        if (!this.callbacks.has(event)) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        for (const callback of this.callbacks.get(event)!) {
            callback(params);
        }
    }

    peerEmitTwoParams(event: string, param?: any, param2?: any) {
        if (!this.callbacks.has(event)) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        for (const callback of this.callbacks.get(event)!) {
            callback(param, param2);
        }
    }

    peerEmitThreeParams(event: string, param?: any, param2?: any, param3?: any) {
        if (!this.callbacks.has(event)) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        for (const callback of this.callbacks.get(event)!) {
            callback(param, param2, param3);
        }
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    private callbacks = new Map<string, CallbackSignature[]>();
}
