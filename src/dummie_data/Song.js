class Song {
  constructor(
    name,
    artist,
    tune,
    lastPlayed,
    status,
    hasAcousticGuitar,
    bpm,
    star,
    pedal,
    obs,
    howLong,
    howManyTimesHasBeingPlayed,
  ) {
    this.name = name;
    this.artist = artist;
    this.tune = tune;
    this.lastPlayed = lastPlayed;
    this.status = status;
    this.hasAcousticGuitar = hasAcousticGuitar;
    this.bpm = bpm;
    this.star = star;
    this.pedal = pedal;
    this.obs = obs;
    this.howLong = howLong;
    this.howManyTimesHasBeingPlayed = howManyTimesHasBeingPlayed;
  }
}

export default Song;
