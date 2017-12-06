import { Address } from './Address'
import { Artist } from './Artist'

export interface Event {
    eventId?: string,
    eventTitle?: string,
    //eventDate?: Date,
    eventDate?: string,
    isCancelled?: boolean,
    address?: Address
    Artists?: Artist[];
}
