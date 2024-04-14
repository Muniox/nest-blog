export type PostResponse = {
  id: string;
  title: string;
  description: string;
  img: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  user: {
    username: string;
    role: {
      roleType: string;
    };
  };
};
