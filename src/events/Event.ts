
export default class Event<T> implements IEvent<T> {
    public debugEvents: boolean = false;
    public subscribers: Array<IEventSubscriber<T>> = [];

    public addListener(listener:(data:T) => void, context: any): void {
            let subscriberToAdd: IEventSubscriber<T> = {
            function: listener,
            context: context
        };
        this.subscribers.push(subscriberToAdd);

        if(this.debugEvents)
            console.log('[Adding listener]\n', context, this.subscribers.length);
    }

    public removeListener(listener:(data:T) => void, context: any): void {
        let subscriberIndex = -1;
        for(let i: number = 0; i < this.subscribers.length; i++) {
            if(
                this.subscribers[i].context == context &&
                this.subscribers[i].function == listener
            ) {
                subscriberIndex = i;
                break; 
            }
        }
        if(subscriberIndex !== -1) {
            this.subscribers.splice(subscriberIndex, 1);

            if(this.debugEvents)
                console.log('[Removing listener]\n', context, '\n[Current subscriber list]\n', this.subscribers);
        } else {
            console.warn("You are trying to remove a listener that is not added.");
        }
    }

    public fire(data:T): void {
        if(this.debugEvents)
            console.log('[Fireing event]\nEventdata:\n', data);

        //For every listener we create a "event"-message that is pushed to it's callback-function
        let eventsToBeFired:Array<IEventSubscriber<T>> = this.subscribers.slice();

        for(let i = 0; i < eventsToBeFired.length; i++) {
            if(this.debugEvents)
                console.log('[Fireing subscriber function]\n',eventsToBeFired[i],'\n[Context]:\n', eventsToBeFired[i].context);

            eventsToBeFired[i].function.apply(eventsToBeFired[i].context, [data]);            
        }
    }
}

/**
 * Helper interfaces
 */
export interface IEventSubscriber<T> {
    function: (data:T) => void,
    context: any
}

export interface IEvent<T> {
    subscribers: Array<IEventSubscriber<T>>;
    addListener(listener:(data:T) => void, context: any): void;
    removeListener(listener:(data:T) => void, context: any): void;
    fire(data:T): void;
}
