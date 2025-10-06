import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { meetingService, CreateMeetingData, JoinMeetingData } from '@/src/services/meeting.service';
import { queryKeys } from '@/src/constants/queryKeys';

export const useCreateMeeting = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data?: CreateMeetingData) => meetingService.createMeeting(data),
    onSuccess: (response) => {
      // Invalidate recent meetings query
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings.recent() });

      // Redirect to meeting room
      router.push(`/meeting/${response.data.meeting._id}`);
    },
  });
};

export const useJoinMeeting = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: JoinMeetingData) => meetingService.joinMeeting(data),
    onSuccess: (response) => {
      // Backend returns flat response: { meetingId, roomToken, participants }
      const meetingId = response.meetingId || response.data?.meeting?._id;

      // Invalidate recent meetings query
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings.recent() });

      // Redirect to meeting room
      if (meetingId) {
        router.push(`/meeting/${meetingId}`);
      }
    },
  });
};

export const useStartMeeting = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: string) => meetingService.startMeeting(meetingId),
    onSuccess: (response) => {
      // Backend returns flat response: { meetingId, meetingLink, status }
      const meetingId = response.meetingId || response.data?.meeting?._id;

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings.recent() });
      if (meetingId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.meetings.detail(meetingId) });
      }

      // Redirect to meeting room
      if (meetingId) {
        router.push(`/meeting/${meetingId}`);
      }
    },
  });
};

export const useLeaveMeeting = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: string) => meetingService.leaveMeeting(meetingId),
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings.recent() });

      // Redirect to dashboard
      router.push('/dashboard');
    },
  });
};

export const useEndMeeting = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (meetingId: string) => meetingService.endMeeting(meetingId),
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings.recent() });

      // Redirect to dashboard
      router.push('/dashboard');
    },
  });
};
