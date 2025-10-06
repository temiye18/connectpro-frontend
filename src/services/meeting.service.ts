import { apiClient } from '@/src/lib/axios';

export interface Meeting {
  _id: string;
  title: string;
  meetingCode: string;
  host: {
    _id: string;
    name: string;
    email?: string;
  };
  status: 'scheduled' | 'active' | 'ended';
  participants: Array<{
    userId: string;
    name: string;
    joinedAt: string;
    leftAt?: string;
    camera: boolean;
    microphone: boolean;
  }>;
  settings: {
    waitingRoom: boolean;
    chat: boolean;
    screenSharing: boolean;
    recording: boolean;
  };
  startedAt?: string;
  endedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeetingData {
  title?: string;
  settings?: {
    waitingRoom?: boolean;
    chat?: boolean;
    screenSharing?: boolean;
    recording?: boolean;
  };
}

export interface JoinMeetingData {
  meetingCode: string;
  name?: string;
  settings?: {
    camera?: boolean;
    microphone?: boolean;
  };
}

export interface MeetingResponse {
  success?: boolean;
  message?: string;
  meetingId?: string;
  meetingLink?: string;
  meetingCode?: string;
  roomToken?: string;
  createdAt?: string;
  meeting?: Meeting;
  data?: {
    meeting: Meeting;
    meetingLink?: string;
    roomToken?: string;
  };
}

export interface RecentMeetingsResponse {
  success: boolean;
  data: {
    meetings: Meeting[];
    total: number;
  };
}

export const meetingService = {
  // Create instant meeting
  createMeeting: async (data?: CreateMeetingData): Promise<MeetingResponse> => {
    const response = await apiClient.post<MeetingResponse>('/meetings', data || {});
    return response.data;
  },

  // Get recent meetings
  getRecentMeetings: async (limit: number = 10): Promise<RecentMeetingsResponse> => {
    const response = await apiClient.get<RecentMeetingsResponse>(`/meetings/recent?limit=${limit}`);
    return response.data;
  },

  // Join meeting by code
  joinMeeting: async (data: JoinMeetingData): Promise<MeetingResponse> => {
    const response = await apiClient.post<MeetingResponse>('/meetings/join', data);
    return response.data;
  },

  // Start existing meeting
  startMeeting: async (meetingId: string): Promise<MeetingResponse> => {
    const response = await apiClient.post<MeetingResponse>(`/meetings/${meetingId}/start`);
    return response.data;
  },

  // Get meeting details
  getMeetingDetails: async (idOrCode: string): Promise<MeetingResponse> => {
    const response = await apiClient.get<MeetingResponse>(`/meetings/${idOrCode}`);
    return response.data;
  },

  // Leave meeting
  leaveMeeting: async (meetingId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(`/meetings/${meetingId}/leave`);
    return response.data;
  },

  // End meeting (host only)
  endMeeting: async (meetingId: string): Promise<{ success: boolean; message: string }> => {
    const response = await apiClient.post(`/meetings/${meetingId}/end`);
    return response.data;
  },
};
