export type PostResponse = {
  id: string;
  title: string;
  description: string;
  img: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  user: {
    email: string;
    role: {
      roleType: string;
    };
  };
};
