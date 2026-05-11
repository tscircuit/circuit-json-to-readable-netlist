export const getReadableComponentName = (component: {
  source_component_id: string
  name?: string | null
}): string => {
  const trimmedName = component.name?.trim() ?? ""
  return trimmedName || component.source_component_id
}
