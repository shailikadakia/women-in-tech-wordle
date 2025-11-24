export interface WomanInTech {
  id: number;
  name: string;
  // add any other fields your UI expects (bio, links, etc.)
}

const URLBASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";


export async function getDaily(): Promise<{
  date: string;
  index: number;
  woman: WomanInTech;
  target: string;
  length: number;
}> {
  const url = `${URLBASE}/daily`;
  console.log('[API] GET', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET /daily HTTP ${res.status}`);
  const json = await res.json();
  console.log('[API] /daily ->', json);
  return json;
}

export async function getRandomName(): Promise<number> {
  const url = `${URLBASE}/women/get-random-id`;
  console.log('[API] GET', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET /women/get-random-id HTTP ${res.status}`);
  return res.json();
}

export async function getWITInfo(id: number): Promise<WomanInTech> {
  if (id === undefined || id === null || Number.isNaN(id)) {
    throw new Error('getWITInfo called with invalid id');
  }
  const url = `${URLBASE}/women/${id}`;
  console.log('[API] GET', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET /women/${id} HTTP ${res.status}`);
  return res.json();
}
