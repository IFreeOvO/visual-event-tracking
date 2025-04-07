import type { Tracking } from '@/models/vo/tracking.vo'

export type CreateTrackingDto = Omit<Tracking, 'id'>
