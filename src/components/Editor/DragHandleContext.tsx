import { createContext, useContext } from 'react'

export type DragHandleValue = {
  attributes: Record<string, any>
  listeners: Record<string, Function> | undefined
  setActivatorNodeRef: (node: HTMLElement | null) => void
} | null

export const DragHandleContext = createContext<DragHandleValue>(null)

export function useDragHandle() {
  return useContext(DragHandleContext)
}
