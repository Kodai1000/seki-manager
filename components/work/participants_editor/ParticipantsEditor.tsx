"use client"
import { Project } from "@/types/main/project";
import AttributeAdder from "@/components/work/attribute_adder/AttributeAdder";

type Props = {
    project: Project
    setProject: (objects: Project) => void;
}

export default function ParticipantEditor(props: Props) {
    const { project, setProject } = props;

    // 参加者を追加
    const addParticipant = () => {
        const newParticipant = {
            id: crypto.randomUUID(),
            name: "",
            attributes: []
        };

        setProject({
            ...project,
            participants: [
                ...project.participants,
                newParticipant,
            ],
        });
    };

    // 参加者を削除
    const removeParticipant = (id: string) => {
        setProject({
            ...project,
            participants: project.participants.filter(
                (participant) => participant.id !== id
            ),
        });
    };

    // 属性を削除
    const removeAttribute = (participantId: string, removedAttribute: string) => {
        const newParticipants = project.participants.map((participant) => {
            if (participant.id === participantId) {
                return {
                    ...participant,
                    attributes: participant.attributes.filter(
                        (attribute) => attribute !== removedAttribute
                    ),
                };
            }
            return participant;
        });

        setProject({
            ...project,
            participants: newParticipants,
        });
    };

    return (
        <div>
            <h1>参加者編集</h1>

            {project.participants.map((participant, index) => {
                return (
                    <div
                        key={participant.id}
                        className="items-center bg-gray-100 p-2 mb-2 rounded border shadow"
                    >
                        <div className="flex flex-row gap-4">
                            <p>参加者{index}:</p>
                            <input
                                type="text"
                                value={participant.name}
                                className="rounded border px-2 py-1"
                                placeholder="名前"
                                onChange={(e) => {
                                    const newParticipants = [...project.participants];

                                    newParticipants[index] = {
                                        ...newParticipants[index],
                                        name: e.target.value,
                                    };

                                    setProject({
                                        ...project,
                                        participants: newParticipants,
                                    });
                                }}
                            />
                            
                            {/* 参加者削除ボタン */}
                            <button
                                type="button"
                                onClick={() => removeParticipant(participant.id)}
                                className="rounded bg-red-500 px-3 py-1 text-white text-sm ml-auto"
                            >
                                削除
                            </button>
                        </div>
                        
                        <hr className="mt-4 border-gray-300" />
                        
                        {/* 属性一覧と削除ボタン */}
                        <div className="mt-2 space-y-2 flex space-x-4">
                            {participant.attributes.map((attribute, index) => {
                                return (
                                    <div 
                                        key={index} 
                                        className="bg-white p-2 rounded border space-x-4"
                                    >
                                        <span className="text-blue-500">#{attribute}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeAttribute(participant.id, attribute)}
                                            className="rounded bg-red-400 px-2 py-1 text-white text-xs"
                                        >
                                            x
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-2">
                            <AttributeAdder project={project} setProject={setProject} participantId={participant.id}/>
                        </div>
                    </div>
                );
            })}
            
            <button
                type="button"
                onClick={addParticipant}
                className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
            >
                参加者追加
            </button>
        </div>
    );
}