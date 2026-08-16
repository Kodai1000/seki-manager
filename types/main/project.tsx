import { Seat } from "./seat"
import { Participant } from "./participant"
import { Object } from "./text"

export type Project = {
    seats: Seat[],
    participants: Participant[],
    object: Object[]
}