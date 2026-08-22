"use client";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useCommunityQuery,
  useUpdateCommunityMutation,
} from "../hooks/useCommunity";

import {
  ICommunityAccessType,
  ICommunityStatus,
  ICommunityType,
  ICommunityVisibility,
} from "../types";

import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CommunityEditPage() {
  const { id } = useParams();
  const router = useNavigate();

  const { data: community, isLoading } = useCommunityQuery(id as string);

  const updateCommunity = useUpdateCommunityMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    type: ICommunityType.Family,
    accessType: ICommunityAccessType.Free,
    visibility: ICommunityVisibility.Public,
    status: ICommunityStatus.Active,
  });

  useEffect(() => {
    if (!community) return;

    setForm({
      name: community.data?.name ?? '',
      description: community.data?.description ?? "",
      category: community.data?.category ?? "",
      type: community.data?.type ?? ICommunityType.Family,
      accessType: community.data?.accessType ?? ICommunityAccessType.Free,
      visibility: community.data?.visibility ?? ICommunityVisibility.Public,
      status: community.data?.status ?? ICommunityStatus.Active,
    });
  }, [community]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!community) {
    return <div>Community not found.</div>;
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    updateCommunity.mutate(
      {
        id: community.data?.id ?? '',
        data: form,
      },
      {
        onSuccess() {
          router(`/workspaces/${community.data?.id}`);
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Community</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={submit} className="space-y-6">
            <div>
              <Label>Name</Label>

              <Input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Description</Label>

              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Category</Label>

              <Input
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label>Type</Label>

                <select
                  className="h-10 w-full rounded-md border px-3"
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value as ICommunityType,
                    })
                  }
                >
                  {Object.values(ICommunityType).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Access</Label>

                <select
                  className="h-10 w-full rounded-md border px-3"
                  value={form.accessType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      accessType: e.target.value as ICommunityAccessType,
                    })
                  }
                >
                  {Object.values(ICommunityAccessType).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Visibility</Label>

                <select
                  className="h-10 w-full rounded-md border px-3"
                  value={form.visibility}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      visibility: e.target.value as ICommunityVisibility,
                    })
                  }
                >
                  {Object.values(ICommunityVisibility).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Status</Label>

                <select
                  className="h-10 w-full rounded-md border px-3"
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as ICommunityStatus,
                    })
                  }
                >
                  {Object.values(ICommunityStatus).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => router(-1)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={updateCommunity.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
