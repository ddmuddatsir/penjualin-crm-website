import { Badge } from "@/components/ui/badge";
import { USER_ROLE } from "@/constants/user";

// Helper function to format role display
const formatRoleDisplay = (role: string): string => {
  switch (role?.toUpperCase()) {
    case USER_ROLE.ADMIN:
      return "ADMIN";
    case USER_ROLE.MANAGER:
      return "MANAGER";
    case USER_ROLE.SALES_REP:
      return "SALES";
    case USER_ROLE.SUPPORT:
      return "SUPPORT";
    case USER_ROLE.VIEWER:
      return "VIEWER";
    default:
      return role?.toUpperCase() || "SALES";
  }
};

// Helper function to get role badge variant
const getRoleBadgeVariant = (
  role: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (role?.toUpperCase()) {
    case USER_ROLE.ADMIN:
      return "destructive";
    case USER_ROLE.MANAGER:
      return "default";
    case USER_ROLE.SALES_REP:
      return "secondary";
    default:
      return "outline";
  }
};

interface SimplifiedRoleManagementTableProps {
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>;
}

export default function RoleManagementTable({
  users,
}: SimplifiedRoleManagementTableProps) {
  return (
    <table className="w-full text-sm mb-3">
      <thead>
        <tr>
          <th className="text-left py-2">Nama</th>
          <th className="text-left py-2">Email</th>
          <th className="text-left py-2">Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td className="py-2">{u.name}</td>
            <td className="py-2">{u.email}</td>
            <td className="py-2">
              <Badge
                variant={getRoleBadgeVariant(u.role)}
                className="font-medium"
              >
                {formatRoleDisplay(u.role)}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
