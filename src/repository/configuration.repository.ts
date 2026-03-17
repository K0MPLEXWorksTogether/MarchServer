import Configuration from "../models/Configuration";
import AppLogger from "../utils/logger";
import IConfigurationInterface from "../interfaces/configuration.interface";
import type {
  ConfigurationDTO,
  CreateConfigurationPayload,
  UpdateConfigurationPayload,
} from "../schema/configuration.schema";
import { configurationDTO } from "../schema/configuration.schema";
import { InvalidError } from "../types/errors";
import { handleError } from "../utils/common";

export default class ConfigurationRepository implements IConfigurationInterface {
  private logger = AppLogger.getLogger();

  private toDTO(configuration: any): ConfigurationDTO {
    const { _id, __v, ...rest } = configuration.toObject();
    return configurationDTO.parse({
      configurationId: _id.toString(),
      ...rest,
    });
  }

  public async createConfiguration(
    data: CreateConfigurationPayload
  ): Promise<ConfigurationDTO> {
    try {
      const existingConfiguration = await Configuration.exists(data);
      if (existingConfiguration) {
        throw new InvalidError("Same configuration already exists");
      }

      const configuration = await Configuration.create(data);
      this.logger.info(
        `[repo] createConfiguration succedded. configurationId: ${configuration._id}`
      );
      return this.toDTO(configuration);
    } catch (err) {
      handleError(err, "createConfiguration", this.logger);
    }
  }

  public async updateConfiguration(
    data: UpdateConfigurationPayload,
    id: string
  ): Promise<ConfigurationDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const isConfigurationPresent = await Configuration.exists({ _id: id });
      if (!isConfigurationPresent) {
        throw new InvalidError(`Configuration with id: ${id} does not exist`);
      }
      const updatedConfiguration = await Configuration.findByIdAndUpdate(
        id,
        data,
        { new: true }
      );
      this.logger.info(
        `[repo] updateConfiguration succedded. configurationId: ${id}`
      );
      return this.toDTO(updatedConfiguration);
    } catch (err) {
      handleError(err, "updateConfiguration", this.logger);
    }
  }

  public async getConfigurationById(
    id: string
  ): Promise<ConfigurationDTO | null> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const configuration = await Configuration.findById(id);
      if (!configuration) {
        return null;
      }
      this.logger.info(
        `[repo] getConfigurationById succedded. configurationId: ${id}`
      );
      return this.toDTO(configuration);
    } catch (err) {
      handleError(err, "getConfigurationById", this.logger);
    }
  }

  public async getConfigurations(
    page: number,
    limit: number
  ): Promise<ConfigurationDTO[]> {
    try {
      if (!page || !limit) {
        throw new InvalidError(`${page} or ${limit} is falsy`);
      }
      const offset = (page - 1) * limit;
      const configurations = await Configuration.find().skip(offset).limit(limit);
      this.logger.info("[repo] getConfigurations succedded");
      return configurations.map((configuration) => this.toDTO(configuration));
    } catch (err) {
      handleError(err, "getConfigurations", this.logger);
    }
  }

  public async deleteConfigurationById(id: string): Promise<ConfigurationDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const deletedConfiguration = await Configuration.findByIdAndDelete(id);
      if (!deletedConfiguration) {
        throw new InvalidError(`Configuration with id: ${id} does not exist`);
      }
      this.logger.info(
        `[repo] deleteConfigurationById succedded. configurationId: ${id}`
      );
      return this.toDTO(deletedConfiguration);
    } catch (err) {
      handleError(err, "deleteConfigurationById", this.logger);
    }
  }
}
