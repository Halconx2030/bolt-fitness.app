import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ZodType } from 'zod';

export function useZodForm<T extends ZodType<any, any>>(schema: T) {
  return useForm({
    resolver: zodResolver(schema),
  });
}
