export default function SandboxPage() {
  const numbers = [1, 2, 3, 3];

  function hasDuplicates(numbers: number[]) {
    const seen = new Set<number>();

    for (const number of numbers) {
      if (seen.has(number)) {
        return true;
      }
      seen.add(number);
    }

    return false;
  }

  console.log(hasDuplicates(numbers));

  return (
    <div>
      <h1>Sandbox</h1>
    </div>
  );
}
