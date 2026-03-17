import type {
  ConfigurationDTO,
  CreateConfigurationPayload,
  UpdateConfigurationPayload,
} from "../schema/configuration.schema";

export default interface IConfigurationInterface {
  createConfiguration(
    data: CreateConfigurationPayload
  ): Promise<ConfigurationDTO>;
  updateConfiguration(
    data: UpdateConfigurationPayload,
    id: string
  ): Promise<ConfigurationDTO>;
  getConfigurationById(id: string): Promise<ConfigurationDTO | null>;
  getConfigurations(page: number, limit: number): Promise<ConfigurationDTO[]>;
  deleteConfigurationById(id: string): Promise<ConfigurationDTO>;
}
