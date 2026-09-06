"use client"

import { Project } from "@/types/main/project";
import SeatMapEditor from "@/components/work/seat_map_editor/SeatMapEditor";
import { useState, createContext, type Dispatch, type SetStateAction } from "react";
import TabMenu from "@/components/shared/TabMenu";
import ParticipantsEditor from "@/components/work/participants_editor/ParticipantsEditor";
import ConditionsEditor from "@/components/work/conditions_editor/ConditionsEditor";
import ProjectStorageManager from "@/components/work/project_storage_manager/ProjectStorageManager";

export const tabContext = createContext({
    tabIndex: 0,
    setTabIndex: (() => undefined) as Dispatch<SetStateAction<number>>,
    names: ["座席図", "参加者", "割り当てツール", "プロジェクト保存"],
});

export default function Work(){
    const initial_project : Project = {
        seats: [],
        participants: [],
        objects: [],
        conditions: []
    }
    const [project, setProject] = useState<Project>(initial_project);
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <div>
            <tabContext.Provider value={{
                tabIndex, 
                setTabIndex, 
                names: ["座席図", "参加者", "割り当てツール", "プロジェクト保存"]
            }}>
                <TabMenu />
                <div className="rounded-xl border border-t-0 border-gray-200 bg-white p-4 shadow-lg">
                    {(tabIndex==0) ? (
                        <div>
                            <h1>作業画面</h1>
                            <SeatMapEditor project={project} setProject={setProject}/>
                        </div>
                    ): null}
                    
                    {(tabIndex==1) ? (
                        <div>
                            <h1>参加者編集</h1>
                            <ParticipantsEditor project={project} setProject={setProject}/>
                        </div>
                    ): null}

                    {(tabIndex==2) ? (
                        <div>
                            <h1>割り当て自動実行</h1>
                            <ConditionsEditor project={project} setProject={setProject} setTabIndex={setTabIndex}/>
                        </div>
                    ): null}

                    {(tabIndex==3) ? (
                        <ProjectStorageManager project={project} setProject={setProject} />
                    ): null}
                </div>
            </tabContext.Provider>
        </div>
    )
}