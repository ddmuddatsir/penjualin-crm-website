import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";
import { usersService } from "@/services/firebase";
import type { ClientUser } from "@/types/firebase";
import type { User } from "@/types/models";
import type { CreateUserData, UpdateUserData } from "@/types/api";

export interface UseUsersOptions {
  enabled?: boolean;
}

export interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  createUser: (data: CreateUserData) => Promise<void>;
  updateUser: (id: string, data: UpdateUserData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  refetchUsers: () => void;
}

// Simple adapter to map Firebase role to app role
function adaptFirebaseUsersToAppUsers(firebaseUsers: ClientUser[]): User[] {
  return firebaseUsers.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.toLowerCase() as UserRole, // Convert ADMIN -> admin, etc.
    createdAt: user.createdAt, // Keep as Date object
    updatedAt: user.updatedAt, // Keep as Date object
  }));
}

// Adapter to map CreateUserData to format expected by Firebase service
function adaptCreateUserDataToFirebase(
  data: CreateUserData
): Omit<ClientUser, "id" | "createdAt" | "updatedAt"> {
  return {
    name: data.name,
    email: data.email,
    role: data.role,
    avatar: data.avatar,
    isActive: true, // Default to active
    lastLoginAt: undefined,
    settings: {
      timezone: "UTC",
      notifications: true,
      emailUpdates: true,
    },
  };
}

// Adapter to map UpdateUserData to format expected by Firebase service
function adaptUpdateUserDataToFirebase(
  data: UpdateUserData
): Partial<Omit<ClientUser, "id" | "createdAt" | "updatedAt">> {
  const adapted: Partial<Omit<ClientUser, "id" | "createdAt" | "updatedAt">> =
    {};

  if (data.name !== undefined) adapted.name = data.name;
  if (data.email !== undefined) adapted.email = data.email;
  if (data.role !== undefined) adapted.role = data.role;
  if (data.avatar !== undefined) adapted.avatar = data.avatar;
  if (data.status !== undefined) adapted.isActive = data.status === "active";

  return adapted;
}

export function useUsers(options: UseUsersOptions = {}): UseUsersReturn {
  const { enabled = true } = options;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: usersData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersService.getAll(),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  const users = adaptFirebaseUsersToAppUsers(usersData);

  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserData) =>
      usersService.create(adaptCreateUserDataToFirebase(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create user.",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      usersService.update(id, adaptUpdateUserDataToFirebase(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user.",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: usersService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    },
  });

  const createUser = useCallback(
    async (data: CreateUserData) => {
      await createUserMutation.mutateAsync(data);
    },
    [createUserMutation]
  );

  const updateUser = useCallback(
    async (id: string, data: UpdateUserData) => {
      await updateUserMutation.mutateAsync({ id, data });
    },
    [updateUserMutation]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      await deleteUserMutation.mutateAsync(id);
    },
    [deleteUserMutation]
  );

  const refetchUsers = useCallback(() => {
    refetch();
  }, [refetch]);

  return {
    users,
    isLoading,
    isError,
    error: error as Error | null,
    createUser,
    updateUser,
    deleteUser,
    refetchUsers,
  };
}
