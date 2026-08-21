"use client"

import { Project } from "@/types/main/project";
import SeatMapEditor from "@/components/work/seat_map_editor/SeatMapEditor";
import { useState, createContext,  type Dispatch, type SetStateAction } from "react";
import TabMenu from "@/components/work/seat_map_editor/TabMenu";

export const tabContext = createContext({
    tabIndex: 0,
    setTabIndex: (() => undefined) as Dispatch<SetStateAction<number>>,
    names: ["座席マップ", "割り当て", "回答者"],
});

export default function Work(){
    const initial_project : Project = {
        seats: [],
        participants: [],
        objects: []
    }
    const [project, setProject] = useState<Project>(initial_project);
    const [tabIndex, setTabIndex] = useState(0);
    return (
        <div>
            <tabContext.Provider value={{tabIndex, setTabIndex, names: ["座席図","参加者", "割り当てツール"]}}>
                <TabMenu />
                <div className="rounded-xl border border-t-0 border-gray-200 bg-white p-4 shadow-lg">
                    {(tabIndex==0) ? (
                        <div>
                            <h1>作業画面</h1>
                            <SeatMapEditor project={project} setProject={setProject}/>
                        </div>
                    ): null}
                </div>
            </tabContext.Provider>
        </div>
    )

}