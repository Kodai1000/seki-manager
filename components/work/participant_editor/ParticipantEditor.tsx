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
                        {/* mt-4 で上にスペースを空けています（好みに合わせて mt-2 や mt-6 に調整可能です） */}
                        <hr className="mt-4 border-gray-300" />
                        <div>
                            {participant.attributes.map((attribute,index)=>{
                                return (
                                    <div key={attribute.id}>
                                        <p>{attribute.name}</p>
                                    </div>
                                )
                            })}
                        </div>
                        <AttributeAdder project={project} setProject={setProject} participantId={participant.id}/>
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