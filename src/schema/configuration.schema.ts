import { z } from "zod";

export const configurationDTO = z.object({
  configurationId: z.string(),
  producitiveTime: z.number(),
  pomodoro: z.boolean(),
  breakTimeCounted: z.boolean(),
  eventTime: z.boolean(),
  feelings: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createConfigurationPayload = configurationDTO.omit({
  configurationId: true,
  createdAt: true,
  updatedAt: true,
});

export const updateConfigurationPayload = configurationDTO
  .pick({
    producitiveTime: true,
    pomodoro: true,
    breakTimeCounted: true,
    eventTime: true,
    feelings: true,
  })
  .partial();

export type ConfigurationDTO = z.infer<typeof configurationDTO>;
export type CreateConfigurationPayload = z.infer<
  typeof createConfigurationPayload
>;
export type UpdateConfigurationPayload = z.infer<
  typeof updateConfigurationPayload
>;
