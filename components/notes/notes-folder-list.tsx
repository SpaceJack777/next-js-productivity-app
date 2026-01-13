"use client";

import {
  FolderItem,
  FolderTrigger,
  FolderContent,
  Files,
  SubFiles,
} from "@/components/animate-ui/components/radix/files";
import { CardAction, CardHeader, CardTitle } from "../ui/card";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { FolderPlus } from "lucide-react";

export default function NotesFolderList() {
  return (
    <Card className="max-w-[300px]">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Folders</CardTitle>
        <CardAction>
          <Button variant="outline" size="sm">
            <FolderPlus /> New folder
          </Button>
        </CardAction>
      </CardHeader>
      <Files className="w-full px-4" defaultOpen={["app"]}>
        <FolderItem value="app">
          <FolderTrigger className="w-full flex items-center justify-between">
            app
          </FolderTrigger>

          <FolderContent>
            <SubFiles defaultOpen={["(home)"]}>
              <FolderItem value="(home)">
                <FolderTrigger>(home)</FolderTrigger>
              </FolderItem>
            </SubFiles>
          </FolderContent>
        </FolderItem>

        <FolderItem value="components">
          <FolderTrigger>
            components componentscomponents componentscomponentscomp
            onentscomponentscomp onents
          </FolderTrigger>

          <FolderContent>
            <SubFiles defaultOpen={["(home)"]}>
              <FolderItem value="(home)">
                <FolderTrigger>(home)</FolderTrigger>
              </FolderItem>
            </SubFiles>
          </FolderContent>
        </FolderItem>
      </Files>
    </Card>
  );
}
