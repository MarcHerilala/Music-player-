type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};

type Track = {
  id: string;
  title: string;
  uri: string;
};
