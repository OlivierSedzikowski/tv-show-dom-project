//You can edit ALL of the code here
//const allEpisodes = getAllEpisodes();
let allShows, allEpisodes;
const episodesElem = document.getElementById("episodes");
let url = "https://api.tvmaze.com/shows";

function setup() {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data[0].season && data[0].number) {
        allEpisodes = data;
        makePageForEpisodes(allEpisodes);
        selectEpisodes(allEpisodes);
      } else {
        allShows = data;
        makePageForEpisodes(data);
        selectShow(allShows);
      }
    });

  createFooter();

  const inputElm = document.getElementById("search-input");
  inputElm.addEventListener("input", makePageForMatchingEpisodes);
}

function makePageForEpisodes(episodeList) {
  //remove all episodes from episodes div

  //Create episodes
  episodeList.forEach((episode) => {
    const episodeDivElem = document.createElement("div");
    episodeDivElem.className = "episode";
    const h2Elem = document.createElement("h2");
    h2Elem.className = "episode-title";
    const imgElem = document.createElement("img");
    imgElem.className = "episode-img";
    const summaryDivElem = document.createElement("div");
    summaryDivElem.className = "episode-summary";

    if (episode.season && episode.number) {
      h2Elem.innerHTML =
        episode.name +
        "-S" +
        episode.season.toString().padStart(2, "0") +
        "E" +
        episode.number.toString().padStart(2, "0");
    } else {
      h2Elem.innerHTML = episode.name;
    }

    imgElem.src = episode.image.medium;
    summaryDivElem.innerHTML = episode.summary;

    episodeDivElem.append(h2Elem, imgElem, summaryDivElem);
    episodesElem.append(episodeDivElem);
  });

  const displayingEpisodesElem = document.getElementById("search-results");
  displayingEpisodesElem.innerText = `Displaying ${episodeList.length}/73 episodes`;
}

function createFooter() {
  const footerElm = document.createElement("footer");
  footerElm.innerHTML = `The data originally comes from <a href="https://www.tvmaze.com/">TVMaze.com</a>`;
  const htmlElm = document.querySelector("html");
  htmlElm.append(footerElm);
}

function makePageForMatchingEpisodes() {
  const inputElm = document.getElementById("search-input");
  const input = inputElm.value.toLowerCase();

  const matchingEpisodes = allEpisodes.filter((episode) => {
    if (
      episode.name.toLowerCase().includes(input) ||
      episode.summary.toLowerCase().includes(input)
    ) {
      return episode;
    }
  });
  episodesElem.textContent = "";
  makePageForEpisodes(matchingEpisodes);
}

const selectedEpisodes = document.getElementById("selectEpisodes");

function selectEpisodes(allEpisodes) {
  //const clickedEpisode = allEpisodes.filter((episode) => {
  allEpisodes.forEach((episode) => {
    //optionsElem.innerHTML(episode.name);
    const selectOption = document.createElement("option");
    selectOption.innerHTML =
      "S" +
      episode.season.toString().padStart(2, "0") +
      "E" +
      episode.number.toString().padStart(2, "0") +
      " - " +
      episode.name;
    selectedEpisodes.appendChild(selectOption);
  });

  //}
  //)
}

const selectedShow = document.getElementById("selectShows");

function selectShow(allShows) {
  //const clickedEpisode = allEpisodes.filter((episode) => {
  allShows.forEach((show) => {
    //optionsElem.innerHTML(episode.name);
    const selectOption = document.createElement("option");
    selectOption.innerHTML = show.name;
    selectedShow.appendChild(selectOption);
  });

  //}
  //)
}

selectedShow.addEventListener("change", (e) => {
  let selectedValue = e.target.value;
  let selected = allShows.filter((show) => show.name === selectedValue);
  let showId = selected[0].id;
  url = `https://api.tvmaze.com/shows/${showId}/episodes`;
  episodesElem.innerHTML = "";
  setup();
  document.querySelector(".select-episode").style.display = "block";
  document.querySelector(".select-show").style.display = "none";
});

selectedEpisodes.addEventListener("change", (e) => {
  console.log(e.target.value);
  let selectedValue = e.target.value;
  selectedValue = selectedValue.split(" ").slice(2).join(" ");
  console.log(selectedValue);
  let selected = allEpisodes.filter(
    (episode) => episode.name === selectedValue
  );
  console.log(selected);
  if (selected.length === 1) {
    episodesElem.textContent = "";
  } else {
    episodesElem.textContent = "";
    makePageForEpisodes(allEpisodes);
  }
  makePageForEpisodes(selected);
});

const resetButton = document.getElementById("resetButton");
resetButton.addEventListener("click", (e) => {
  episodesElem.textContent = "";
  makePageForEpisodes(allEpisodes);
});

window.onload = setup;
