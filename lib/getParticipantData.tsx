import { Project } from "../types/main/project";
import { Participant } from "../types/main/participant";

export default function getParticipantData(project: Project, participantId: string): Participant | undefined {
    return project.participants.find((participant) => participant.id === participantId);
}