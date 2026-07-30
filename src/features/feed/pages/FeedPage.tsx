import React, { useState } from 'react';
import { usePostsQuery, useDeletePostMutation, useCreatePostMutation } from '../hooks/useFeed';
import { FeedStatus } from '../types';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

import { Heart, MessageSquare, Trash2, AlertTriangle, MoreHorizontal, Pencil } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Dialog,} from '@/components/ui/dialog';
import { CreatePostForm } from '../components/CreatePostForm';

export const FeedPage: React.FC = () => {
  const { data, isLoading } = usePostsQuery();
  const deletePostMutation = useDeletePostMutation();
  const [open, setOpen] = useState(false);

  const createPostMutation = useCreatePostMutation();

  const handleDeletePost = (id: string) => {
    if (confirm('Are you sure you want to permanently delete this post?')) {
      deletePostMutation.mutate(id);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="animate-fade-in bg-background min-h-screen">
      {' '}
      {/* Single top-level wrapper */}
      {/* Main Feed Content Area */}
      <div className="mx-auto w-full max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Anonymous Support Board</h1>

          <p className="text-muted-foreground mt-2">Community discussions and moderation feed.</p>
        </div>

        {/* Loading, Empty, Feed */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        )}

        {!isLoading && (data ?? []).length === 0 && (
          <Card>
            <CardContent className="text-muted-foreground py-16 text-center">
              No posts available.
            </CardContent>
          </Card>
        )}

        {/* Feed */}
        <div className="space-y-5">
          {(data ?? []).map((post) => {
            let statusColor = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

            if (post.status === FeedStatus.Active)
              statusColor = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';

            if (post.status === FeedStatus.Hidden)
              statusColor =
                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';

            if (post.status === FeedStatus.Deleted)
              statusColor = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';

            return (
              <Card
                key={post.id}
                className="overflow-hidden rounded-xl transition-all hover:shadow-md"
              >
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold">
                      A
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Anonymous Parent</h3>

                        <span className="text-muted-foreground text-sm">•</span>

                        <span className="text-muted-foreground text-sm">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="text-muted-foreground text-xs">@{post.id.slice(0, 6)}</p>
                    </div>

                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="mt-5">
                    <p className="text-[15px] leading-7 whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {/* Moderation */}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span
                      className={cn('rounded-full px-3 py-1 text-xs font-semibold', statusColor)}
                    >
                      {post.status}
                    </span>

                    {post.reportCount > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        <AlertTriangle className="h-3 w-3" />
                        {post.reportCount} Reports
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between border-t pt-4">
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Heart className="h-4 w-4" />
                      {post.likeCount}
                    </Button>

                    <Button variant="ghost" size="sm" className="gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {post.commentCount}
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      disabled={deletePostMutation.isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>{' '}
      {/* End of the main content wrapper */}
      {/* Floating UI Elements (Button and Dialog) - These are siblings to the main feed container, so they must be outside the primary flow but within the overall return JSX. */}
      <>
        <Button
          size="icon"
          className="fixed right-6 bottom-6 z-50 h-14 w-14 rounded-full shadow-xl"
          onClick={() => setOpen(true)}
        >
          <Pencil className="h-6 w-6" />
        </Button>

        <Dialog open={open} onOpenChange={setOpen}>
          <CreatePostForm
            userId=""
            onSubmit={async (data) => {
              try {
                await createPostMutation.mutateAsync(data);
                setOpen(false);
              } catch (e) {
                // Handle mutation failure if needed
              }
            }}
          />
        </Dialog>
      </>
    </div>
  );
};

export default FeedPage;
