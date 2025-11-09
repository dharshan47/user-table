"use client";

import React, { useState, useEffect } from "react";
import { useSession, updateUser } from "@/lib/auth-client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Dashboard = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    if (session?.user) setName(session.user.name || "");
  }, [session, isPending, router]);

  if (!session) return null;

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await updateUser({ name });
      toast.success("Name updated!");
      setEditing(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update name.");
    }
  };

  const handleCancel = () => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
    setEditing(false);
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center w-full p-4">
      <Card className="w-full max-w-md relative p-6">
        {/* Avatar */}
        <div className="flex justify-center -mt-16">
          <Avatar className="w-24 h-24 border-2 border-primary">
            <AvatarFallback>
              {name
                ? name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Header */}
        <CardHeader className="text-center mt-4">
          <CardTitle className="text-xl font-bold">Dashboard</CardTitle>
          <CardDescription>Welcome Back!</CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
              <Button onClick={handleSave} className="w-full mt-2">
                Save
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                className="w-full mt-2 bg-destructive/85"
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{session.user?.email}</p>
              </div>
              <Button onClick={() => setEditing(true)} className="w-full mt-2">
                Edit Name
              </Button>
              <Button
                onClick={handleBack}
                variant="destructive"
                className="w-full mt-2"
              >
                Back
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
