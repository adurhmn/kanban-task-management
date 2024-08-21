import { useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./components/core";
import { Subtask } from "./components/ui/subtask";

function App() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="h1 text-cust-prim">Hello World</h1>
      <h1 className="h2">Hello World</h1>
      <h1 className="h3">Hello World</h1>
      <Button variant={"primary"} size={"default"}>
        Button
      </Button>
      <Button variant={"primary"} size={"lg"}>
        Button
      </Button>
      <Button variant={"secondary"} size={"default"}>
        Button
      </Button>
      <Button variant={"secondary"} size={"lg"}>
        Button
      </Button>
      <Button variant={"destructive"} size={"default"}>
        Button
      </Button>
      <Button variant={"destructive"} size={"lg"}>
        Button
      </Button>
      <Subtask
        checked={checked}
        onCheckedChange={(c) => {
          console.log("exec");
          setChecked(c);
        }}
        task="Testing 1, 2, 3..."
      />
      <Input placeholder="Testing 1, 2, 3..." errMsg="Can't be empty" />
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default App;
