'use client';

import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Loader2, Video, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { storageService } from '@/lib/firebase/storage';

import { CreateFeedPostFormValues, createFeedPostSchema } from '../schemas/posts.schema';
import { CreateFeedPostRequest, FeedMediaType, FeedVisibility } from '../types';

interface CreatePostFormProps {
  userId: string;
  onSubmit: (data: CreateFeedPostRequest) => Promise<void>;
  onCancel?: () => void;
}

export function CreatePostForm({ userId, onSubmit, onCancel }: CreatePostFormProps) {
  const defaultUserId = userId?.trim() || 'admin';
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const form = useForm<CreateFeedPostFormValues>({
    resolver: zodResolver(createFeedPostSchema),
    defaultValues: {
      userId: defaultUserId,
      groupId: undefined,
      content: '',
      isAnonymous: false,
      mediaType: FeedMediaType.Text,
      mediaUrls: [],
      thumbnailUrl: '',
      visibility: FeedVisibility.Public,
    },
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = form;

  const mediaType = watch('mediaType');
  const thumbnailUrl = watch('thumbnailUrl');
  const contentText = watch('content') || '';

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'mediaUrls',
  });

  // Clear attachments if user toggles back to 'Text'
  useEffect(() => {
    if (mediaType === FeedMediaType.Text) {
      setValue('mediaUrls', []);
      setValue('thumbnailUrl', '');
    }
  }, [mediaType, setValue]);

  // Upload handler for photos/videos
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const downloadUrl = await storageService.uploadFile('feed_posts', file);
      update(index, { url: downloadUrl });
      toast.success('Media uploaded successfully');
    } catch (err: any) {
      console.error('Failed to upload media:', err);
      toast.error(err.message || 'Failed to upload file');
    } finally {
      setUploadingIndex(null);
      e.target.value = '';
    }
  };

  // Upload handler for video thumbnail
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingThumbnail(true);
    try {
      const downloadUrl = await storageService.uploadFile('feed_posts/thumbnails', file);
      setValue('thumbnailUrl', downloadUrl);
      toast.success('Thumbnail uploaded successfully');
    } catch (err: any) {
      console.error('Failed to upload thumbnail:', err);
      toast.error(err.message || 'Failed to upload thumbnail');
    } finally {
      setUploadingThumbnail(false);
      e.target.value = '';
    }
  };

  // Delete media from state + Firebase Storage
  const handleRemoveMedia = async (index: number, url: string) => {
    remove(index);
    if (url) {
      try {
        await storageService.deleteByUrl(url);
      } catch (err) {
        console.warn('Could not delete file from storage:', err);
      }
    }
  };

  // Delete thumbnail from state + Firebase Storage
  const handleRemoveThumbnail = async () => {
    const currentThumbnail = thumbnailUrl;
    setValue('thumbnailUrl', '');
    if (currentThumbnail) {
      try {
        await storageService.deleteByUrl(currentThumbnail);
      } catch (err) {
        console.warn('Could not delete thumbnail from storage:', err);
      }
    }
  };

  const submit = async (values: CreateFeedPostFormValues) => {
    const request: CreateFeedPostRequest = {
      userId: values.userId ?? 'admin',
      groupId: values.groupId,
      isAnonymous: values.isAnonymous,
      content: values.content,
      mediaType: values.mediaType,
      mediaUrls: values.mediaUrls.map((item) => item.url).filter(Boolean),
      thumbnailUrl: values.thumbnailUrl || undefined,
      visibility: values.visibility,
    };

    await onSubmit(request);
  };

  const isUploadingMedia = uploadingIndex !== null || uploadingThumbnail;
  const isLoading = isSubmitting || isUploadingMedia;

  return (
    <div className="space-y-6">
      <form id="create-post-form" onSubmit={handleSubmit(submit)}>
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Create New Post</CardTitle>
            <p className="text-muted-foreground text-sm">
              Share updates, media, or questions with your community.
            </p>
          </CardHeader>

          <CardContent>
            <FieldSet>
              <FieldGroup className="space-y-5">
                {/* Post Content */}
                <Controller
                  name="content"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="content">Post Content</FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id="content"
                          rows={4}
                          placeholder="What's on your mind?"
                          disabled={isLoading}
                          aria-invalid={fieldState.invalid}
                          className="min-h-[120px] resize-none"
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {contentText.length} characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                {/* Anonymous Switch */}
                <Controller
                  name="isAnonymous"
                  control={control}
                  render={({ field }) => (
                    <Field className="flex items-center justify-between space-y-0 rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FieldLabel className="text-base font-medium">Post Anonymously</FieldLabel>
                        <FieldDescription>
                          Hide your name and profile details on this post.
                        </FieldDescription>
                      </div>
                      <Toggle
                        pressed={field.value}
                        onPressedChange={field.onChange}
                        variant="outline"
                        disabled={isLoading}
                      >
                        Anonymous
                      </Toggle>
                    </Field>
                  )}
                />

                {/* Visibility & Media Type Selectors */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Controller
                    name="visibility"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="visibility">Visibility</FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoading}
                        >
                          <SelectTrigger id="visibility" aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(FeedVisibility).map((vis) => (
                              <SelectItem key={vis} value={vis}>
                                {vis}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="mediaType"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="mediaType">Media Type</FieldLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isLoading}
                        >
                          <SelectTrigger id="mediaType" aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select media type" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(FeedMediaType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>

                {/* Dynamic Media Attachments */}
                {mediaType !== FeedMediaType.Text && (
                  <div className="space-y-3">
                    <FieldLabel>Upload Media Files</FieldLabel>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      {fields.map((field, index) => {
                        const currentUrl = field.url;
                        const isUploading = uploadingIndex === index;

                        return (
                          <div
                            key={field.id}
                            className="border-muted-foreground/25 hover:border-muted-foreground/50 relative flex h-32 flex-col items-center justify-center rounded-lg border-2 border-dashed p-2 transition-colors"
                          >
                            {isUploading ? (
                              <div className="text-muted-foreground flex flex-col items-center gap-1 text-xs">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Uploading...</span>
                              </div>
                            ) : currentUrl ? (
                              <div className="relative h-full w-full overflow-hidden rounded bg-black/5">
                                {mediaType === FeedMediaType.Video ? (
                                  <video
                                    src={currentUrl}
                                    className="h-full w-full object-cover"
                                    controls={false}
                                  />
                                ) : (
                                  <img
                                    src={currentUrl}
                                    alt="Uploaded attachment"
                                    className="h-full w-full object-cover"
                                  />
                                )}
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-1 right-1 h-6 w-6 rounded-full"
                                  onClick={() => handleRemoveMedia(index, currentUrl)}
                                  disabled={isLoading}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1">
                                {mediaType === FeedMediaType.Video ? (
                                  <Video className="text-muted-foreground h-6 w-6" />
                                ) : (
                                  <ImagePlus className="text-muted-foreground h-6 w-6" />
                                )}
                                <span className="text-muted-foreground text-xs">
                                  Select {mediaType === FeedMediaType.Video ? 'Video' : 'Image'}
                                </span>
                                <input
                                  type="file"
                                  accept={mediaType === FeedMediaType.Video ? 'video/*' : 'image/*'}
                                  className="hidden"
                                  disabled={isLoading}
                                  onChange={(e) => handleMediaUpload(e, index)}
                                />
                              </label>
                            )}
                          </div>
                        );
                      })}

                      {/* Add Attachment Slot */}
                      <button
                        type="button"
                        onClick={() => append({ url: '' })}
                        disabled={isLoading}
                        className="border-muted-foreground/25 text-muted-foreground hover:border-primary hover:text-primary flex h-32 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-2 transition-colors disabled:pointer-events-none disabled:opacity-50"
                      >
                        <ImagePlus className="h-6 w-6" />
                        <span className="text-xs font-medium">Add Media Slot</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Video Thumbnail Section */}
                {mediaType === FeedMediaType.Video && (
                  <div className="space-y-2">
                    <FieldLabel>Video Cover / Thumbnail</FieldLabel>

                    {thumbnailUrl ? (
                      <div className="relative h-32 w-48 overflow-hidden rounded-lg border">
                        <img
                          src={thumbnailUrl}
                          alt="Video thumbnail"
                          className="h-full w-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 rounded-full"
                          onClick={handleRemoveThumbnail}
                          disabled={isLoading}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="thumbnail-input"
                          className="border-input bg-background hover:bg-accent flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium"
                        >
                          {uploadingThumbnail ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ImagePlus className="h-4 w-4" />
                          )}
                          <span>{uploadingThumbnail ? 'Uploading...' : 'Upload Thumbnail'}</span>
                        </Label>
                        <input
                          id="thumbnail-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingThumbnail || isLoading}
                          onChange={handleThumbnailUpload}
                        />
                      </div>
                    )}
                  </div>
                )}
              </FieldGroup>
            </FieldSet>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={() => reset()} disabled={isLoading}>
              Reset
            </Button>
            <Button type="submit" form="create-post-form" disabled={isLoading}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                </span>
              ) : (
                'Create Post'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
