import { useQuery } from '@tanstack/react-query';
import { meetingService } from '@/src/services/meeting.service';
import { queryKeys } from '@/src/constants/queryKeys';

export const useRecentMeetings = (limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.meetings.recent(limit),
    queryFn: () => meetingService.getRecentMeetings(limit),
    staleTime: 30000, // 30 seconds
  });
};

export const useMeetingDetails = (idOrCode: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.meetings.detail(idOrCode),
    queryFn: () => meetingService.getMeetingDetails(idOrCode),
    enabled: !!idOrCode && enabled,
    staleTime: 10000, // 10 seconds
  });
};
