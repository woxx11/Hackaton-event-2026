export function InlineFormMessage({ error, success }: { error?: string; success?: string }) {
  if (!error && !success) return null;
  return <p className={error ? "text-sm text-danger" : "text-sm text-success"}>{error ?? success}</p>;
}
