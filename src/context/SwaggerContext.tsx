// import { createContext, useState, ReactNode } from 'react';
// import { MOCK_SCHEMA_YAML } from '@/mocks/swaggerSchema';

// interface SwaggerContextType {
//   schema: string;
//   format: 'json' | 'yaml';
//   setSchema: (schema: string) => void;
//   setFormat: (format: 'json' | 'yaml') => void;
// }

// export const SwaggerContext = createContext<SwaggerContextType | undefined>(undefined);

// export function SwaggerProvider({ children }: { children: ReactNode }) {
//   const [schema, setSchema] = useState(MOCK_SCHEMA_YAML);
//   const [format, setFormat] = useState<'json' | 'yaml'>('yaml');

//   return (
//     <SwaggerContext.Provider value={{ schema, format, setSchema, setFormat }}>
//       {children}
//     </SwaggerContext.Provider>
//   );
// }

// src/context/SwaggerContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { SchemaFormat } from '@/types/openapi';
import { MOCK_SCHEMA_YAML } from '@/mocks/swaggerSchema';

interface SwaggerContextType {
  schema: string;
  format: SchemaFormat;
  setSchema: (schema: string) => void;
  setFormat: (format: SchemaFormat) => void;
  isValid: boolean;
  setIsValid: (isValid: boolean) => void;
  errors: string[];
  setErrors: (errors: string[]) => void;
}

const SwaggerContext = createContext<SwaggerContextType | undefined>(undefined);

export function SwaggerProvider({ children }: { children: ReactNode }) {
  const [schema, setSchema] = useState<string>(MOCK_SCHEMA_YAML);
  const [format, setFormat] = useState<SchemaFormat>('yaml');
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errors, setErrors] = useState<string[]>([]);

  return (
    <SwaggerContext.Provider
      value={{
        schema,
        format,
        setSchema,
        setFormat,
        isValid,
        setIsValid,
        errors,
        setErrors,
      }}
    >
      {children}
    </SwaggerContext.Provider>
  );
}

export function useSwaggerContext() {
  const context = useContext(SwaggerContext);
  if (context === undefined) {
    throw new Error('useSwaggerContext must be used within a SwaggerProvider');
  }
  return context;
}