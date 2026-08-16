"use client"

import { Project } from "@/types/main/project";
import SeatMapEditor from "@/components/work/seat_map_editor/SeatMapEditor";
import { useState } from "react";

export default function Work(){
    const initial_project : Project = {
        seats: [],
        participants: [],
        texts: []
    }
    const [project, setProject] = useState<Project>(initial_project);
    
    return (
        <div>
            <h1>作業画面</h1>
            <SeatMapEditor project={project} setProject={setProject}/>
        </div>
    )

}