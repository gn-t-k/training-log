import { Prisma } from "@prisma/client";
import { ulid } from "ulid";

import prisma from "../client";

export type RegisterTraineeCommand = (props: {
  authUserId: string;
  name: string;
  image: string;
}) => Promise<void>;
export const registerTraineeCommand: RegisterTraineeCommand = async ({
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
            id: ulid(),
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
