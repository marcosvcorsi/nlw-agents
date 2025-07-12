import { useQuery } from "@tanstack/react-query";
import { QuestionItem } from "./question-item";

type QuestionListParams = {
  roomId: string;
};

export type GetQuestionsApiResponse = {
  id: string;
  question: string;
  answer?: string | null;
  createdAt: string;
};

export function QuestionList({ roomId }: QuestionListParams) {
  const { data: questions } = useQuery({
    queryKey: ["get-questions", roomId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/rooms/${roomId}/questions`
      );

      const data: GetQuestionsApiResponse[] = await response.json();

      return data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-2xl text-foreground">
          Perguntas & Respostas
        </h2>
      </div>

      {questions?.map((question) => (
        <QuestionItem key={question.id} question={question} />
      ))}
    </div>
  );
}
