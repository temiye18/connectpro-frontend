/**
 * Centralized Query Keys for TanStack Query
 *
 * Best Practices:
 * - Use hierarchical keys from general to specific
 * - Use objects to group related keys
 * - Make keys type-safe with 'as const'
 * - Include dynamic parameters in key arrays
 */

export const queryKeys = {
  // Authentication
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Meetings
  meetings: {
    all: ['meetings'] as const,
    lists: () => [...queryKeys.meetings.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.meetings.lists(), { filters }] as const,
    details: () => [...queryKeys.meetings.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.meetings.details(), id] as const,
    recent: (limit?: number) => [...queryKeys.meetings.all, 'recent', limit] as const,
    verify: (code: string) => [...queryKeys.meetings.all, 'verify', code] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
    detail: (id: string) => [...queryKeys.users.all, 'detail', id] as const,
  },
} as const;
