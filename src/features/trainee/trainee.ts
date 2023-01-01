import { Brand } from "@/utils/brand";

export type Trainee = {
  id: TraineeId;
  name: string;
  image: string;
};
type TraineeId = Brand<string, "Trainee">;

type GetTrainee = (props: {
  id: string;
  name: string;
  image: string;
}) => Trainee;
export const getTrainee: GetTrainee = ({ id, name, image }) => ({
  id: id as TraineeId,
  name,
  image,
});
