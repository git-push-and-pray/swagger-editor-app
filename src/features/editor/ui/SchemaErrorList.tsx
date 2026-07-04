import type { SchemaError } from '../model/types';

interface Props {
  errors: SchemaError[];
}

export function SchemaErrorList({ errors }: Props) {
  return (
    <ul
      className="border-error/30 bg-error/10 text-errordark border-t px-4 py-2 text-sm"
      role="alert"
    >
      {errors.map((error) => (
        <li key={`${error.message}-${error.line}-${error.column}`}>
          {error.line !== undefined && (
            <span className="font-medium">
              Line {error.line}
              {error.column !== undefined && `, column ${error.column}`}:{' '}
            </span>
          )}
          {error.message}
        </li>
      ))}
    </ul>
  );
}
