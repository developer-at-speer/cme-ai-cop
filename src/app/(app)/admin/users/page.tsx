"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";
import { AdminGuard } from "@/components/auth/AdminGuard";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UserRole, UserStatus } from "@/lib/types";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { state, createUserAccount, updateUserAccount, toggleUserActive } =
    useAppData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "participant" as UserRole,
    company_id: "",
    workbench_enabled: true,
    status: "active" as UserStatus,
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({
      name: "",
      email: "",
      password: "demo1234",
      role: "participant",
      company_id: state.companies[0]?.id ?? "",
      workbench_enabled: true,
      status: "active",
    });
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    const u = state.users.find((x) => x.id === id);
    if (!u) return;
    setEditingId(id);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      company_id: u.company_id ?? "none",
      workbench_enabled: u.workbench_enabled,
      status: u.status,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!user) return;
    const companyId = form.company_id === "none" ? null : form.company_id || null;
    if (editingId) {
      updateUserAccount(user, editingId, {
        ...form,
        company_id: companyId,
        password: form.password || undefined,
      });
    } else {
      createUserAccount(user, {
        ...form,
        company_id: companyId,
      });
    }
    setDialogOpen(false);
  };

  return (
    <AdminGuard>
      <AppHeader title="User management" />
      <div className="flex-1 p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Users</CardTitle>
            <Button onClick={openCreate}>Create user</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Workbench</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.users.map((u) => {
                    const company = state.companies.find(
                      (c) => c.id === u.company_id,
                    );
                    return (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell className="capitalize">{u.role}</TableCell>
                        <TableCell>{company?.name ?? "—"}</TableCell>
                        <TableCell>
                          {u.workbench_enabled ? (
                            <Badge variant="secondary">Enabled</Badge>
                          ) : (
                            <Badge variant="outline">Disabled</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              u.status === "active" ? "secondary" : "destructive"
                            }
                            className="capitalize"
                          >
                            {u.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEdit(u.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => user && toggleUserActive(user, u.id)}
                              disabled={u.id === user?.id}
                            >
                              {u.status === "active" ? "Disable" : "Enable"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit user" : "Create user"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Password {editingId && "(leave blank to keep)"}</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) =>
                  v && setForm({ ...form, role: v as UserRole })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="participant">Participant</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Select
                value={form.company_id}
                onValueChange={(v) =>
                  setForm({ ...form, company_id: v ?? "none" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (CME)</SelectItem>
                  {state.companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label>Workbench access</Label>
              <Switch
                checked={form.workbench_enabled}
                onCheckedChange={(v) =>
                  setForm({ ...form, workbench_enabled: v })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminGuard>
  );
}
