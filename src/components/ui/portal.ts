export function getPortalRoot(): HTMLElement {
  const el = document.getElementById('portal-root')
  return el ?? document.body
}
