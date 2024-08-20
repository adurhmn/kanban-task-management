import { Button } from "./components/ui/button"

function App() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className='h1 text-x-prim'>Hello World</h1>
      <h1 className='h2'>Hello World</h1>
      <h1 className='h3'>Hello World</h1>
      <Button variant={"primary"} size={"default"}>Button</Button>
      <Button variant={"primary"} size={"lg"}>Button</Button>
      <Button variant={"secondary"} size={"default"}>Button</Button>
      <Button variant={"secondary"} size={"lg"}>Button</Button>
      <Button variant={"destructive"} size={"default"}>Button</Button>
      <Button variant={"destructive"} size={"lg"}>Button</Button>
    </div>
  )
}

export default App
