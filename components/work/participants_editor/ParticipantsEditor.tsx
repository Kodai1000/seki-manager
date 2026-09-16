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
            seats: project.seats.map((seat) => ({
                ...seat,
                allocate_ids: seat.allocate_ids.filter(
                    (participantId) => participantId !== id
                ),
            })),
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold">
                        参加者編集
                    </h2>
                    <p>席に割り当てる参加者を設定できます。</p>
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    全 {project.participants.length} 人
                </span>
            </div>

            {/* 参加者一覧 */}
            <div className="space-y-4">
                {project.participants.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center">
                        <p className="text-sm text-gray-500">
                            参加者は設定されていません。下のボタンから追加してください。
                        </p>
                    </div>
                ) : (
                    project.participants.map((participant, index) => {
                        return (
                            <div
                                key={participant.id}
                                className="rounded border bg-gray-100 p-4 space-y-4 shadow-sm"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-800">
                                        参加者 {index + 1}
                                    </span>
                                    
                                    {/* 参加者削除ボタン */}
                                    <button
                                        type="button"
                                        onClick={() => removeParticipant(participant.id)}
                                        className="text-white rounded text-xs font-medium px-2.5 py-1 bg-red-500 hover:bg-red-600 transition"
                                        title="この参加者を削除"
                                    >
                                        削除
                                    </button>
                                </div>

                                <input
                                    type="text"
                                    value={participant.name}
                                    className="w-full rounded border bg-white px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    placeholder="参加者名を入力"
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
                                
                                <hr className="border-gray-300" />
                                
                                {/* 属性一覧と削除ボタン */}
                                <div className="flex flex-wrap gap-2">
                                    {participant.attributes.map((attribute, attrIndex) => {
                                        return (
                                            <div 
                                                key={attrIndex} 
                                                className="flex items-center bg-white px-2.5 py-1 rounded border space-x-2 shadow-xs"
                                            >
                                                <span className="text-blue-500 text-sm">{attribute}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttribute(participant.id, attribute)}
                                                    className="rounded bg-red-400 hover:bg-red-500 px-1.5 py-0.5 text-white text-xs transition"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div>
                                    <AttributeAdder project={project} setProject={setProject} participantId={participant.id}/>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            
            {/* 参加者追加ボタン */}
            <button
                type="button"
                onClick={addParticipant}
                className="w-full rounded-xl border border-dashed border-blue-300 bg-blue-50/50 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100/50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
                ＋ 参加者を追加
            </button>
        </div>
    );
}
