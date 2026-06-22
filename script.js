function initPlayer(player) {
    const audio = player.querySelector(".audio-player");
    const playButton = player.querySelector(".transport");
    const sleeveArt = player.querySelector(".sleeve_art");
    const eq = player.querySelector(".eq");
    const progressBar = player.querySelector(".progress");
    const progressFill = player.querySelector(".progress_fill");
    const curTime = player.querySelector(".cur-time");
    const totalTime = player.querySelector(".total-time");
    const nowPlayingTrack = player.querySelector(".now-playing_track");
    const tracks = player.querySelectorAll(".track");

    let isDragging = false;

function formatTime(s) {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = String(Math.floor(s % 60)).padStart(2, "0");
    return `${m}:${sec}`;
}

function loadTrack(track) {
    tracks.forEach((t) => t.classList.remove("is-active"));
    track.classList.add("is-active");

    audio.src = encodeURI(track.dataset.src);

    const name = track.querySelector(".track_name").textContent;
    const artist = track.querySelector(".track_artist").textContent;
    nowPlayingTrack.textContent = `${name} - ${artist}`;

    progressFill.style.width = "0%";
    curTime.textContent = "0:00";
}

  function nextTrack() {
    const trackArray = Array.from(tracks);
    const currentIndex = trackArray.findIndex((t) => t.classList.contains("is-active"));
    const nextIndex = (currentIndex + 1) % trackArray.length;
    loadTrack(trackArray[nextIndex]);
    audio.play();
  }

  function seek(e) {
    if (!audio.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    let percentage = clickX / rect.width;
    percentage = Math.max(0, Math.min(1, percentage));
    audio.currentTime = percentage * audio.duration;
  }

  // The audio element itself drives the UI now, instead of a manual timer
  audio.addEventListener("play", () => {
    playButton.classList.add("is-playing");
    sleeveArt.classList.add("is-spinning");
    eq.classList.add("is-animating");
  });

  audio.addEventListener("pause", () => {
    playButton.classList.remove("is-playing");
    sleeveArt.classList.remove("is-spinning");
    eq.classList.remove("is-animating");
  });

  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      progressFill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
      curTime.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener("loadedmetadata", () => {
    totalTime.textContent = formatTime(audio.duration);
  });

  audio.addEventListener("ended", nextTrack);

  playButton.addEventListener("click", () => {
    if (audio.paused) audio.play();
    else audio.pause();
  });

  tracks.forEach((track) => {
    track.addEventListener("click", () => {
      loadTrack(track);
      audio.play();
    });
  });

  progressBar.addEventListener("mousedown", (e) => {
    isDragging = true;
    progressFill.style.transition = "none";
    seek(e);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) seek(e);
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      progressFill.style.transition = "width 0.9s linear";
    }
  });

  const initialTrack = player.querySelector(".track.is-active") || tracks[0];
  if (initialTrack) loadTrack(initialTrack);
}

document.querySelectorAll(".player").forEach(initPlayer);