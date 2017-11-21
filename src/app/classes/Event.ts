import { Address } from './Address'

export interface Event {
    eventId?: string,
    eventTitle?: string,
    eventDate?: Date,
    address?: Address
}
