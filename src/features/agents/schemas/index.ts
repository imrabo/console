import * as zod from 'zod';

export const createAgentSchema = zod.object({
  title: zod.string().min(3, 'Title must be at least 3 characters'),
  description: zod.string().min(5, 'Description must be at least 5 characters'),
  organizerName: zod.string().min(2, 'Organizer name must be at least 2 characters'),
  category: zod.string().min(1, 'Please select a category'),
  date: zod.string().min(1, 'Please choose a date'),
  time: zod.string().min(1, 'Please choose a time'),
  locationName: zod.string().min(3, 'Location name is required'),
  latitude: zod.coerce.number().min(-90).max(90),
  longitude: zod.coerce.number().min(-180).max(180),
  maxRegistrations: zod.coerce.number().min(2, 'Minimum registration size is 2').default(10),
});

export type CreateAgentFormValues = zod.infer<typeof createAgentSchema>;
