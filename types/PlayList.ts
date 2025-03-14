type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};

type Track = {
  id: string;
  filename: string;
  uri: string;
  duration:number;
};
