import { UserRole } from "../types";

interface PermissionConfig {
  view: UserRole[];
  create: UserRole[];
  edit: UserRole[];
  delete: UserRole[];
}

const permissions: Record<string, PermissionConfig> = {
  ships: {
    view: ['Admin', 'Inspector', 'Engineer'],
    create: ['Admin'],
    edit: ['Admin'],
    delete: ['Admin']
  },
  components: {
    view: ['Admin', 'Inspector', 'Engineer'],
    create: ['Admin', 'Inspector'],
    edit: ['Admin', 'Inspector'],
    delete: ['Admin']
  },
  jobs: {
    view: ['Admin', 'Inspector', 'Engineer'],
    create: ['Admin', 'Inspector'],
    edit: ['Admin', 'Inspector', 'Engineer'],
    delete: ['Admin']
  },
  users: {
    view: ['Admin'],
    create: ['Admin'],
    edit: ['Admin'],
    delete: ['Admin']
  },
  notifications: {
    view: ['Admin', 'Inspector', 'Engineer'],
    create: ['Admin'],
    edit: ['Admin', 'Inspector', 'Engineer'],
    delete: ['Admin', 'Inspector', 'Engineer']
  }
};

export const checkPermission = (
  resource: string, 
  action: 'view' | 'create' | 'edit' | 'delete', 
  userRole?: UserRole
): boolean => {
  if (!userRole) return false;
  
  const resourcePermissions = permissions[resource];
  if (!resourcePermissions) return false;
  
  return resourcePermissions[action].includes(userRole);
};

export const getPermissions = (userRole?: UserRole): Record<string, Record<string, boolean>> => {
  if (!userRole) {
    return Object.keys(permissions).reduce((acc, resource) => {
      acc[resource] = {
        view: false,
        create: false,
        edit: false,
        delete: false
      };
      return acc;
    }, {} as Record<string, Record<string, boolean>>);
  }

  return Object.keys(permissions).reduce((acc, resource) => {
    acc[resource] = {
      view: checkPermission(resource, 'view', userRole),
      create: checkPermission(resource, 'create', userRole),
      edit: checkPermission(resource, 'edit', userRole),
      delete: checkPermission(resource, 'delete', userRole)
    };
    return acc;
  }, {} as Record<string, Record<string, boolean>>);
};