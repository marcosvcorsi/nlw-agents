import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const createRoomSchema = z.object({
  name: z.string().min(3, "Room name must be at least 3 characters long"),
  description: z.string().optional(),
});

type CreateRoomFormData = z.infer<typeof createRoomSchema>;

type CreateRoomApiResponse = {
  id: string;
};

export function CreateRoomForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createRoomForm = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutateAsync: createRoom } = useMutation({
    mutationFn: async (data: CreateRoomFormData) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result: CreateRoomApiResponse = await response.json();

      return result;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["get-rooms"] });
      navigate(`/rooms/${response.id}`);
    },
  });

  async function handleCreateRoom(data: CreateRoomFormData) {
    await createRoom(data);

    createRoomForm.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a new room</CardTitle>
        <CardDescription>
          Create a new room to start a new conversation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...createRoomForm}>
          <form
            className="flex flex-col gap-4"
            onSubmit={createRoomForm.handleSubmit(handleCreateRoom)}
          >
            <FormField
              control={createRoomForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter room name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={createRoomForm.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter room description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              Create room
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
