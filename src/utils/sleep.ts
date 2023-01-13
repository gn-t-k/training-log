type Sleep = (ms: number) => Promise<void>;
export const sleep: Sleep = async (ms) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};
