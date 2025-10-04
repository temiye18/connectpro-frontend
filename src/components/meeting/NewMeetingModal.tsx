'use client';

import { useState } from 'react';
import { Video, Mic, Copy } from 'lucide-react';
import { Modal } from '@/src/components/ui/Modal';
import { Toggle } from '@/src/components/ui/Toggle';
import { Button } from '@/src/components/ui/Button';

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewMeetingModal({ isOpen, onClose }: NewMeetingModalProps) {
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  // TODO: Generate actual meeting link from backend
  const meetingLink = 'https://connectpro.com/meet/a7b5';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleStartMeeting = () => {
    // TODO: Implement start meeting logic
    console.log('Starting meeting with settings:', {
      camera: cameraEnabled,
      microphone: microphoneEnabled,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Start your meeting</h2>

        {/* Meeting Link */}
        <div className="bg-[#374151] rounded-lg p-4 mb-8 flex items-center justify-between">
          <span className="text-gray-300 text-sm flex-1 truncate">{meetingLink}</span>
          <button
            onClick={handleCopyLink}
            className="ml-3 text-blue-500 hover:text-blue-400 font-semibold text-sm transition-colors flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>

        {/* Quick Settings */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 text-left">Quick settings</h3>
          <div className="space-y-4">
            {/* Camera Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-gray-400" />
                <span className="text-white">Camera</span>
              </div>
              <Toggle enabled={cameraEnabled} onChange={setCameraEnabled} />
            </div>

            {/* Microphone Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-gray-400" />
                <span className="text-white">Microphone</span>
              </div>
              <Toggle enabled={microphoneEnabled} onChange={setMicrophoneEnabled} />
            </div>
          </div>
        </div>

        {/* Start Meeting Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleStartMeeting}
          className="mb-4"
        >
          Start Meeting
        </Button>

        {/* Share via Email */}
        <button className="text-gray-400 hover:text-white text-sm underline transition-colors">
          Share via email
        </button>
      </div>
    </Modal>
  );
}
