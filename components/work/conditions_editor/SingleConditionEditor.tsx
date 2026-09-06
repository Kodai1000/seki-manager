"use client";

import { seat_colors } from "@/data/seat_colors";
import { Condition } from "@/types/main/condition";
import { Project } from "@/types/main/project";

type Props = {
    conditionId: string;
    project: Project;
    setProject: (project: Project) => void;
};

type ObjectSelectorProps = {
    object: Condition["objectA"];
    label: string;
    participants: Project["participants"];
    onChange: (
        type: "participant" | "attribute" | null,
        ref: string
    ) => void;
};

function ObjectSelector({
    object,
    label,
    participants,
    onChange,
}: ObjectSelectorProps) {
    return (
        <div className="space-y-2 border p-4 rounded bg-white">
            <p className="text-sm font-medium text-gray-700">
                {label}
            </p>

            <select
                value={object.type ?? ""}
                onChange={(e) => {
                    const type =
                        e.target.value === ""
                            ? null
                            : (e.target.value as
                                  | "participant"
                                  | "attribute");

                    onChange(type, "");
                }}
                className="rounded border border-gray-300 px-3 py-2 text-sm"
            >
                <option value="">
                    指定方法を選択
                </option>

                <option value="participant">
                    参加者
                </option>

                <option value="attribute">
                    属性
                </option>
            </select>

            {object.type === "participant" && (
                <select
                    value={object.ref}
                    onChange={(e) =>
                        onChange(
                            "participant",
                            e.target.value
                        )
                    }
                    className="ml-2 rounded border border-gray-300 px-3 py-2 text-sm"
                >
                    <option value="">
                        参加者を選択してください
                    </option>

                    {participants.map((participant) => (
                        <option
                            key={participant.id}
                            value={participant.id}
                        >
                            {participant.name}
                        </option>
                    ))}
                </select>
            )}

            {object.type === "attribute" && (
                <input
                    type="text"
                    value={object.ref}
                    placeholder="属性名を入力"
                    onChange={(e) =>
                        onChange(
                            "attribute",
                            e.target.value
                        )
                    }
                    className="ml-2 rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
            )}
        </div>
    );
}

type AttributeSelectorProps = {
    object: Condition["objectA"];
    onChange: (ref: string) => void;
};

function AttributeSelector({
    object,
    onChange,
}: AttributeSelectorProps) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
                属性
            </p>

            <input
                type="text"
                value={object.ref}
                placeholder="属性名を入力"
                onChange={(e) => onChange(e.target.value)}
                className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
        </div>
    );
}

export default function SingleConditionEditor(props: Props) {
    const { conditionId, project, setProject } = props;

    const condition = project.conditions.find(
        (condition) => condition.id === conditionId
    );

    if (!condition) return null;

    const updateCondition = (
        update: Partial<Condition>
    ) => {
        setProject({
            ...project,
            conditions: project.conditions.map((c) =>
                c.id === conditionId
                    ? { ...c, ...update }
                    : c
            ),
        });
    };

    const updateObject = (
        objectName: "objectA" | "objectB",
        type: "participant" | "attribute" | null,
        ref: string
    ) => {
        updateCondition({
            [objectName]: {
                type,
                ref,
            },
        });
    };

    return (
        <div className="space-y-4">
            {/* 条件タイプ */}
            <div>
                <select
                    value={condition.type}
                    onChange={(e) =>
                        updateCondition({
                            type: Number(e.target.value),
                        })
                    }
                    className="rounded border border-gray-300 px-3 py-2 text-sm"
                >
                    <option value={0}>
                        条件のタイプを選択してください
                    </option>

                    <option value={1}>
                        ある人(属性)を特定の色の座席に割り当て
                    </option>

                    <option value={2}>
                        ある人(属性)とある人(属性)を近づける
                    </option>

                    <option value={3}>
                        ある人(属性)とある人(属性)を遠ざける
                    </option>

                    <option value={4}>
                        ある属性同士を近づける
                    </option>

                    <option value={5}>
                        ある属性同士を遠ざける
                    </option>
                </select>
            </div>

            {/* タイプ未選択 */}
            {condition.type === 0 && (
                <p className="text-sm text-gray-500">
                    条件タイプを選択してください
                </p>
            )}

            {/* 1: 特定の人・属性を特定の色の座席に割り当て */}
            {condition.type === 1 && (
                <div className="space-y-3">
                    <ObjectSelector
                        object={condition.objectA}
                        label="対象"
                        participants={project.participants}
                        onChange={(type, ref) =>
                            updateObject(
                                "objectA",
                                type,
                                ref
                            )
                        }
                    />

                    <div className="flex items-center gap-3">
                        <p className="text-sm font-medium text-gray-700">
                            座席の色
                        </p>
                        <select
                            value={condition.color ?? ""}
                            onChange={(e) =>
                                updateCondition({
                                    color: e.target.value,
                                })
                            }
                            className="rounded border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="">色を選択してください</option>
                            {seat_colors.map((seat_color) => (
                                <option
                                    key={seat_color.color}
                                    value={seat_color.color}
                                >
                                    {seat_color.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* 2: 人・属性同士を近づける */}
            {condition.type === 2 && (
                <div className="flex flex-col space-y-3 rounded bg-gray-50 p-4">
                    <div className="flex space-x-4">
                        <ObjectSelector
                            object={condition.objectA}
                            label="対象A"
                            participants={project.participants}
                            onChange={(type, ref) =>
                                updateObject(
                                    "objectA",
                                    type,
                                    ref
                                )
                            }
                        />

                        <ObjectSelector
                            object={condition.objectB}
                            label="対象B"
                            participants={project.participants}
                            onChange={(type, ref) =>
                                updateObject(
                                    "objectB",
                                    type,
                                    ref
                                )
                            }
                        />
                    </div>

                    <p className="text-sm text-gray-600">
                        対象Aと対象Bを近づけます。
                    </p>
                </div>
            )}

            {/* 3: 人・属性同士を遠ざける */}
            {condition.type === 3 && (
                <div className="flex flex-col space-y-3 rounded bg-gray-50 p-4">
                    <div className="flex space-x-4">
                        <ObjectSelector
                            object={condition.objectA}
                            label="対象A"
                            participants={project.participants}
                            onChange={(type, ref) =>
                                updateObject(
                                    "objectA",
                                    type,
                                    ref
                                )
                            }
                        />

                        <ObjectSelector
                            object={condition.objectB}
                            label="対象B"
                            participants={project.participants}
                            onChange={(type, ref) =>
                                updateObject(
                                    "objectB",
                                    type,
                                    ref
                                )
                            }
                        />
                    </div>

                    <p className="text-sm text-gray-600">
                        対象Aと対象Bを遠ざけます。
                    </p>
                </div>
            )}

            {/* 4: 同じ属性の人同士を近づける */}
            {condition.type === 4 && (
                <div className="flex space-x-4 rounded bg-gray-50 p-4">
                    <AttributeSelector
                        object={condition.objectA}
                        onChange={(ref) =>
                            updateObject(
                                "objectA",
                                "attribute",
                                ref
                            )
                        }
                    />

                    <p className="text-sm text-gray-600 self-center">
                        この属性を持つ人同士を近づけます。
                    </p>
                </div>
            )}

            {/* 5: 同じ属性の人同士を遠ざける */}
            {condition.type === 5 && (
                <div className="flex space-x-4 rounded bg-gray-50 p-4">
                    <AttributeSelector
                        object={condition.objectA}
                        onChange={(ref) =>
                            updateObject(
                                "objectA",
                                "attribute",
                                ref
                            )
                        }
                    />

                    <p className="text-sm text-gray-600 self-center">
                        この属性を持つ人同士を遠ざけます。
                    </p>
                </div>
            )}
        </div>
    );
}