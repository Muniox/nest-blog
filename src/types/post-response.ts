export type PostResponse = {
  id: string;
  title: string;
  description: string;
  img: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  user: {
    id: string;
    email: string;
    role: {
      roleType: string;
    };
  };
};
