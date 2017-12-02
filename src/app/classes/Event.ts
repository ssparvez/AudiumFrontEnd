import { Address } from './Address'

export interface Event {
    eventId?: string,
    eventTitle?: string,
    //eventDate?: Date,
    eventDate?: string,
    isCancelled?: boolean,
    address?: Address
}
