"use client";

import { Condition } from "@/types/main/condition";
import { Project } from "@/types/main/project";
import SingleConditionEditor from "./SingleConditionEditor";
import autoAllocate from "@/lib/autoAllocate";

type Props = {
    project: Project;
    setProject: (project: Project) => void;
    setTabIndex: (tabIndex: number)=>void;
};

export default function ConditionEditor(props: Props) {
    const { project, setProject, setTabIndex } = props;

    // 条件を追加
    const addCondition = () => {
        const newCondition: Condition = {
            id: crypto.randomUUID(),
            objectA: {
                type: null,
                ref: "",
            },
            objectB: {
                type: null,
                ref: "",
            },
            color: null,
            type: 0,
        };

        setProject({
            ...project,
            conditions: [
                ...project.conditions,
                newCondition,
            ],
        });
    };

    // 条件を削除
    const deleteCondition = (conditionId: string) => {
        setProject({
            ...project,
            conditions: project.conditions.filter(
                (condition) => condition.id !== conditionId
            ),
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                    条件設定
                </h2>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    全 {project.conditions.length} 件
                </span>
            </div>

            {/* 条件一覧 */}
            <div className="space-y-4">
                {project.conditions.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center">
                        <p className="text-sm text-gray-500">
                            条件は設定されていません。下のボタンから追加してください。
                        </p>
                    </div>
                ) : (
                    project.conditions.map((condition, index) => (
                        <div
                            key={condition.id}
                            className="rounded border bg-gray-100 p-2"
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-gray-800">
                                    条件 {index + 1}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        deleteCondition(
                                            condition.id
                                        )
                                    }
                                    className="text-white rounded text-xs font-medium transition bg-red-500 border"
                                    title="この条件を削除"
                                >
                                    削除
                                </button>
                            </div>

                            <SingleConditionEditor
                                conditionId={condition.id}
                                project={project}
                                setProject={setProject}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* 条件追加 */}
            <button
                type="button"
                onClick={addCondition}
                className="w-full rounded-xl border border-dashed border-blue-300 bg-blue-50/50 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100/50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
                ＋ 条件を追加
            </button>
            <button
                type="button"
                onClick={()=>autoAllocate(project, setProject, setTabIndex)}
                className="w-full rounded-xl border border-dashed border-blue-300 bg-blue-50/50 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-100/50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
                割り当てを実行
            </button>
        </div>
    );
}