const BASE_URL = 'https://jsonplaceholder.typicode.com';

async function get(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`);
    return await res.json();
  } catch (err) {
    handleError(err);
  }
}

function handleError(err) {
  alert(`Sorry, something happened [err=${err}]`);
}


console.log(await get('users'))