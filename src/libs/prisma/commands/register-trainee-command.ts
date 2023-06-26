import { Prisma } from "@prisma/client";

import prisma from "../client";

export type RegisterTraineeCommand = (props: {
  id: string;
  authUserId: string;
  name: string;
  image: string;
}) => Promise<void>;
export const registerTraineeCommand: RegisterTraineeCommand = async ({
  id,
  authUserId,
  name,
  image,
}) => {
  await prisma.$transaction(
    async (tx) => {
      const trainee = await tx.trainee.findUnique({
        where: {
          authUserId,
        },
      });

      if (trainee === null) {
        await tx.trainee.create({
          data: {
            id,
            name,
            image,
            authUserId,
          },
        });
      }
    },
    {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    }
  );
};
