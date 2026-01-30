export interface Post {
  id: string;
  caption: string;
  image: string;
  uid: string;
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  title: string;
  image: string;
}
