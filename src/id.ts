let id: number = 0;

// reset id for server-side-render use;
export function resetID() {
  id = 0;
}

export function getAndIncreaseID() {
  id += 1;
  return id;
}
