/*jshint esversion: 6 */
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

//Form event listener
searchForm.addEventListener('submit', e => {
  //Get searched term
  const searchTerm = searchInput.value;

  //Get sortby
  const sortBy = document.querySelector('input[name="sortby"]:checked').value;

  //Get Limit
  const searchLimit = document.getElementById('limit').value;

  //Check if input is empty
  if(searchTerm === '') {
    showMessage('Please add a search term', 'alert-danger');
  }

  //Clear search searchInput
  searchInput.value = '';

  //Search Reddit
  search(searchTerm, searchLimit, sortBy)
    .then(results => {
      let output = '<div class="card-columns">';
      //loop through posts
      results.forEach(post => {
        //Check for image
        let image = post.preview ? post.preview.images[0].source.url : 'img/Reddit.png';

        let redditImg;

        if (image === 'img/Reddit.png') {
          redditImg = 'reddit-img';
        } else {

        }


        output += `
        <div class="card">
          <div class="img-container">
            <a href="${post.url}" target="_blank">
              <img class="card-img-top ${redditImg}" src="${image}" alt="Card image cap">
            </a>
          </div>
          <div class="card-body">
            <h5 class="card-title title">${post.title}</h5>
            <p class="card-text self-text">${truncateText(post.selftext,100)}</p>
            <hr>
            <a href="${post.url}" target="_blank" class="read-more">See More </a><span class="read-more-arrow"><i class="fas fa-caret-right"></i></span>
            <hr>
            <span class="badge subreddit">subreddit: <span>${post.subreddit}</span></span>
            <span class="badge score">score: <span>${post.score}</span></span>
            <span class="badge comments">comments: <span>${post.num_comments}</span></span>
          </div>
        </div>
        `;
      });
      output += '</div>';
      document.getElementById('results').innerHTML = output;
    });

  e.preventDefault();
});



function search(searchTerm, searchLimit, sortBy) {
  return fetch(`https://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`)
  .then(res => res.json())
  .then(data => data.data.children.map(data => data.data))
  .catch(err => console.log(err));
}

//Empty input function
function showMessage(message, className) {
  //Create div
  const div = document.createElement('div');
  //Add class to div
  div.className = `alert ${className}`;
  //Add text
  div.appendChild(document.createTextNode(message));
  //Get Parent of error message
  const searchContainer = document.getElementById('search-container');
  //Get sibling of error message
  const search = document.getElementById('search');

  //Insert message
  searchContainer.insertBefore(div, search);

  //Timeout error message
  setTimeout(() => div.remove(), 3000);
}

//Tuncate text
function truncateText(text, limit) {
  const shortened = text.indexOf(' ', limit);
  if(shortened === -1) return text;
  return text.substring(0, shortened) + ' ...';

}
