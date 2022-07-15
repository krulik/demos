const API_URL = 'https://quote-garden.herokuapp.com/api/v3/quotes/';

generate();
document.querySelector('#generate').addEventListener('click', generate);

function generate() {
  renderQuote({
    quoteText: 'Loading...',
    quoteAuthor: '',
    quoteGenre: '',
  })
  getRandomQuote().then(q => renderQuote(q));
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