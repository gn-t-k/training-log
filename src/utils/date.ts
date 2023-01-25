import { format as DateFormat } from "date-fns";
import { z } from "zod";

export const yearSchema = z.number().int().nonnegative();
export type Year = z.infer<typeof yearSchema>;

export const monthSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
  z.literal(9),
  z.literal(10),
  z.literal(11),
]);
export type Month = z.infer<typeof monthSchema>;

type IsValidDate = (dateStr: string, format?: string) => boolean;
export const isValidDate: IsValidDate = (dateStr, format = "yyyy-MM-dd") => {
  const d = new Date(dateStr);
  try {
    const formatDate = DateFormat(d, format);
    return dateStr === formatDate;
  } catch (error) {
    return false;
  }
};
