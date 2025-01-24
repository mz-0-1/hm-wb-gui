export async function startProcess() {
  const response = await fetch('https://54.67.120.86.nip.io/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}