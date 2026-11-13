import { BookOpen, CircuitBoard, Code2 } from 'lucide-react'
import { relativeRoute } from '@/content-adapter'
export function currentSection(){
 const route=relativeRoute()
 if(route.startsWith('/build/software')||route.startsWith('/pages/'))return {id:'software',title:'Software projects',root:'/build/software',description:'Software projects and their documentation.',Icon:Code2}
 if(route.startsWith('/build'))return {id:'hardware',title:'Hardware builds',root:'/build/hardware',description:'Hardware projects, experiments, and build notes.',Icon:CircuitBoard}
 return {id:'learn',title:'Notes',root:'/notes',description:'Learning notes, subjects, and references.',Icon:BookOpen}
}
