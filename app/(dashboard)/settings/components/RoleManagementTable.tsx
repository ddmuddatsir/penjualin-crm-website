import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoleManagementTableProps } from "@/types";

export default function RoleManagementTable({
  users,
  editRole,
  setEditRole,
  roleMutation,
}: RoleManagementTableProps) {
  return (
    <table className="w-full text-sm mb-3">
      <thead>
        <tr>
          <th className="text-left py-2">Nama</th>
          <th className="text-left py-2">Email</th>
          <th className="text-left py-2">Role</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td className="py-2">{u.name}</td>
            <td className="py-2">{u.email}</td>
            <td className="py-2">
              {editRole && editRole.id === u.id ? (
                <Select
                  value={editRole.role}
                  onValueChange={(val) => setEditRole({ id: u.id, role: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="MANAGER">Manager</SelectItem>
                    <SelectItem value="SALES">Sales</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                u.role
              )}
            </td>
            <td className="py-2">
              {editRole && editRole.id === u.id ? (
                <Button
                  size="sm"
                  onClick={() => {
                    if (editRole) {
                      roleMutation.mutate(editRole);
                    }
                    setEditRole(null);
                  }}
                >
                  Simpan
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditRole({ id: u.id, role: u.role })}
                >
                  Edit
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
