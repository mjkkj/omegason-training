// Hệ thống phân quyền 3 cấp: Owner > Supervisor > Employee.
// "Supervisor" dùng giá trị DB cũ 'manager' để không phải migrate dữ liệu hiện có.
export const ROLES = {
  OWNER: 'owner',
  SUPERVISOR: 'manager',
  EMPLOYEE: 'employee',
}

export const ROLE_LABEL = {
  [ROLES.OWNER]: 'Owner',
  [ROLES.SUPERVISOR]: 'Supervisor',
  [ROLES.EMPLOYEE]: 'Nhân viên',
}

export const ROLE_RANK = {
  [ROLES.OWNER]: 3,
  [ROLES.SUPERVISOR]: 2,
  [ROLES.EMPLOYEE]: 1,
}

export function isOwner(user) { return user?.role === ROLES.OWNER }
export function isSupervisor(user) { return user?.role === ROLES.SUPERVISOR }
export function isStaff(user) { return user?.role === ROLES.OWNER || user?.role === ROLES.SUPERVISOR }

export function homePathFor(role) {
  return role === ROLES.EMPLOYEE ? '/emp/roadmap' : '/mgr/stats'
}
