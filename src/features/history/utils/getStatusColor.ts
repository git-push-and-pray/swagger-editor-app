export function getStatusClasses(status: number) {
  if (status >= 200 && status < 300) {
    return {
      text: 'text-accent',
      dot: 'bg-accent',
    };
  }

  if (status >= 400 && status < 500) {
    return {
      text: 'text-warning',
      dot: 'bg-warning',
    };
  }

  return {
    text: 'text-error',
    dot: 'bg-error',
  };
}
