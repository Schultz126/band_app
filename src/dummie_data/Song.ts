class Song {
  name: string;
  tune: string;
  lastPlayed: Date;
  status: string; // Se precisa tirar, ensaiar ou está boa para tocar
  hasAcousticGuitar: boolean;
  constructor(
    name: string,
    tune: string,
    lastPlayed: Date,
    status: string,
    hasAcousticGuitar: boolean,
  ) {
    this.name = name;
    this.tune = tune;
    this.lastPlayed = lastPlayed;
    this.status = status;
    this.hasAcousticGuitar = hasAcousticGuitar;
  }
}

export default Song;
