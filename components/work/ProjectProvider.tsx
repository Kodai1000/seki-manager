import { ProjectContext } from "@/contexts/projectContext";
import { Project } from "@/types/main/project";

type Props = {
    setProject: (objects: Project) => void,
    children: React.ReactNode
}

export const ProjectProvider = ({setProject, children}: Props) => {
    return <ProjectContext.Provider value={setProject}>{children}</ProjectContext.Provider>
}