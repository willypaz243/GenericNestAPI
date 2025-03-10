import { SetMetadata } from '@nestjs/common';
import { ResourceNames } from '../models/resource.model';

export const RESOURCE_KEY = 'resource_key';

export const SetResourceName = (ResourceNames: ResourceNames) =>
  SetMetadata(RESOURCE_KEY, ResourceNames);
