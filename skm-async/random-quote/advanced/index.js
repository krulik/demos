const API_URL = 'https://quote-garden.herokuapp.com/api/v3/quotes/';

const state = {
  next: null
}

generate();
document.querySelector('#generate').addEventListener('click', generate);

function generate() {
  if (state.next) {
    displayAndPreFetch(state.next);
  } else {
    displayAndPreFetch({
      quoteText: 'Loading...',
      quoteAuthor: '',
      quoteGenre: ''
    }).then(generate);
  }
}

function displayAndPreFetch(q) {
  renderQuote(q);
  return getRandomQuote().then(q => {
    state.next = q;
  });
}

function renderQuote(q) {
  document.querySelector('#quote').textContent = q.quoteText;
  document.querySelector('#cite').replaceChildren(getGoogleLink(q));
  document.querySelector('#genre').textContent = q.quoteGenre;
}

function getGoogleLink(q) {
  const link = document.createElement('a');
  link.href = `https://www.google.com/search?q=${q.quoteAuthor}`;
  link.target = '_blank';
  link.textContent = q.quoteAuthor;
  return link;
}

function getRandomQuote() {
  return getJSON(`${API_URL}/random`).then(res => res.data[0]);
}

function getJSON(url) {
  return fetch(url).then(res => res.json());
}