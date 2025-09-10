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
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 font-medium">Nama</th>
              <th className="text-left py-3 px-2 font-medium">Email</th>
              <th className="text-left py-3 px-2 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-gray-100">
                <td className="py-3 px-2">{u.name}</td>
                <td className="py-3 px-2 text-gray-600">{u.email}</td>
                <td className="py-3 px-2">
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
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{u.name}</h3>
                <p className="text-sm text-gray-500 truncate mt-1">{u.email}</p>
              </div>
              <div className="ml-3 flex-shrink-0">
                <Badge
                  variant={getRoleBadgeVariant(u.role)}
                  className="font-medium"
                >
                  {formatRoleDisplay(u.role)}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Tidak ada data pengguna.</p>
        </div>
      )}
    </div>
  );
}
