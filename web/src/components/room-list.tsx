import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatRelativeDate } from "@/utils/date";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

type GetRoomsApiResponse = {
  id: string;
  name: string;
  questionCount: number;
  createdAt: string;
};

export function RoomList() {
  const { data: rooms } = useQuery({
    queryKey: ["get-rooms"],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/rooms`);
      const data: GetRoomsApiResponse[] = await response.json();

      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent rooms</CardTitle>
        <CardDescription>Quickly access your recent rooms</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {rooms?.map((room) => (
          <Link
            className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50"
            key={room.id}
            to={`/rooms/${room.id}`}
          >
            <div className="flex flex-1 flex-col gap-1">
              <h3 className="font-medium">{room.name}</h3>

              <div className="flex items-center gap-2">
                <Badge className="text-xs" variant="secondary">
                  {formatRelativeDate(room.createdAt)}
                </Badge>

                <Badge className="text-xs" variant="secondary">
                  {room.questionCount} question(s)
                </Badge>
              </div>
            </div>

            <span className="flex items-center gap-1 text-sm">
              Join
              <ArrowRight className="size-3" />
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
