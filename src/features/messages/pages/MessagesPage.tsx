'use client';

import React, { useEffect } from 'react';
import { useCreateMessageMutation, useMessagesQuery } from '../hooks/useMessages';
import { Users, Globe, Circle, Paperclip, Smile, Send } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useCommunityQuery } from '@/features/community';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function MessagesPage() {
  const { id } = useParams();

  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const createMessage = useCreateMessageMutation();

  const { data: messages, isLoading: messagesLoading } = useMessagesQuery(id as string);

  const { data: community, isLoading: communityLoading } = useCommunityQuery(id as string);

  const handleSend = async () => {
    if (!message.trim()) return;

    createMessage.mutate({
      conversationId: id,
      senderId: 'current-user-id',
      senderName: 'Admin',
      message,
      type: 'text',
    });

    setMessage('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // upload to Firebase Storage

    // const mediaUrl = await uploadFile(file);

    createMessage.mutate({
      conversationId: id,
      senderId: 'current-user-id',
      senderName: 'Admin',
      type: file.type.startsWith('image') ? 'image' : 'file',

      mediaUrl: '',

      fileName: file.name,

      fileSize: file.size,
    });
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  if (messagesLoading || communityLoading) {
    return <Spinner />;
  }

  return (
    <div className="bg-background flex h-[calc(100vh-80px)] flex-col rounded-2xl border">
      {/* Header */}

      <div className="border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={community?.imageUrl ?? undefined} alt={community?.name ?? ''} />
              <AvatarFallback className="rounded-lg">
                {community?.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold"> {community?.name}</h2>

            <div className="text-muted-foreground mt-1 flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {community?.memberCount} Members
              </span>

              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                {community?.visibility}
              </span>

              <span className="flex items-center gap-1 text-green-600">
                <Circle className="h-2 w-2 fill-current" />
                {community?.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat */}

      <div className="bg-muted/20 flex-1 overflow-y-auto p-6">
        <div className="mb-6 text-center">
          <span className="bg-muted rounded-full px-4 py-1 text-xs font-semibold">Today</span>
        </div>

        {messagesLoading ? (
          <p>Loading messages...</p>
        ) : (
          <div className="space-y-5">
            {(messages ?? []).map((message) => {
              const mine = message.senderId === 'current-user';

              return (
                <div key={message.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-md">
                    {!mine && (
                      <p className="text-muted-foreground mb-1 text-xs font-semibold">
                        {message.senderName}
                      </p>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        mine ? 'bg-primary text-primary-foreground' : 'bg-card'
                      }`}
                    >
                      {message.type === 'text' && <p>{message.message}</p>}

                      {message.type === 'image' && (
                        <>
                          <img src={message.mediaUrl} alt="" className="mb-2 rounded-lg" />

                          {message.message && <p>{message.message}</p>}
                        </>
                      )}

                      {message.type === 'location' && <div>📍 {message.message}</div>}

                      {message.type === 'file' && (
                        <div className="flex items-center gap-2">
                          📄
                          <div>
                            <p>{message.fileName}</p>

                            <p className="text-xs opacity-70">
                              {(message.fileSize! / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="text-muted-foreground mt-1 text-right text-xs">
                      {message.createdAt.toString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Composer */}

      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setShowEmoji((p) => !p)}>
              <Smile className="h-5 w-5" />
            </button>

            {showEmoji && (
              <div className="absolute bottom-14 left-0 z-50">
                <EmojiPicker onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)} />
              </div>
            )}
          </div>

          <input ref={fileInputRef} hidden type="file" onChange={handleFileUpload} />
          <button onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-5 w-5" />
          </button>

          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          <Button
            onClick={handleSend}
            disabled={createMessage.isPending || !message.trim()}
            size="icon"
            className="rounded-full"
          >
            {createMessage.isPending ? <Spinner /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
