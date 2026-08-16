import { createContext } from 'react';
import { Project } from '@/types/main/project';


export const ProjectContext = createContext<
  ((objects: Project) => void) | undefined
>(undefined);
