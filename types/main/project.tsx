import { Seat } from "./seat"
import { Participant } from "./participant"
import { Object } from "./object"
import { Attribute } from "./attribute"

export type Project = {
    seats: Seat[],
    participants: Participant[],
    objects: Object[],
    attributes: Attribute[]
}