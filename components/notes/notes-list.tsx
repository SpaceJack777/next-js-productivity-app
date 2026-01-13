import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";

export default function NotesList() {
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>Notes</CardContent>
    </Card>
  );
}
