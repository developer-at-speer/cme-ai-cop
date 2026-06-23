"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppData } from "@/context/AppDataContext";
import { getCompanyStats } from "@/lib/data/companies";
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
import type { CompanyStatus } from "@/lib/types";

export default function AdminCompaniesPage() {
  const { user } = useAuth();
  const { state, createCompanyRecord, updateCompanyRecord } = useAppData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    industry: "",
    province: "",
    status: "active" as CompanyStatus,
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", industry: "", province: "Ontario", status: "active" });
    setDialogOpen(true);
  };

  const openEdit = (id: string) => {
    const c = state.companies.find((x) => x.id === id);
    if (!c) return;
    setEditingId(id);
    setForm({
      name: c.name,
      industry: c.industry,
      province: c.province,
      status: c.status,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!user) return;
    if (editingId) {
      updateCompanyRecord(user, editingId, form);
    } else {
      createCompanyRecord(user, form);
    }
    setDialogOpen(false);
  };

  return (
    <AdminGuard>
      <AppHeader title="Company management" />
      <div className="flex-1 p-4 md:p-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Companies</CardTitle>
            <Button onClick={openCreate}>Create company</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Province</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Recipes submitted</TableHead>
                    <TableHead>Approved</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.companies.map((c) => {
                    const stats = getCompanyStats(state, c.id);
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.industry}</TableCell>
                        <TableCell>{c.province}</TableCell>
                        <TableCell>{stats.userCount}</TableCell>
                        <TableCell>{stats.recipesSubmitted}</TableCell>
                        <TableCell>{stats.recipesApproved}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEdit(c.id)}
                          >
                            Edit
                          </Button>
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
              {editingId ? "Edit company" : "Create company"}
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
              <Label>Industry</Label>
              <Input
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Province</Label>
              <Input
                value={form.province}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  v && setForm({ ...form, status: v as CompanyStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
