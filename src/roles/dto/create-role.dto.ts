class CreateResourceDto {
  id?: number;
  name: string;
  description: string;
  readAccess?: boolean = false;
  writeAccess?: boolean = false;
  deleteAccess?: boolean = false;
}

export class CreateRoleDto {
  name: string;
  description: string;
  resources: CreateResourceDto[];
}
