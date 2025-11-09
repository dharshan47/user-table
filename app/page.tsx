"use client";

import { columns, UserInfo } from "@/components/Columns";
import { DataTable } from "@/components/DataTable";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "@/lib/auth-client";
import {
  createUsers,
  deleteUsers,
  getUsers,
  updateUsers,
} from "@/prisma/actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserButton from "../components/UserButton";

export default function Home() {
  const [user, setUser] = useState<UserInfo[]>([]);
  const [userInfo, setUserInfo] = useState({
    id: "",
    name: "",
    age: "",
    email: "",
    contact: "",
  });
  const [buttonState, setButtonState] = useState<"add" | "edit">("add");
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    (async () => {
      const data = await getUsers();
      setUser(data);
    })();
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((currInfo) => ({
      ...currInfo,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (!/^\d{10}$/.test(userInfo.contact)) {
      toast.error("Contact number must be exactly 10 digits!");
      return;
    }
    const result = await createUsers(userInfo);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    toast.success("User added successfully");
    setUser(await getUsers());
    setUserInfo({
      id: "",
      name: "",
      age: "",
      email: "",
      contact: "",
    });
  };

  const startEditing = (user: UserInfo) => {
    setUserInfo(user);
    setButtonState("edit");
  };

  const cancelEditing = () => {
    setUserInfo({
      id: "",
      name: "",
      age: "",
      email: "",
      contact: "",
    });
    setButtonState("add");
  };

  const handleUpdate = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    await updateUsers(userInfo);
    setUser(await getUsers());
    cancelEditing();
  };

  const handleDelete = async (id: string) => {
    if (!session) {
      router.push("/login");
      return;
    }
    await deleteUsers(id);
    setUser(await getUsers());
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center p-4 mx-auto">
      <div>
        <div className="flex justify-between items-center ">
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight">
            {buttonState === "add" ? "Add User" : "Edit User"}
          </h2>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={userInfo.name}
            onChange={handleChange}
            className="rounded-md shadow-sm p-3"
          />
          <Input
            type="number"
            name="age"
            placeholder="Enter your age"
            value={userInfo.age}
            onChange={handleChange}
            className="rounded-md shadow-sm p-3"
          />
          <Input
            type="text"
            name="email"
            placeholder="Enter your email"
            value={userInfo.email}
            onChange={handleChange}
            className="rounded-md shadow-sm p-3"
          />
          <Input
            type="number"
            name="contact"
            placeholder="Enter your contact"
            value={userInfo.contact}
            onChange={handleChange}
            pattern="\d{10}"
            maxLength={10}
            className="rounded-md shadow-sm p-3"
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {buttonState === "add" ? (
            <Button onClick={handleAdd} className="rounded-md shadow-sm ">
              Add
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                className="rounded-md shadow-sm"
                onClick={handleUpdate}
              >
                Upadte
              </Button>
              <Button
                variant="destructive"
                className="rounded-md shadow-sm"
                onClick={cancelEditing}
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="mt-10">
        <DataTable
          columns={columns(startEditing, handleDelete)}
          data={session ? user : []}
        />
      </div>
    </div>
  );
}
