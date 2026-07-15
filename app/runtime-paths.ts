const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const runtimeBasePath = rawBasePath.endsWith("/")
  ? rawBasePath.slice(0, -1)
  : rawBasePath;

export function withBasePath(path: string) {
  if (!runtimeBasePath) {
    return path;
  }

  if (path === "/") {
    return runtimeBasePath || "/";
  }

  return `${runtimeBasePath}${path}`;
}
